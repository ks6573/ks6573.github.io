import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, join } from "node:path";

const STATS_CACHE_PATH =
  process.env.CLAUDE_STATS_PATH || join(homedir(), ".claude", "stats-cache.json");
const PROJECTS_PATH =
  process.env.CLAUDE_PROJECTS_PATH || join(homedir(), ".claude", "projects");
const OUTPUT_PATH = join(process.cwd(), "public", "data", "claude-usage.json");
const HEATMAP_START_DATE = process.env.CLAUDE_HEATMAP_START || "2026-01-01";
const SESSION_ENTRY_TYPES = new Set(["user", "assistant", "attachment", "system", "progress"]);
const MESSAGE_ENTRY_TYPES = new Set(["user", "assistant"]);
const SYNTHETIC_MODEL = "<synthetic>";

function parseDay(day) {
  return new Date(`${day}T00:00:00Z`);
}

function toDayString(date) {
  return date.toISOString().slice(0, 10);
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function computeStreaks(activityDates, todayString = toDayString(new Date())) {
  if (activityDates.length === 0) {
    return { currentStreakDays: 0, longestStreakDays: 0 };
  }

  const dates = [...new Set(activityDates)].sort();
  const dateSet = new Set(dates);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const prev = parseDay(dates[i - 1]);
    const curr = parseDay(dates[i]);
    const deltaDays = Math.round((curr - prev) / 86400000);
    if (deltaDays === 1) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  let current = 0;
  let cursor = parseDay(todayString);
  while (dateSet.has(toDayString(cursor))) {
    current += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }

  return { currentStreakDays: current, longestStreakDays: longest };
}

function formatPeakHour(hour) {
  if (!Number.isFinite(hour)) return "N/A";
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function normalizeModelName(model) {
  if (!model) return "N/A";
  if (model === "claude-opus-4-7") return "Opus 4.7";
  if (model === "claude-opus-4-6") return "Opus 4.6";
  if (model === "claude-sonnet-4-6") return "Sonnet 4.6";
  if (model === "claude-haiku-4-5-20251001") return "Haiku 4.5";
  return model;
}

function nextDayString(day) {
  const date = parseDay(day);
  date.setUTCDate(date.getUTCDate() + 1);
  return toDayString(date);
}

function maxDayString(a, b) {
  if (!a) return b ?? null;
  if (!b) return a;
  return a > b ? a : b;
}

async function readDirOrEmpty(directory) {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch (_error) {
    return [];
  }
}

async function collectSessionFiles(projectsPath) {
  const projectDirectories = (await readDirOrEmpty(projectsPath))
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(projectsPath, entry.name));

  const sessionFiles = [];

  for (const projectDirectory of projectDirectories) {
    const entries = await readDirOrEmpty(projectDirectory);

    for (const entry of entries) {
      const entryPath = join(projectDirectory, entry.name);

      if (entry.isFile() && entry.name.endsWith(".jsonl")) {
        sessionFiles.push(entryPath);
        continue;
      }

      if (!entry.isDirectory()) continue;

      const subagentsDirectory = join(entryPath, "subagents");
      const subagentFiles = (await readDirOrEmpty(subagentsDirectory))
        .filter((subentry) => subentry.isFile())
        .filter((subentry) => subentry.name.startsWith("agent-") && subentry.name.endsWith(".jsonl"))
        .map((subentry) => join(subagentsDirectory, subentry.name));

      sessionFiles.push(...subagentFiles);
    }
  }

  return sessionFiles;
}

function parseSessionEntries(raw) {
  const entries = [];

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch (_error) {
      continue;
    }

    if (!SESSION_ENTRY_TYPES.has(entry?.type)) continue;
    if (entry.isSidechain === true) continue;
    if (typeof entry.timestamp !== "string") continue;

    entries.push(entry);
  }

  return entries;
}

function emptyStats() {
  return {
    dailyActivity: [],
    modelUsage: {},
    totalSessions: 0,
    totalMessages: 0,
    hourCounts: {},
    lastComputedDate: null,
  };
}

