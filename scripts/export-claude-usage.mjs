import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const INPUT_PATH =
  process.env.CLAUDE_STATS_PATH || join(homedir(), ".claude", "stats-cache.json");
const OUTPUT_PATH = join(process.cwd(), "public", "data", "claude-usage.json");
const HEATMAP_START_DATE = process.env.CLAUDE_HEATMAP_START || "2026-01-01";

function parseDay(day) {
  return new Date(`${day}T00:00:00Z`);
}

function toDayString(date) {
  return date.toISOString().slice(0, 10);
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function computeStreaks(activityDates) {
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
  let cursor = parseDay(dates[dates.length - 1]);
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
  return model;
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
  const raw = await readFile(INPUT_PATH, "utf8");
  const stats = JSON.parse(raw);

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
    sourcePath: "~/.claude/stats-cache.json",
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
