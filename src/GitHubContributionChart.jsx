import { useEffect, useMemo, useState } from "react";

const DAY_AXIS_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function parseDateUTC(value) {
  return new Date(`${value}T00:00:00Z`);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + amount);
  return copy;
}

function formatDateUTC(date) {
  return date.toISOString().slice(0, 10);
}

function clampLevel(level) {
  if (!Number.isFinite(level)) {
    return 0;
  }

  return Math.max(0, Math.min(4, level));
}

function buildCalendar(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return { monthLabels: [], weeks: [], dayLookup: new Map() };
  }

  const sortedDays = [...days]
    .filter((day) => typeof day?.date === "string")
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sortedDays.length === 0) {
    return { monthLabels: [], weeks: [], dayLookup: new Map() };
  }

  const firstDate = parseDateUTC(sortedDays[0].date);
  const lastDate = parseDateUTC(sortedDays[sortedDays.length - 1].date);
  const calendarStart = addDays(firstDate, -firstDate.getUTCDay());
  const calendarEnd = addDays(lastDate, 6 - lastDate.getUTCDay());

  const dayLookup = new Map();
  for (const day of sortedDays) {
    dayLookup.set(day.date, {
      date: day.date,
      count: Number.isFinite(day.count) ? day.count : 0,
      level: clampLevel(day.level),
      inRange: true,
    });
  }

  const weeks = [];
  for (let cursor = calendarStart; cursor <= calendarEnd; cursor = addDays(cursor, 7)) {
    const week = [];
    for (let offset = 0; offset < 7; offset += 1) {
      const currentDate = addDays(cursor, offset);
      const dateKey = formatDateUTC(currentDate);
      const existing = dayLookup.get(dateKey);
      const inRange = dateKey >= sortedDays[0].date && dateKey <= sortedDays[sortedDays.length - 1].date;

      week.push(
        existing ?? {
          date: dateKey,
          count: 0,
          level: 0,
          inRange,
        },
      );
    }
    weeks.push(week);
  }

  const monthLabels = weeks.map((_, weekIndex) => {
    const weekStart = addDays(calendarStart, weekIndex * 7);
    const isEarlyMonth = weekStart.getUTCDate() <= 7;
    if (!isEarlyMonth) {
      return "";
    }

    if (weekIndex > 0) {
      const previousWeekStart = addDays(weekStart, -7);
      if (previousWeekStart.getUTCMonth() === weekStart.getUTCMonth()) {
        return "";
      }
    }

    return MONTH_FORMATTER.format(weekStart);
  });

  const visibleLookup = new Map();
  for (const week of weeks) {
    for (const day of week) {
      visibleLookup.set(day.date, day);
    }
  }

  return { monthLabels, weeks, dayLookup: visibleLookup };
}

function formatContributionLine(day) {
  const readableDate = DATE_FORMATTER.format(parseDateUTC(day.date));
  if (day.count === 0) {
    return `No contributions on ${readableDate}`;
  }

  const noun = day.count === 1 ? "contribution" : "contributions";
  return `${day.count} ${noun} on ${readableDate}`;
}

function GitHubContributionChart({ username }) {
  const [payload, setPayload] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContributions() {
      try {
        const response = await fetch("./data/github-contributions.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Contribution data fetch failed");
        }

        const data = await response.json();
        if (!Array.isArray(data?.days)) {
          throw new Error("Unexpected contribution payload");
        }

        if (isMounted) {
          setPayload(data);
          setLoadError(false);
        }
      } catch (_error) {
        if (isMounted) {
          setLoadError(true);
        }
      }
    }

    loadContributions();

    return () => {
      isMounted = false;
    };
  }, []);

  const model = useMemo(() => buildCalendar(payload?.days ?? []), [payload]);
  const hoveredDay = hoveredDate ? model.dayLookup.get(hoveredDate) : null;
  const statusLine = hoveredDay
    ? formatContributionLine(hoveredDay)
    : "Hover a day to inspect contributions.";

  return (
    <article className="github-heatmap-card">
      {!payload && !loadError && <p className="muted">Loading contribution activity...</p>}

      {loadError && (
        <p className="muted small">
          Couldn't load contribution data. Run <code>npm run sync:github-contributions</code> and
          redeploy.
        </p>
      )}

      {payload && model.weeks.length > 0 && (
        <>
          <p className="github-heatmap-status">{statusLine}</p>

          <div className="github-heatmap-shell">
            <div className="github-heatmap-months">
              <span className="months-spacer" aria-hidden="true" />
              <div
                className="month-columns"
                style={{
                  "--weeks": model.weeks.length,
                }}
              >
                {model.monthLabels.map((month, weekIndex) => (
                  <span key={`month-${weekIndex}`}>{month}</span>
                ))}
              </div>
            </div>

            <div className="github-heatmap-grid">
              <div className="day-labels" aria-hidden="true">
                {DAY_AXIS_LABELS.map((label, dayIndex) => (
                  <span key={`day-label-${dayIndex}`}>{label}</span>
                ))}
              </div>

              <div className="week-columns">
                {model.weeks.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="github-week-column">
                    {week.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        className={`heatmap-cell level-${day.level}${
                          day.inRange ? "" : " outside-range"
                        }`}
                        aria-label={formatContributionLine(day)}
                        onMouseEnter={() => setHoveredDate(day.date)}
                        onMouseLeave={() => setHoveredDate(null)}
                        onFocus={() => setHoveredDate(day.date)}
                        onBlur={() => setHoveredDate(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="github-heatmap-footer">
            <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
              View full GitHub profile
            </a>
            <span className="small muted">Updated from synced contribution data</span>
          </div>
        </>
      )}
    </article>
  );
}

export default GitHubContributionChart;