async function buildStatsFromProjects(projectsPath, options = {}) {
  const { fromDate = null } = options;
  const sessionFiles = await collectSessionFiles(projectsPath);
  if (sessionFiles.length === 0) return emptyStats();

  const dailyActivityByDate = new Map();
  const modelUsage = {};
  const hourCounts = {};
  const sessionStats = [];

  for (const sessionFile of sessionFiles) {
    let raw;
    try {
      raw = await readFile(sessionFile, "utf8");
    } catch (_error) {
      continue;
    }

    const entries = parseSessionEntries(raw);
    if (entries.length === 0) continue;

    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];
    const startedAt = new Date(firstEntry.timestamp);
    const endedAt = new Date(lastEntry.timestamp);
    if (Number.isNaN(startedAt.getTime()) || Number.isNaN(endedAt.getTime())) continue;

    const date = toDayString(startedAt);
    if (fromDate && date < fromDate) continue;

    const sessionId = basename(sessionFile, ".jsonl");
    const messageCount = entries.filter((entry) => MESSAGE_ENTRY_TYPES.has(entry.type)).length;
    const dailyActivity = dailyActivityByDate.get(date) ?? {
      date,
      messageCount: 0,
      sessionCount: 0,
      toolCallCount: 0,
    };

    dailyActivity.sessionCount += 1;
    dailyActivity.messageCount += messageCount;
    dailyActivityByDate.set(date, dailyActivity);

    const hour = startedAt.getHours();
    hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;

    sessionStats.push({
      sessionId,
      duration: endedAt.getTime() - startedAt.getTime(),
      messageCount,
      timestamp: firstEntry.timestamp,
    });

    for (const entry of entries) {
      if (entry.type !== "assistant") continue;

      const content = entry.message?.content;
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type === "tool_use") {
            dailyActivity.toolCallCount += 1;
          }
        }
      }

      const usage = entry.message?.usage;
      const model = entry.message?.model;
      if (!usage || !model || model === SYNTHETIC_MODEL) continue;

      if (!modelUsage[model]) {
        modelUsage[model] = {
          inputTokens: 0,
          outputTokens: 0,
          cacheReadInputTokens: 0,
          cacheCreationInputTokens: 0,
          webSearchRequests: 0,
          costUSD: 0,
          contextWindow: 0,
          maxOutputTokens: 0,
        };
      }

      modelUsage[model].inputTokens += numberOrZero(usage.input_tokens);
      modelUsage[model].outputTokens += numberOrZero(usage.output_tokens);
      modelUsage[model].cacheReadInputTokens += numberOrZero(usage.cache_read_input_tokens);
      modelUsage[model].cacheCreationInputTokens += numberOrZero(usage.cache_creation_input_tokens);
      modelUsage[model].webSearchRequests += numberOrZero(usage.server_tool_use?.web_search_requests);
    }
  }

  const dailyActivity = Array.from(dailyActivityByDate.values())
    .sort((a, b) => a.date.localeCompare(b.date));
  const lastComputedDate = dailyActivity.at(-1)?.date ?? null;

  return {
    dailyActivity,
    modelUsage,
    totalSessions: sessionStats.length,
    totalMessages: sessionStats.reduce((sum, session) => sum + session.messageCount, 0),
    hourCounts,
    lastComputedDate,
  };
}

async function readStatsCache() {
  const raw = await readFile(STATS_CACHE_PATH, "utf8");
  return JSON.parse(raw);
}

function mergeStats(baseStats, additionalStats) {
  const dailyActivityByDate = new Map();

  for (const item of baseStats.dailyActivity ?? []) {
    if (!item?.date) continue;
    dailyActivityByDate.set(item.date, {
      date: item.date,
      messageCount: numberOrZero(item.messageCount),
      sessionCount: numberOrZero(item.sessionCount),
      toolCallCount: numberOrZero(item.toolCallCount),
    });
  }

  for (const item of additionalStats.dailyActivity ?? []) {
    if (!item?.date) continue;
    const existing = dailyActivityByDate.get(item.date) ?? {
      date: item.date,
      messageCount: 0,
      sessionCount: 0,
      toolCallCount: 0,
    };
    existing.messageCount += numberOrZero(item.messageCount);
    existing.sessionCount += numberOrZero(item.sessionCount);
    existing.toolCallCount += numberOrZero(item.toolCallCount);
    dailyActivityByDate.set(item.date, existing);
  }

  const modelUsage = {};
  for (const stats of [baseStats, additionalStats]) {
    for (const [model, values] of Object.entries(stats.modelUsage ?? {})) {
      if (!modelUsage[model]) {
        modelUsage[model] = {
          inputTokens: 0,
          outputTokens: 0,
          cacheReadInputTokens: 0,
          cacheCreationInputTokens: 0,
          webSearchRequests: 0,
          costUSD: 0,
          contextWindow: 0,
          maxOutputTokens: 0,
        };
      }

      modelUsage[model].inputTokens += numberOrZero(values?.inputTokens);
      modelUsage[model].outputTokens += numberOrZero(values?.outputTokens);
      modelUsage[model].cacheReadInputTokens += numberOrZero(values?.cacheReadInputTokens);
      modelUsage[model].cacheCreationInputTokens += numberOrZero(values?.cacheCreationInputTokens);
      modelUsage[model].webSearchRequests += numberOrZero(values?.webSearchRequests);
      modelUsage[model].costUSD += numberOrZero(values?.costUSD);
      modelUsage[model].contextWindow = Math.max(
        modelUsage[model].contextWindow,
        numberOrZero(values?.contextWindow),
      );
      modelUsage[model].maxOutputTokens = Math.max(
        modelUsage[model].maxOutputTokens,
        numberOrZero(values?.maxOutputTokens),
      );
    }
  }

  const hourCounts = {};
  for (const stats of [baseStats, additionalStats]) {
    for (const [hour, count] of Object.entries(stats.hourCounts ?? {})) {
      hourCounts[hour] = numberOrZero(hourCounts[hour]) + numberOrZero(count);
    }
  }

  return {
    dailyActivity: Array.from(dailyActivityByDate.values())
      .sort((a, b) => a.date.localeCompare(b.date)),
    modelUsage,
    totalSessions: numberOrZero(baseStats.totalSessions) + numberOrZero(additionalStats.totalSessions),
    totalMessages: numberOrZero(baseStats.totalMessages) + numberOrZero(additionalStats.totalMessages),
    hourCounts,
    lastComputedDate: maxDayString(baseStats.lastComputedDate, additionalStats.lastComputedDate),
  };
}

