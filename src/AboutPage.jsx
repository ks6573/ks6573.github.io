const principles = [
  "Start with measurable objectives and baselines before model complexity.",
  "Treat evaluation as a first-class system, not a final checkpoint.",
  "Prioritize reliability, observability, and reproducibility in production.",
  "Keep solutions practical for real users, latency budgets, and cost limits.",
];

const strengths = [
  "LLM prompt and evaluation workflows",
  "Classical ML with strong feature engineering",
  "End-to-end ML lifecycle design",
  "Stakeholder communication and requirement translation",
  "Risk-aware system thinking",
  "Experiment tracking and iteration discipline",
];

const toolset = [
  "Python",
  "PyTorch",
  "scikit-learn",
  "XGBoost",
  "LLM APIs",
  "DeepEval",
  "AWS",
  "Docker",
  "Kubernetes",
  "SQL",
];

const experienceTimeline = [
  {
    title: "AI/ML R&D",
    org: "cPacket Networks",
    period: "Recent",
    summary:
      "Built an evaluation-driven LLM system prompt optimization pipeline with DAG-style tests and grounded input/output references to improve output quality and efficiency.",
  },
  {
    title: "Cyber Risk Consulting",
    org: "PwC",
    period: "Prior role",
    summary:
      "Worked on risk-focused analysis and structured problem solving in enterprise contexts, strengthening cross-functional communication and delivery discipline.",
  },
  {
    title: "Business Systems Analysis",
    org: "Iovance Biotherapeutics",
    period: "Prior role",
    summary:
      "Supported business and technical workflows by translating process needs into actionable, system-aware improvements.",
  },
];

function AboutPage() {
  const year = new Date().getFullYear();

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
            <a href="./index.html">Home</a>
            <a href="./projects.html">Projects</a>
            <a href="./about.html">About</a>
            <a href="./index.html#contact" className="btn">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>
            About me
            <span className="muted"> and the way I build ML systems.</span>
          </h1>
          <p className="lead">
            I’m a Machine Learning Engineer focused on evaluation-first systems, LLM
            optimization, and reliable deployment workflows. I care about turning modeling
            work into production outcomes that are measurable, maintainable, and useful.
          </p>
          <p className="lead">
            I’m currently pursuing a Master of Science in Data Science at Rochester
            Institute of Technology after completing a Bachelor’s in Management Information
            Systems.
          </p>
          <div className="hero-actions">
            <a className="btn secondary" href="https://github.com/ks6573" target="_blank" rel="noreferrer">
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
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Professional Snapshot</h2>
          </div>

          <div className="grid">
            <article className="card">
              <h3>Primary Focus</h3>
              <p>
                Building and shipping ML systems end-to-end: data preparation, modeling,
                evaluation, deployment, and iteration.
              </p>
            </article>

            <article className="card">
              <h3>LLM Impact</h3>
              <p>
                Delivered a prompt optimization system that improved quality up to 78% and
                reduced token usage by 30% across major model families.
              </p>
            </article>

            <article className="card">
              <h3>Working Style</h3>
              <p>
                Practical, metrics-driven, and reliability-minded. I optimize for outcomes,
                not just experiments.
              </p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Experience Highlights</h2>
          </div>

          <div className="stack">
            {experienceTimeline.map((item) => (
              <div className="row" key={`${item.title}-${item.org}`}>
                <div>
                  <div className="row-title">{item.title} · {item.org}</div>
                  <div className="row-sub">{item.summary}</div>
                </div>
                <div className="row-right">{item.period}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>How I Work</h2>
          </div>

          <div className="two-col">
            <div className="card soft">
              <h3>Engineering Principles</h3>
              <ul className="list">
                {principles.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ul>
            </div>

            <div className="card soft">
              <h3>Core Strengths</h3>
              <ul className="list">
                {strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Tooling</h2>
          </div>
          <div className="chips">
            {toolset.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Contact</h2>
          </div>

          <div className="card">
            <p>
              <strong>Email:</strong> karan1011seroy@gmail.com
            </p>
            <p>
              <strong>GitHub:</strong>{" "}
              <a href="https://github.com/ks6573" target="_blank" rel="noreferrer">
                github.com/ks6573
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href="https://linkedin.com/in/karan-seroy/"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/karan-seroy
              </a>
            </p>
          </div>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
        </footer>
      </main>
    </>
  );
}

export default AboutPage;
