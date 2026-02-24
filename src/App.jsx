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

const focusAreas = [
  "Evaluation-first ML systems",
  "Strong baselines and practical modeling",
  "Reproducible training workflows",
  "Clean deployment and observability",
  "Data integrity and reliability",
];

function App() {
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
            <span className="nav-current" aria-current="page">
              Home
            </span>
            <a href="./projects.html">Projects</a>
            <a href="./about.html">About</a>
            <a href="#contact" className="btn">
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
            I build and ship ML systems end-to-end: data → training → evaluation →
            deployment. At cPacket (AI/ML R&D), I developed an LLM prompt optimizer that
            improved prompt quality up to <strong>78%</strong> and reduced token usage by{" "}
            <strong>30%</strong> across Gemini, GPT, and Claude-class models.
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
              <ul className="list">
                {focusAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
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

export default App;
