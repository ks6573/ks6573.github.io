import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

const username = process.env.GITHUB_USERNAME ?? "ks6573";
const from = process.env.GITHUB_FROM ?? "2026-01-01";
const to = process.env.GITHUB_TO ?? new Date().toISOString().slice(0, 10);

const outputDirectory = resolve(repoRoot, "public", "data");
const outputPath = resolve(outputDirectory, "github-contributions.json");

function readAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`${attributeName}="([^"]*)"`, "i"));
  return match ? match[1] : null;
}

function cleanText(input) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseContributionCount(text) {
  if (/no contributions/i.test(text)) {
    return 0;
  }

  const match = text.match(/(\d+)\s+contributions?/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function extractContributionDays(html) {
  const tooltipById = new Map();
  const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  let tooltipMatch = tooltipRegex.exec(html);
  while (tooltipMatch) {
    tooltipById.set(tooltipMatch[1], parseContributionCount(cleanText(tooltipMatch[2])));
    tooltipMatch = tooltipRegex.exec(html);
  }

  const days = [];
  const dayRegex = /<td\b[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
  let dayMatch = dayRegex.exec(html);

  while (dayMatch) {
    const tag = dayMatch[0];
    const date = readAttribute(tag, "data-date");
    const rawLevel = readAttribute(tag, "data-level");
    const id = readAttribute(tag, "id");

    if (!date) {
      dayMatch = dayRegex.exec(html);
      continue;
    }

    const level = Number.parseInt(rawLevel ?? "0", 10);
    const count = id ? tooltipById.get(id) ?? 0 : 0;

    days.push({
      date,
      count,
      level: Number.isFinite(level) ? Math.max(0, Math.min(4, level)) : 0,
    });

    dayMatch = dayRegex.exec(html);
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function syncContributions() {
  const calendarUrl = `https://github.com/users/${username}/contributions?from=${from}&to=${to}`;
  const response = await fetch(calendarUrl, {
    headers: { "User-Agent": "ks6573-github-pages-sync" },
  });

  if (!response.ok) {
    throw new Error(`GitHub contribution request failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const allDays = extractContributionDays(html);
  const days = allDays.filter((day) => day.date >= from && day.date <= to);
  const totalContributions = days.reduce((sum, day) => sum + day.count, 0);
  const maxCount = days.reduce((currentMax, day) => Math.max(currentMax, day.count), 0);

  const payload = {
    username,
    from,
    to,
    generatedAt: new Date().toISOString(),
    totalContributions,
    maxCount,
    days,
  };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `Synced ${days.length} days (${totalContributions} total contributions) to ${outputPath}`,
  );
}

syncContributions().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
