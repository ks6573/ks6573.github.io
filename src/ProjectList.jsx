import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from './projectData';
import { routeHref } from './terminalModel';

export function ProjectList() {
  return <div className="project-list">
    <div className="project-head" aria-hidden="true"><span>directory</span><span>stack</span><span>description</span><span /></div>
    {Object.entries(projects).map(([key, project]) => <Link className="project-row" key={key} to={routeHref('projects', key)} aria-label={`Open ${project.name} project`}>
      <span>{project.name}<span className="slash">/</span></span><span>{project.stack}</span><span>{project.summary}</span><span>↵</span>
    </Link>)}
  </div>;
}

export function ProjectView({ project }) {
  return <>
    <div className="output-command">karan@seroy:~/projects/{project.name}$ cat README.md</div>
    <h1 className="file-heading">{project.name}</h1>
    <div className="project-meta"><span>{project.stack}</span><span>public repository</span></div>
    <div className="project-body"><p>{project.description}</p><h2># The shape of it</h2><pre className="project-architecture">{project.diagram}</pre><h2># Project notes</h2><p>{project.note}</p>
      <div className="project-links"><a href={project.url} target="_blank" rel="noreferrer">Open repository ↗</a><button data-command="cd ..">cd ..</button></div>
    </div>
  </>;
}

export function RecentProjects() {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/users/ks6573/repos?sort=updated&direction=desc&per_page=100', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid repositories');
        const hidden = new Set(['ks6573.github.io', 'iste-activity4', 'homebrew-tap', 'g7x-monitor', ...Object.values(projects).map(project => project.name.toLowerCase())]);
        setRepos(data.filter(repo => !repo.fork && typeof repo.name === 'string' && !hidden.has(repo.name.toLowerCase())).slice(0, 5));
      }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, []);
  return <section className="text-section recent-projects"><h2># Recent repositories</h2>
    {error ? <p className="muted">Recent repositories are unavailable. <a href="https://github.com/ks6573?tab=repositories" target="_blank" rel="noreferrer">Browse GitHub ↗</a></p> : repos ? repos.length ? repos.map(repo => <a className="recent-repo" href={`https://github.com/ks6573/${encodeURIComponent(repo.name)}`} target="_blank" rel="noreferrer" key={repo.name}><span>{repo.name} ↗</span><span>{repo.description || repo.language || 'Public repository'}</span></a>) : <p className="muted">More work is on <a href="https://github.com/ks6573?tab=repositories">GitHub ↗</a>.</p> : <p className="muted" role="status">Loading recent repositories…</p>}
  </section>;
}
