import { useEffect, useMemo, useState } from "react";

const METRIC_KEYS = [
  { label: "Sessions", key: "sessions" },
  { label: "Messages", key: "messages" },
  { label: "Total tokens", key: "totalTokens" },
  { label: "Active days", key: "activeDays" },
  { label: "Current streak", key: "currentStreak" },
  { label: "Longest streak", key: "longestStreak" },
  { label: "Peak hour", key: "peakHour" },
  { label: "Favorite model", key: "favoriteModel" },
];

function formatMetricValue(key, value) {
  if (typeof value !== "number") {
    return value ?? "--";
  }

  if (key === "messages") {
    return value.toLocaleString();
  }

  return String(value);
}

function chunkByWeek(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return [];
  }

  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    const week = days.slice(index, index + 7).map((day) => {
      if (Number.isFinite(day?.level)) {
        return Math.max(0, Math.min(4, day.level));
      }
      return 0;
    });
    while (week.length < 7) {
      week.push(0);
    }
    weeks.push(week);
  }

  return weeks;
}

function normalizeActivityMatrix(matrix) {
  if (!Array.isArray(matrix)) {
    return [];
  }

  return matrix.map((week) =>
    Array.isArray(week)
      ? week
          .slice(0, 7)
          .map((level) => (Number.isFinite(level) ? Math.max(0, Math.min(4, level)) : 0))
      : [0, 0, 0, 0, 0, 0, 0],
  );
}

function ClaudeUsagePanel() {
  const [payload, setPayload] = useState(null);
  const [loadError, setLoadError] = useState(false);

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

  const activityMatrix = useMemo(
    () => {
      const directMatrix = normalizeActivityMatrix(payload?.activityMatrix ?? []);
      if (directMatrix.length > 0) {
        return directMatrix;
      }

      return chunkByWeek(payload?.heatmap?.days ?? []);
    },
    [payload],
  );

  const metrics = payload?.summary ?? payload ?? {};

  if (!payload && !loadError) {
    return (
      <article className="claude-usage-card">
        <p className="muted">Loading Claude usage data...</p>
      </article>
    );
  }

  if (loadError) {
    return (
      <article className="claude-usage-card">
        <p className="muted small">
          Could not load Claude usage data. Update <code>public/data/claude-usage.json</code> and
          redeploy.
        </p>
      </article>
    );
  }

  return (
    <article className="claude-usage-card">
      <div className="claude-metric-grid">
        {METRIC_KEYS.map(({ label, key }) => (
          <div className="claude-metric-tile" key={key}>
            <div className="claude-metric-label">{label}</div>
            <div className="claude-metric-value">
              {formatMetricValue(
                key,
                key === "sessions"
                  ? metrics.sessions
                  : key === "messages"
                    ? metrics.messages
                    : key === "totalTokens"
                      ? metrics.totalTokens
                      : key === "activeDays"
                        ? metrics.activeDays
                        : key === "currentStreak"
                          ? metrics.currentStreak ?? metrics.currentStreakDays
                          : key === "longestStreak"
                            ? metrics.longestStreak ?? metrics.longestStreakDays
                            : key === "peakHour"
                              ? metrics.peakHour ?? metrics.peakHourLabel
                              : metrics.favoriteModel,
              )}
            </div>
          </div>
        ))}
      </div>

      {activityMatrix.length > 0 && (
        <div className="claude-activity-shell">
          <div className="claude-activity-grid">
            {activityMatrix.map((week, weekIndex) => (
              <div key={`claude-week-${weekIndex}`} className="claude-week-column">
                {week.map((level, dayIndex) => (
                  <span
                    key={`claude-cell-${weekIndex}-${dayIndex}`}
                    className={`claude-cell level-${level}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default ClaudeUsagePanel;
