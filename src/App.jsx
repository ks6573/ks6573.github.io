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
  const contributionsChartUrl = `https://ghchart.rshah.org/1ee6c8/${GITHUB_USERNAME}`;

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="avatar" />
            <div>
              <div className="name">Karan Seroy</div>
              <div className="role">Machine Learning Engineer</div>
            </div>
          </div>

          <nav className="nav">
            <span className="nav-current" aria-current="page">
              Home
            </span>
            <a href="./projects.html">Projects</a>
            <a href="./about.html">About</a>
            <a href="./contact.html" className="btn">
              Contact
            </a>
          </nav>
        </div>
      </header>

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
            <a className="btn" href="./projects.html">
              View Projects Page
            </a>
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
            <p className="muted contribution-copy">
              This chart is fetched live from your public GitHub activity and updates automatically.
            </p>
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
                <a className="btn" href="./about.html">
                  Read Full About Page
                </a>
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

export default App;
