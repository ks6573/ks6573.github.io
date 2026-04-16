import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "SysControl",
    pill: "MCP / Systems",
    description:
      "Cross-platform AI systems copilot combining a 57-tool MCP server with terminal and chat interfaces (Claude Desktop, local/cloud Ollama, Telegram/WhatsApp/Messenger) for real-time diagnostics, safe process control, and actionable performance optimization.",
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
  const [githubOrgs, setGithubOrgs] = useState([]);
  const [orgLoadError, setOrgLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      try {
        const repoResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=12`,
        );
        if (!repoResponse.ok) {
          throw new Error("Failed to load repositories");
        }

        const repoData = await repoResponse.json();
        if (!Array.isArray(repoData)) {
          throw new Error("Unexpected GitHub API response");
        }

        const newestRepos = repoData
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

      try {
        const orgResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/orgs?per_page=12`,
        );
        if (!orgResponse.ok) {
          throw new Error("Failed to load organizations");
        }

        const orgData = await orgResponse.json();
        if (!Array.isArray(orgData)) {
          throw new Error("Unexpected GitHub org response");
        }

        if (isMounted) {
          setGithubOrgs(orgData);
          setOrgLoadError(false);
        }
      } catch (_error) {
        if (isMounted) {
          setOrgLoadError(true);
        }
      }
    }

    loadGitHubData();

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
            <Link to="/">Home</Link>
            <span className="nav-current" aria-current="page">
              Projects
            </span>
            <Link to="/about.html">About</Link>
            <Link to="/contact.html" className="btn">
              Contact
            </Link>
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
            GitHub and any public organizations I’m active in.
          </p>
          <div className="hero-actions">
            <Link className="btn secondary" to="/about.html">
              About Me
            </Link>
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

        <section className="section">
          <div className="section-head">
            <h2>Organizations & Community</h2>
          </div>

          <div className="grid">
            {githubOrgs.map((org) => (
              <article key={`org-${org.id}`} className="card">
                <div className="card-top">
                  <h3>{org.login}</h3>
                  <span className="pill">GitHub Org</span>
                </div>
                <p>
                  Public organization profile for <strong>{org.login}</strong>.
                </p>
                <div className="links">
                  <a href={org.html_url} target="_blank" rel="noreferrer">
                    View organization
                  </a>
                </div>
              </article>
            ))}

            {!orgLoadError && githubOrgs.length === 0 && (
              <article className="card">
                <div className="card-top">
                  <h3>No public org memberships yet</h3>
                  <span className="pill">GitHub</span>
                </div>
                <p>
                  This GitHub account does not currently expose public organization memberships.
                </p>
              </article>
            )}
          </div>

          {orgLoadError && (
            <p className="muted small">
              Live GitHub organization data is unavailable right now. Try refreshing in a moment.
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
