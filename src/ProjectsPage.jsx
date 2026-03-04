import { useEffect, useState } from "react";

const projects = [
  {
    title: "SyscontrolMCP",
    pill: "MCP / Systems",
    description:
      "Model Context Protocol (MCP) server providing real-time system metrics (CPU, RAM, GPU, disk, network, and processes) for context-aware performance insights.",
    meta: ["Python", "MCP", "System Metrics"],
    url: "https://github.com/ks6573/SyscontrolMCP",
  },
  {
    title: "PerformanceIntelligence",
    pill: "Performance / Tooling",
    description:
      "Early-stage repository for performance intelligence workflows and profiling-driven optimization experiments.",
    meta: ["Swift", "Profiling", "In Progress"],
    url: "https://github.com/ks6573/PerformanceIntelligence",
  },
  {
    title: "OptionsTitan",
    pill: "Quant / ML",
    description:
      "Python-based options prediction and strategy modeling system using engineered features like Greeks, technical indicators, and VIX regimes.",
    meta: ["Python", "Options Modeling", "Feature Engineering"],
    url: "https://github.com/ks6573/OptionsTitan",
  },
  {
    title: "PSA",
    pill: "Applied ML",
    description:
      "Password Strength Analyzer that uses machine learning to assess and visualize password robustness.",
    meta: ["Python", "Security", "Machine Learning"],
    url: "https://github.com/ks6573/PSA",
  },
];

const GITHUB_USERNAME = "ks6573";

function ProjectsPage() {
  const year = new Date().getFullYear();
  const [githubRepos, setGithubRepos] = useState([]);
  const [repoLoadError, setRepoLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=8`,
        );

        if (!response.ok) {
          throw new Error("Failed to load repositories");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected GitHub API response");
        }

        const newestRepos = data
          .filter((repo) => !repo.fork && repo.name !== "ks6573.github.io")
          .slice(0, 6);

        if (isMounted) {
          setGithubRepos(newestRepos);
          setRepoLoadError(false);
        }
      } catch (_error) {
        if (isMounted) {
          setRepoLoadError(true);
        }
      }
    }

    loadRepos();

    return () => {
      isMounted = false;
    };
  }, []);

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
            <span className="nav-current" aria-current="page">
              Projects
            </span>
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
            Projects and recent builds
            <span className="muted"> focused on practical, measurable ML outcomes.</span>
          </h1>
          <p className="lead">
            Explore selected ML projects and the newest repositories from my GitHub profile.
          </p>
          <div className="hero-actions">
            <a className="btn secondary" href="./about.html">
              About Me
            </a>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Selected Projects</h2>
          </div>

          <div className="grid">
            {projects.map((project) => (
              <article key={project.title} className="card">
                <div className="card-top">
                  <h3>{project.title}</h3>
                  <span className="pill">{project.pill}</span>
                </div>
                <p>{project.description}</p>
                <div className="meta">
                  {project.meta.map((item, index) => (
                    <span key={`${project.title}-${item}`}>
                      {index > 0 && <span>• </span>}
                      {item}
                    </span>
                  ))}
                </div>
                <div className="links">
                  <a href={project.url} target="_blank" rel="noreferrer">
                    View repository
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Latest GitHub Repositories</h2>
          </div>

          <div className="grid">
            {githubRepos.map((repo) => (
              <article key={repo.id} className="card">
                <div className="card-top">
                  <h3>{repo.name}</h3>
                  <span className="pill">GitHub</span>
                </div>
                <p>{repo.description || "No description added yet."}</p>
                <div className="meta">
                  <span>{repo.language || "Code"}</span>
                  <span>•</span>
                  <span>
                    Updated{" "}
                    {new Date(repo.pushed_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                </div>
                <div className="links">
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    View repository
                  </a>
                </div>
              </article>
            ))}

            {!repoLoadError && githubRepos.length === 0 && (
              <article className="card">
                <p className="muted">Loading latest repositories...</p>
              </article>
            )}

            {repoLoadError && (
              <article className="card">
                <p className="muted">
                  Couldn’t load repositories right now. You can still browse everything on
                  GitHub.
                </p>
                <div className="links">
                  <a href="https://github.com/ks6573" target="_blank" rel="noreferrer">
                    github.com/ks6573
                  </a>
                </div>
              </article>
            )}
          </div>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
        </footer>
      </main>
    </>
  );
}

export default ProjectsPage;