async function loadStats() {
  let cacheStats = null;
  try {
    cacheStats = await readStatsCache();
  } catch (_error) {
    cacheStats = null;
  }

  const fromDate = cacheStats?.lastComputedDate ? nextDayString(cacheStats.lastComputedDate) : null;
  const projectStats = await buildStatsFromProjects(PROJECTS_PATH, { fromDate });

  if (cacheStats && projectStats.totalSessions > 0) {
    return {
      stats: mergeStats(cacheStats, projectStats),
      sourcePath: "~/.claude/stats-cache.json + ~/.claude/projects/*.jsonl",
    };
  }

  if (cacheStats) {
    return {
      stats: cacheStats,
      sourcePath: "~/.claude/stats-cache.json",
    };
  }

  return {
    stats: projectStats,
    sourcePath: "~/.claude/projects/*.jsonl",
  };
}

function buildHeatmap(dailyActivity, endDateString) {
  const dailyMap = new Map();
  for (const item of dailyActivity) {
    if (!item?.date) continue;
    dailyMap.set(item.date, numberOrZero(item.messageCount));
  }

  const start = parseDay(HEATMAP_START_DATE);
  const rawEnd = endDateString ? parseDay(endDateString) : new Date();
  const end = rawEnd < start ? start : rawEnd;

  const points = [];
  let maxCount = 0;

  for (let day = new Date(start); day <= end; day = new Date(day.getTime() + 86400000)) {
    const date = toDayString(day);
    const count = numberOrZero(dailyMap.get(date));
    if (count > maxCount) maxCount = count;
    points.push({ date, count, level: 0 });
  }

  for (const point of points) {
    const ratio = maxCount > 0 ? point.count / maxCount : 0;
    point.level =
      ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
  }

  return { days: points, maxCount };
}

async function main() {
  const { stats, sourcePath } = await loadStats();

  const dailyActivity = Array.isArray(stats.dailyActivity) ? stats.dailyActivity : [];
  const modelUsage = stats.modelUsage && typeof stats.modelUsage === "object"
    ? stats.modelUsage
    : {};
  const hourCounts = stats.hourCounts && typeof stats.hourCounts === "object"
    ? stats.hourCounts
    : {};

  const modelTotals = Object.entries(modelUsage).map(([model, values]) => {
    const input = numberOrZero(values?.inputTokens);
    const output = numberOrZero(values?.outputTokens);
    return { model, tokens: input + output };
  });

  const totalTokens = modelTotals.reduce((sum, row) => sum + row.tokens, 0);
  const favoriteModel = modelTotals.sort((a, b) => b.tokens - a.tokens)[0]?.model ?? "N/A";

  const peakHourEntry = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: Number(hour), count: numberOrZero(count) }))
    .sort((a, b) => b.count - a.count)[0];

  const activeDays = dailyActivity.filter((d) => numberOrZero(d?.messageCount) > 0).length;
  const streaks = computeStreaks(dailyActivity.map((d) => d.date).filter(Boolean));
  const heatmap = buildHeatmap(dailyActivity, stats.lastComputedDate);

  const output = {
    generatedAt: new Date().toISOString(),
    sourcePath,
    sourceLastComputedDate: stats.lastComputedDate || null,
    summary: {
      sessions: numberOrZero(stats.totalSessions),
      messages: numberOrZero(stats.totalMessages),
      totalTokens,
      activeDays,
      currentStreakDays: streaks.currentStreakDays,
      longestStreakDays: streaks.longestStreakDays,
      peakHourLabel: formatPeakHour(peakHourEntry?.hour),
      favoriteModel: normalizeModelName(favoriteModel),
    },
    heatmap,
  };

  await mkdir(join(process.cwd(), "public", "data"), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("Failed to export Claude usage:", error.message);
  process.exit(1);
});
