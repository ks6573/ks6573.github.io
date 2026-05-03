import { useEffect, useMemo, useState } from "react";

const METRIC_KEYS = [
  { label: "Sessions", key: "sessions" },
  { label: "Messages", key: "messages" },
  { label: "Tokens", key: "totalTokens" },
  { label: "Active days", key: "activeDays" },
];

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function formatMetricValue(key, value) {
  if (typeof value !== "number") {
    return value ?? "--";
  }

  if (key === "totalTokens" && value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  return value.toLocaleString();
}

function chunkByWeek(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return [];
  }

  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    const week = days.slice(index, index + 7);
    while (week.length < 7) {
      week.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(week);
  }

  return weeks;
}

function formatDay(day) {
  if (!day?.date) return "No activity";
  const readableDate = DATE_FORMATTER.format(new Date(`${day.date}T00:00:00Z`));
  if (!day.count) return `No Claude messages on ${readableDate}`;
  return `${day.count.toLocaleString()} Claude messages on ${readableDate}`;
}

function buildTrend(days) {
  const activeDays = Array.isArray(days) ? days.filter((day) => day.date).slice(-42) : [];
  const max = Math.max(...activeDays.map((day) => day.count || 0), 1);
  const width = 620;
  const height = 160;
  const points = activeDays.map((day, index) => {
    const x = activeDays.length === 1 ? width : (index / (activeDays.length - 1)) * width;
    const y = height - ((day.count || 0) / max) * (height - 18) - 9;
    return { ...day, x, y };
  });

  return {
    max,
    points,
    line: points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
  };
}

function ClaudeUsagePanel({ compact = false }) {
  const [payload, setPayload] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsageData() {
      try {
        const response = await fetch("./data/claude-usage.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Usage data fetch failed");
        }

        const data = await response.json();
        if (!data || typeof data !== "object") {
          throw new Error("Unexpected usage payload");
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

    loadUsageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const days = payload?.heatmap?.days ?? [];
  const weeks = useMemo(() => chunkByWeek(days), [days]);
  const trend = useMemo(() => buildTrend(days), [days]);
  const metrics = payload?.summary ?? {};
  const statusLine = hoveredDay ? formatDay(hoveredDay) : "Hover a day";

  if (!payload && !loadError) {
    return (
      <article className="signal-panel">
        <p className="muted">Loading Claude usage data...</p>
      </article>
    );
  }

  if (loadError) {
    return (
      <article className="signal-panel">
        <p className="muted small">
          Could not load Claude usage data. Update <code>public/data/claude-usage.json</code> and
          redeploy.
        </p>
      </article>
    );
  }

  return (
    <article className={`signal-panel claude-usage-card${compact ? " compact" : ""}`}>
      <div className="panel-head">
        <h2>Claude Code Usage</h2>
        <span className="panel-meta">{statusLine}</span>
      </div>

      <div className="metric-row">
        {METRIC_KEYS.map(({ label, key }) => (
          <div className="metric-tile" key={key}>
            <span>{label}</span>
            <strong>{formatMetricValue(key, metrics[key])}</strong>
          </div>
        ))}
      </div>

      {weeks.length > 0 && (
        <div className="activity-shell">
          <div className="activity-grid claude-activity-grid">
            {weeks.map((week, weekIndex) => (
              <div key={`claude-week-${weekIndex}`} className="activity-week">
                {week.map((day, dayIndex) => (
                  <button
                    key={day.date || `empty-${weekIndex}-${dayIndex}`}
                    type="button"
                    className={`activity-cell claude-cell level-${day.level || 0}`}
                    aria-label={formatDay(day)}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onFocus={() => setHoveredDay(day)}
                    onBlur={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className={`activity-cell claude-cell level-${level}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      )}

      {!compact && trend.points.length > 2 && (
        <div className="trend-panel">
          <div className="trend-head">
            <span>Claude Messages (daily)</span>
            <span>Peak {trend.max.toLocaleString()}</span>
          </div>
          <svg viewBox="0 0 620 160" role="img" aria-label="Daily Claude message trend">
            <polyline className="trend-line" points={trend.line} />
            {trend.points.map((point) => (
              <circle
                key={point.date}
                className="trend-dot"
                cx={point.x}
                cy={point.y}
                r={point.date === hoveredDay?.date ? 5 : 3}
              />
            ))}
          </svg>
        </div>
      )}
    </article>
  );
}

export default ClaudeUsagePanel;
