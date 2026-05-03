import { Link } from "react-router-dom";
import ClaudeUsagePanel from "./ClaudeUsagePanel";
import FloatingTerminal from "./FloatingTerminal";
import GitHubContributionChart from "./GitHubContributionChart";
import SiteHeader from "./SiteHeader";
import TypedText from "./TypedText";

const GITHUB_USERNAME = "ks6573";

function App() {
  const year = new Date().getFullYear();

  return (
    <>
      <SiteHeader />

      <main className="container dashboard-page">
        <section className="hero signal-hero">
          <div className="hero-copy">
            <TypedText as="h1" text="Karan Seroy" speed={34} />
            <TypedText
              as="p"
              className="lead"
              text="ML engineer focused on evaluation-first systems, reliable pipelines, and measurable production impact."
              speed={12}
              startDelay={430}
            />
            <p>
              Recent work includes LLM prompt optimization, data integrity pipelines, AI-powered
              sprint workflows, and practical ML tools for real users.
            </p>
          </div>
        </section>

        <section className="dashboard-grid">
          <GitHubContributionChart username={GITHUB_USERNAME} />
          <ClaudeUsagePanel />
        </section>

        <section className="section about-strip">
          <div>
            <h2>Build Philosophy</h2>
            <p>
              I prefer clean baselines, explicit evaluation, observable deployments, and
              boringly reliable data paths. The goal is not just a better model; it is a
              system that keeps explaining itself.
            </p>
          </div>
          <div className="strip-actions">
            <Link className="text-link" to="/projects.html">
              Projects
            </Link>
            <Link className="text-link" to="/about.html">
              About
            </Link>
            <a className="text-link" href="https://github.com/ks6573" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
          <div className="terminal-prompt">karan@seroy:~$</div>
        </footer>
      </main>

      <FloatingTerminal />
    </>
  );
}

export default App;
