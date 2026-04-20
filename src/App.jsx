import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "./SiteHeader";

const skills = [
  "Python",
  "PyTorch",
  "scikit-learn",
  "XGBoost",
  "LLMs",
  "AWS",
  "Docker",
  "Kubernetes",
];

const GITHUB_USERNAME = "ks6573";
const CLAUDE_USAGE_JSON = "./data/claude-usage.json";
const CHART_START_DATE = "2026-01-01";

const focusAreas = [
  {
    title: "Evaluation-first ML systems",
    detail:
      "Define success metrics, test cases, and failure modes up front before model iteration.",
  },
  {
    title: "Strong baselines and practical modeling",
    detail:
      "Start simple, prove lift quickly, and add complexity only when metrics clearly improve.",
  },
  {
    title: "Reproducible training workflows",
    detail:
      "Track data, configs, and runs so experiments are repeatable and easy to audit.",
  },
  {
    title: "Deployment and observability",
    detail:
      "Monitor latency, quality, drift, and cost continuously after launch, not just before it.",
  },
  {
    title: "Data quality and reliability",
    detail:
      "Use validation checks and guardrails to prevent silent data issues from reaching models.",
  },
  {
    title: "Performance-cost balance",
    detail:
      "Optimize for useful output per token or compute, not only for maximum accuracy.",
  },
];

function App() {
  const year = new Date().getFullYear();
  const contributionsChartEndDate = new Date().toISOString().slice(0, 10);
  const contributionsChartUrl = `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${CHART_START_DATE}&to=${contributionsChartEndDate}`;
  const [claudeUsage, setClaudeUsage] = useState(null);
  const [claudeUsageError, setClaudeUsageError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadClaudeUsage() {
      try {
        const response = await fetch(CLAUDE_USAGE_JSON, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load Claude usage JSON");
        }
        const data = await response.json();
        if (!mounted) return;
        setClaudeUsage(data);
        setClaudeUsageError(false);
      } catch (_error) {
        if (!mounted) return;
        setClaudeUsageError(true);
      }
    }

    loadClaudeUsage();
    return () => {
      mounted = false;
    };
  }, []);

  const heatmapWeeks = useMemo(() => {
    const days = claudeUsage?.heatmap?.days;
    if (!Array.isArray(days) || days.length === 0) return [];

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [claudeUsage]);

  return (
    <>
      <SiteHeader />

      <main className="container">
        <section className="hero">
          <h1>
            ML engineering with a bias for{" "}
            <span className="muted">
              clean evaluation, reliable pipelines, and measurable impact.
            </span>
          </h1>

          <p className="lead">
            I’m Karan Seroy, a Machine Learning Engineer focused on building practical AI
            systems that are measurable, reliable, and production-ready. I enjoy translating
            complex ML problems into clean workflows that teams can trust and scale.
          </p>

          <div className="hero-actions">
            <Link className="btn" to="/projects.html">
              View Projects Page
            </Link>
            <a
              className="btn secondary"
              href="https://github.com/ks6573"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn secondary"
              href="https://linkedin.com/in/karan-seroy/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="chips">
            {skills.map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Live GitHub Contributions</h2>
          </div>

          <article className="card contribution-card">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="contribution-chart-wrap"
              aria-label={`${GITHUB_USERNAME} GitHub contribution graph`}
            >
              <img
                src={contributionsChartUrl}
                alt={`${GITHUB_USERNAME} GitHub contribution chart`}
                className="contribution-chart"
                loading="lazy"
              />
            </a>
            <div className="links">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
              >
                View full GitHub profile
              </a>
            </div>
          </article>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Claude Code Usage</h2>
          </div>

          <article className="card claude-card">
            {claudeUsage && (
              <>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-label">Sessions</div>
                    <div className="stat-value">{formatNumber(claudeUsage.summary.sessions)}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Messages</div>
                    <div className="stat-value">{formatNumber(claudeUsage.summary.messages)}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Total tokens</div>
                    <div className="stat-value">
                      {formatCompactNumber(claudeUsage.summary.totalTokens)}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Active days</div>
                    <div className="stat-value">{formatNumber(claudeUsage.summary.activeDays)}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Current streak</div>
                    <div className="stat-value">{claudeUsage.summary.currentStreakDays}d</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Longest streak</div>
                    <div className="stat-value">{claudeUsage.summary.longestStreakDays}d</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Peak hour</div>
                    <div className="stat-value">{claudeUsage.summary.peakHourLabel}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Favorite model</div>
                    <div className="stat-value model-name">{claudeUsage.summary.favoriteModel}</div>
                  </div>
                </div>

                <div className="claude-heatmap-wrap">
                  <div className="claude-heatmap">
                    {heatmapWeeks.map((week, weekIndex) => (
                      <div key={`week-${weekIndex}`} className="week-column">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className={`heat-cell level-${day.level}`}
                            title={`${day.date}: ${day.count} messages`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="heatmap-legend">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <span key={`legend-${level}`} className={`heat-cell level-${level}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>

              </>
            )}

            {!claudeUsage && !claudeUsageError && (
              <p className="muted">Loading Claude usage data...</p>
            )}

            {claudeUsageError && (
              <p className="muted">
                Claude usage data not found yet. Run <code>npm run sync:claude-usage</code> and
                redeploy.
              </p>
            )}
          </article>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>About</h2>
          </div>

          <div className="two-col">
            <div className="card soft">
              <h3>Background</h3>
              <p className="muted">
                I’m currently pursuing a Master of Science in Data Science at Rochester
                Institute of Technology after completing a Bachelor’s in Management
                Information Systems.
              </p>

              <p className="muted" style={{ marginTop: "12px" }}>
                My experience spans AI/ML R&D (cPacket Networks), cyber risk consulting
                (PwC), and business systems analysis (Iovance Biotherapeutics). I focus on
                measurable ML improvements, evaluation-first design, and production-aware
                system building.
              </p>

              <div className="hero-actions">
                <Link className="btn" to="/about.html">
                  Read Full About Page
                </Link>
              </div>
            </div>

            <div className="card soft">
              <h3>What I Optimize For</h3>
              <p className="muted">
                I focus on practical decisions that keep ML systems reliable, measurable, and
                production-ready over time.
              </p>
              <ul className="list detailed-list">
                {focusAreas.map((area) => (
                  <li key={area.title}>
                    <span className="focus-title">{area.title}</span>
                    <span className="focus-detail">{area.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
        </footer>
      </main>
    </>
  );
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatCompactNumber(value) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return `${num}`;
}

export default App;
