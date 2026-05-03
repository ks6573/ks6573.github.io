import SiteHeader from "./SiteHeader";
import TypedText from "./TypedText";

const experienceTimeline = [
  {
    title: "Machine Learning Intern · AI/ML R&D",
    org: "cPacket Networks",
    period: "Jun 2025 - Dec 2025",
    summary:
      "Developed an LLM system prompt optimizer tested with DAG-style evaluation, ground-truth input/output cases, and DeepEval; improved prompt quality up to 78% and reduced token usage by 30% across Gemini, GPT, and Claude models.",
  },
  {
    title: "Data & Tech Consulting Intern",
    org: "PwC",
    period: "Jun 2022 - Aug 2022",
    summary:
      "Used RStudio, Tableau, and MS Power Query to surface threats and roadblocks on a $2.3M project, performed regression testing, and translated technical details for non-technical stakeholders.",
  },
  {
    title: "Business Systems Analyst Intern",
    org: "Iovance Biotherapeutics",
    period: "May 2021 - Aug 2021",
    summary:
      "Authored development backlogs and SOPs, managed project dependencies, engineered Salesforce sandbox test data, and analyzed daily IT reports with senior infrastructure leadership.",
  },
  {
    title: "MS Data Science / BS Management Information Systems",
    org: "Rochester Institute of Technology",
    period: "MS present · BS May 2023",
    summary:
      "Pursuing a Master of Science in Data Science after completing a Bachelor of Science in Management Information Systems.",
  },
];

const strengths = [
  "LLM prompt and evaluation workflows",
  "Machine learning, statistical analysis, and business analytics",
  "Feature engineering with scikit-learn, XGBoost, TensorFlow, and PyTorch",
  "Model Context Protocol, networking, and relational database management",
  "Cloud and deployment tooling across AWS, Docker, Kubernetes/Kubeflow, ArgoCD, Supabase, Vercel, and Azure",
  "Stakeholder communication, regression testing, SOPs, and project documentation",
];

function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <SiteHeader />

      <main className="container dashboard-page">
        <section className="hero compact-hero">
          <TypedText as="h1" text="About" speed={34} />
          <TypedText
            as="p"
            className="lead"
            text="I build ML systems with a bias toward measurement, reliability, and clear operating behavior."
            speed={12}
            startDelay={280}
          />
        </section>

        <section className="section split-section">
          <article className="signal-panel">
            <div className="panel-head">
              <h2>Experience & Education</h2>
              <span className="panel-meta">timeline</span>
            </div>
            <div className="timeline-list">
              {experienceTimeline.map((item) => (
                <div className="timeline-row" key={`${item.title}-${item.org}`}>
                  <div>
                    <div className="row-title">
                      {item.title} · {item.org}
                    </div>
                    <p>{item.summary}</p>
                  </div>
                  <span>{item.period}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="signal-panel">
            <div className="panel-head">
              <h2>Operating Strengths</h2>
              <span className="panel-meta">signals</span>
            </div>
            <ul className="signal-list">
              {strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </article>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
          <div className="terminal-prompt">about --timeline</div>
        </footer>
      </main>
    </>
  );
}

export default AboutPage;
