import { useEffect, useMemo, useState } from "react";
import ProjectSignalTable from "./ProjectSignalTable";
import SiteHeader from "./SiteHeader";
import TypedText from "./TypedText";
import { featuredProjects } from "./projectData";

const GITHUB_USERNAME = "ks6573";

function ProjectsPage() {
  const year = new Date().getFullYear();
  const [githubRepos, setGithubRepos] = useState([]);
  const [repoLoadError, setRepoLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      try {
        const repoResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`,
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
    }

    loadGitHubData();

    return () => {
      isMounted = false;
    };
  }, []);

  const mergedProjects = useMemo(() => {
    const featuredNames = new Set(
      featuredProjects.flatMap((project) => [project.title, project.repoName].filter(Boolean).map((name) => name.toLowerCase())),
    );
    const liveRepos = githubRepos
      .filter((repo) => !featuredNames.has(repo.name.toLowerCase()))
      .slice(0, 5)
      .map((repo) => ({
        title: repo.name,
        focus: repo.language || "Code",
        impact: repo.stargazers_count > 0 ? `${repo.stargazers_count} stars` : "Recent GitHub",
        tech: repo.language || "Repository",
        updated: new Date(repo.pushed_at).toLocaleDateString(undefined, {
          month: "short",
          day: "2-digit",
        }),
        description: repo.description || "No description added yet.",
        url: repo.html_url,
      }));

    return [...featuredProjects, ...liveRepos];
  }, [githubRepos]);

  return (
    <>
      <SiteHeader />

      <main className="container dashboard-page">
        <section className="hero compact-hero">
          <TypedText as="h1" text="Projects" speed={34} />
          <TypedText
            as="p"
            className="lead"
            text="Selected builds and live repository signals, organized for scan speed."
            speed={12}
            startDelay={330}
          />
        </section>

        <section className="section">
          <ProjectSignalTable projects={mergedProjects} title="Featured & Recent Work" />
          {repoLoadError && (
            <p className="muted small panel-note">
              Live GitHub updates are unavailable right now. Featured projects are still shown.
            </p>
          )}
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
          <div className="terminal-prompt">projects --recent</div>
        </footer>
      </main>
    </>
  );
}

export default ProjectsPage;
