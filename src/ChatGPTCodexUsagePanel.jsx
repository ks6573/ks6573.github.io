import { useEffect, useMemo, useState } from "react";

const METRIC_KEYS = [
  { label: "Lifetime tokens", key: "lifetimeTokens", type: "tokens" },
  { label: "Peak tokens", key: "peakTokens", type: "tokens" },
  { label: "Longest chat", key: "longestChatSeconds", type: "duration" },
  { label: "Current streak", key: "currentStreakDays", type: "days" },
  { label: "Longest streak", key: "longestStreakDays", type: "days" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTokenCount(value) {
  if (!Number.isFinite(value)) return "--";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return value.toLocaleString();
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatMetricValue(metric, value) {
  if (metric.type === "tokens") return formatTokenCount(value);
  if (metric.type === "duration") return formatDuration(value);
  if (metric.type === "days") return `${Number.isFinite(value) ? value : 0}d`;
  return value?.toLocaleString?.() ?? value ?? "--";
}

function buildCells(weeks) {
  if (!Array.isArray(weeks)) return [];

  return weeks.map((week, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const level = Number.isFinite(week?.[dayIndex]) ? week[dayIndex] : 0;
      return {
        key: `${weekIndex}-${dayIndex}`,
        label: `${DAY_LABELS[dayIndex]} activity, week ${weekIndex + 1}`,
        level: Math.max(0, Math.min(4, level)),
      };
    }),
  );
}

function ChatGPTCodexUsagePanel() {
  const [payload, setPayload] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsageData() {
      try {
        const response = await fetch("./data/chatgpt-codex-usage.json", { cache: "no-store" });
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

  const weeks = useMemo(() => buildCells(payload?.heatmap?.weeks), [payload]);
  const summary = payload?.summary ?? {};
  const statusLine = hoveredCell
    ? `${hoveredCell.label}: level ${hoveredCell.level}`
    : "Cumulative token activity";

  if (!payload && !loadError) {
    return (
      <article className="signal-panel">
        <p className="muted">Loading ChatGPT + Codex usage data...</p>
      </article>
    );
  }

  if (loadError) {
    return (
      <article className="signal-panel">
        <p className="muted small">
          Could not load ChatGPT + Codex usage data. Update{" "}
          <code>public/data/chatgpt-codex-usage.json</code> and redeploy.
        </p>
      </article>
    );
  }

  return (
    <article className="signal-panel codex-usage-card">
      <div className="panel-head">
        <h2>ChatGPT + Codex Usage</h2>
        <span className="panel-meta">{statusLine}</span>
      </div>

      <div className="metric-row">
        {METRIC_KEYS.map((metric) => (
          <div className="metric-tile" key={metric.key}>
            <span>{metric.label}</span>
            <strong>{formatMetricValue(metric, summary[metric.key])}</strong>
          </div>
        ))}
      </div>

      {weeks.length > 0 && (
        <div className="codex-activity-shell">
          <div className="codex-activity-head">
            <span>Token activity</span>
            <div aria-label="Activity period" className="codex-tabs">
              <span>Daily</span>
              <span>Weekly</span>
              <strong>{payload.heatmap?.mode ?? "Cumulative"}</strong>
            </div>
          </div>

          <div className="activity-shell">
            <div
              className="codex-month-row"
              style={{
                "--weeks": weeks.length,
              }}
            >
              {payload.heatmap?.monthLabels?.map((month) => (
                <span
                  key={`${month.label}-${month.weekIndex}`}
                  style={{
                    gridColumn: `${month.weekIndex + 1} / span ${month.span ?? 1}`,
                  }}
                >
                  {month.label}
                </span>
              ))}
            </div>

            <div className="activity-grid codex-activity-grid">
              {weeks.map((week, weekIndex) => (
                <div key={`codex-week-${weekIndex}`} className="activity-week">
                  {week.map((cell) => (
                    <button
                      key={cell.key}
                      type="button"
                      className={`activity-cell codex-cell level-${cell.level}`}
                      aria-label={cell.label}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onFocus={() => setHoveredCell(cell)}
                      onBlur={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="codex-usage-detail-grid">
        <div>
          <h3>Activity insights</h3>
          <dl className="codex-stat-list">
            {payload.insights?.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3>Most used plugins</h3>
          <dl className="codex-plugin-list">
            {payload.plugins?.map((plugin) => (
              <div key={plugin.name}>
                <dt>{plugin.name}</dt>
                <dd>{plugin.runs} runs</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}

export default ChatGPTCodexUsagePanel;
