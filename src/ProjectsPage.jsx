import { useEffect, useState } from "react";

const projects = [
  {
    title: "SysControl",
    pill: "MCP / Systems",
    description:
      "Cross-platform AI systems copilot combining a 36-tool MCP server with terminal and chat interfaces for diagnostics, safe process control, and performance optimization.",
    meta: ["Python", "MCP", "Systems Copilot"],
    url: "https://github.com/ks6573/SysControl",
  },
  {
    title: "PerformanceIntelligence",
    pill: "Performance / Tooling",
    description:
      "iOS app that monitors device health in real time, computes a live performance score, and recommends targeted actions to prevent slowdowns.",
    meta: ["Swift", "iOS", "Performance Monitoring"],
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
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=8`,
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

  const selectedProjectNames = new Set(projects.map((project) => project.title.toLowerCase()));

  const mergedProjects = [
    ...projects.map((project) => ({
      key: `selected-${project.title}`,
      title: project.title,
      pill: project.pill,
      description: project.description,
      meta: project.meta,
      url: project.url,
    })),
    ...githubRepos
      .filter((repo) => !selectedProjectNames.has(repo.name.toLowerCase()))
      .slice(0, 4)
      .map((repo) => ({
        key: `repo-${repo.id}`,
        title: repo.name,
        pill: "Recent GitHub",
        description: repo.description || "No description added yet.",
        meta: [
          repo.language || "Code",
          `Updated ${new Date(repo.pushed_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}`,
        ],
        url: repo.html_url,
      })),
  ];

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
            Check out a few ML projects I’ve worked on, plus the latest stuff I’m shipping on
            GitHub.
          </p>
          <div className="hero-actions">
            <a className="btn secondary" href="./about.html">
              About Me
            </a>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Featured & Recent Work</h2>
          </div>

          <div className="grid">
            {mergedProjects.map((project) => (
              <article key={project.key} className="card">
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

            {!repoLoadError && githubRepos.length === 0 && (
              <article className="card">
                <p className="muted">Loading latest GitHub repositories...</p>
              </article>
            )}
          </div>

          {repoLoadError && (
            <p className="muted small">
              Live GitHub updates are unavailable right now. Featured projects above are still
              up to date.
            </p>
          )}
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
        </footer>
      </main>
    </>
  );
}

export default ProjectsPage;
