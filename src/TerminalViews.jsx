import { GitHubActivity, CodexActivity, ClaudeActivity } from "./ActivityPanels";
import { ProjectList, RecentProjects } from "./ProjectList";

export function HomeView() {
  return <>
    <div className="output-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> whoami</div>
    <section className="identity" aria-label="About Karan Seroy">
      <pre className="ascii" aria-hidden="true">{"██╗  ██╗███████╗\n██║ ██╔╝██╔════╝\n█████╔╝ ███████╗\n██╔═██╗ ╚════██║\n██║  ██╗███████║\n╚═╝  ╚═╝╚══════╝"}</pre>
      <div className="identity-text"><h1>Karan Seroy</h1><div className="identity-rule" aria-hidden="true">──────────────────────────────</div><dl><div><dt>role</dt><dd>Machine learning engineer</dd></div><div><dt>work</dt><dd>SwiftLaw <span className="muted">/ applied AI</span></dd></div><div><dt>focus</dt><dd>Evaluation. Systems. Useful tools.</dd></div><div><dt>stack</dt><dd>Python, Swift, SQL</dd></div><div><dt>elsewhere</dt><dd><a href="https://github.com/ks6573" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/karan-seroy/" target="_blank" rel="noreferrer">LinkedIn ↗</a></dd></div></dl><div className="ansi-swatches" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
    </section>
    <p className="personal-note"><span className="muted">#</span> I build things that make computers more useful.<br /><span className="muted">#</span> Usually with ML. Sometimes with a better tool.</p>
    <div className="output-command section-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> ls projects/ <span className="command-comment"># select a directory</span></div>
    <ProjectList />
    <div className="output-command section-command activity-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> cat activity.dat <span className="command-comment"># GitHub snapshot</span></div>
    <GitHubActivity />
  </>;
}

export function ProjectsView() {
  return <>
    <div className="output-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~/projects</span><span className="prompt-dollar">$</span> ls</div>
    <h1 className="file-heading">~/projects/</h1><p className="file-lead">Tools I’ve built and problems I’ve spent time on.</p><ProjectList /><p className="terminal-note">Open a directory above, or type <button className="inline-command" data-command="open syscontrol">open syscontrol</button>.</p><div className="text-section"><h2># Professional work</h2><p>At SwiftLaw, I work on document extraction, claim-level grounding, and multi-agent editing and drafting workflows.</p><button className="inline-command" data-view="experience">cat experience.log</button></div>
<RecentProjects />
  </>;
}

export function ExperienceView() {
  return <>
    <div className="output-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> cat experience.log</div><h1 className="file-heading">Experience & education</h1>
    <div className="experience-list"><article><div className="log-prefix">[ current ]</div><div><h2>SwiftLaw</h2><p className="accent">ML Engineer / AI Scientist</p><p>Building NLP extraction pipelines for fund formation documents, structured schemas, and claim-level grounding. Also working on multi-agent editing, drafting, and retrieval over chat history.</p></div></article><article><div className="log-prefix">[ 2025 ]</div><div><h2>cPacket Networks</h2><p className="accent">Machine Learning Intern · Jun–Dec</p><p>Built a system prompt optimizer with DAG-style evaluation, ground-truth test cases, and DeepEval. Evaluated behavior across Gemini, GPT, and Claude.</p></div></article><article><div className="log-prefix">[ 2022 ]</div><div><h2>PwC</h2><p className="accent">Data & Tech Consulting Intern</p><p>Data analysis, regression testing, and translating technical findings for stakeholders.</p></div></article><article><div className="log-prefix">[ 2021 ]</div><div><h2>Iovance Biotherapeutics</h2><p className="accent">Business Systems Analyst Intern</p><p>Development backlogs, Salesforce sandbox test data, SOPs, and infrastructure reporting.</p></div></article><article><div className="log-prefix">[ education ]</div><div><h2>Rochester Institute of Technology</h2><p>MS Data Science studies. BS Management Information Systems, 2023.</p></div></article></div>
  </>;
}

export function ContactView() {
  return <>
    <div className="output-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> cat contact.txt</div><h1 className="file-heading">Contact</h1><p className="file-lead">For interesting problems, useful tools, or just a conversation.</p><dl className="contact-list"><div><dt>email</dt><dd><a href="mailto:karan1011seroy@gmail.com">karan1011seroy@gmail.com ↗</a></dd></div><div><dt>github</dt><dd><a href="https://github.com/ks6573" target="_blank" rel="noreferrer">github.com/ks6573 ↗</a></dd></div><div><dt>linkedin</dt><dd><a href="https://linkedin.com/in/karan-seroy/" target="_blank" rel="noreferrer">linkedin.com/in/karan-seroy ↗</a></dd></div></dl><p className="terminal-note">Links open their destination. Nothing is sent from this terminal.</p>
  </>;
}

export function ActivityView() {
  return <>
    <div className="output-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> cat activity.dat</div>
    <h1 className="file-heading">Activity</h1>
    <p className="file-lead activity-lead">GitHub contributions, ChatGPT + Codex, and Claude Code.<br /><span className="muted">Saved snapshots · hover, focus, or tap a cell to inspect.</span></p>
    <div className="activity-report">
      <section className="activity-section" aria-labelledby="github-activity-title"><div className="activity-section-heading"><h2 id="github-activity-title"># GitHub</h2><span>contributions / day</span></div><GitHubActivity /></section>
      <section className="activity-section" aria-labelledby="codex-activity-title"><div className="activity-section-heading"><h2 id="codex-activity-title"># ChatGPT + Codex</h2><span>token activity</span></div><CodexActivity /></section>
      <section className="activity-section" aria-labelledby="claude-activity-title"><div className="activity-section-heading"><h2 id="claude-activity-title"># Claude Code</h2><span>messages / day</span></div><ClaudeActivity /></section>
    </div>
    <p className="terminal-note">Counts and totals reflect the saved exports, not live usage. ChatGPT + Codex cells show relative levels; Claude cells show dated message counts.</p>
  </>;
}

export function HelpView() {
  return <>
    <div className="output-command"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span>~</span><span className="prompt-dollar">$</span> help</div><h1 className="file-heading">A small map of the place.</h1><p className="file-lead">This is an interactive portfolio. Commands navigate the site; they don’t run on your computer.</p><dl className="help-list"><div><dt>whoami / home</dt><dd>Return to the overview</dd></div><div><dt>ls / projects</dt><dd>List project directories</dd></div><div><dt>open syscontrol</dt><dd>Read a project’s README</dd></div><div><dt>cat experience.log</dt><dd>Read my work history</dd></div><div><dt>cat contact.txt</dt><dd>Find my email and profiles</dd></div><div><dt>activity</dt><dd>Inspect GitHub and AI usage</dd></div><div><dt>cd projects / cd ~</dt><dd>Change portfolio directory</dd></div><div><dt>pwd</dt><dd>Print the current virtual path</dd></div><div><dt>theme green / amber / ice</dt><dd>Change the terminal palette</dd></div><div><dt>clear</dt><dd>Clear the terminal output</dd></div></dl><p className="terminal-note">Press <kbd>/</kbd> to focus the prompt, <kbd>↑</kbd> and <kbd>↓</kbd> for history, or <kbd>Tab</kbd> to complete a command. Toggle the Files sidebar with <kbd>⌘/Ctrl+B</kbd> or the panel button. All files are clickable, too.</p>
  </>;
}
