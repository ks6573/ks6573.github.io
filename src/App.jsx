import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { projects } from './projectData';
import { readRoute, routeHref, viewFiles } from './terminalModel';
import { HomeView, ProjectsView, ExperienceView, ContactView, ActivityView } from './TerminalViews';
import { ProjectView } from './ProjectList';

const views = { home: HomeView, projects: ProjectsView, experience: ExperienceView, contact: ContactView, activity: ActivityView };
const fileItems = [['home', '≡', 'README.md'], ['experience', '≡', 'experience.log'], ['activity', '▦', 'activity.dat'], ['contact', '@', 'contact.txt']];
function preference(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function remember(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Display preferences remain usable without storage. */ }
}

export default function App() {
  const location = useLocation();
  const route = readRoute(location);
  const project = projects[route.project];
  const directory = project ? `~/projects/${project.name}` : route.view === 'projects' ? '~/projects' : '~';
  const file = project ? `${directory}/README.md` : viewFiles[route.view];
  const View = views[route.view];
  const [desktopOpen, setDesktopOpen] = useState(() => preference('portfolio-sidebar', 'expanded') !== 'collapsed');
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 700px)').matches);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const tree = useRef(null);
  const toggle = useRef(null);
  const screen = useRef(null);
  const content = useRef(null);
  const focusContent = useRef(false);
  const open = mobile ? mobileOpen : desktopOpen;

  useEffect(() => { remember('portfolio-sidebar', desktopOpen ? 'expanded' : 'collapsed'); }, [desktopOpen]);
  useEffect(() => {
    const media = matchMedia('(max-width: 700px)');
    const update = () => {
      if (tree.current?.contains(document.activeElement)) toggle.current.focus();
      setMobile(media.matches);
      setMobileOpen(false);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    setMobileOpen(false);
    screen.current.scrollTop = 0;
    if (focusContent.current) screen.current.focus({ preventScroll: true });
    focusContent.current = false;
    const title = project?.name || ({ home: 'ML Engineer', projects: 'Projects', experience: 'Experience', contact: 'Contact', activity: 'Activity' })[route.view];
    document.title = `Karan Seroy — ${title}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://kseroy.me${routeHref(route.view, route.project).split('#')[0]}`;
    setAnnouncement(`${project?.name || (route.view === 'home' ? 'Overview' : route.view)} opened.`);
  }, [location.key]);

  useLayoutEffect(() => {
    if (mobile && mobileOpen) (tree.current.querySelector('[aria-current="page"]') || tree.current.querySelector('a, button')).focus();
  }, [mobile, mobileOpen]);

  function toggleTree() {
    if (open && tree.current.contains(document.activeElement)) toggle.current.focus();
    if (mobile) setMobileOpen(value => !value);
    else setDesktopOpen(value => !value);
    setAnnouncement(`Files sidebar ${open ? 'hidden' : 'shown'}.`);
  }
  function prepareNavigation() {
    focusContent.current = content.current.contains(document.activeElement) || (mobile && tree.current.contains(document.activeElement));
  }
  function click(event) {
    const link = event.target.closest('a');
    if (link && link.origin === window.location.origin && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) prepareNavigation();
  }
  function dismissDrawer(event) {
    if (event.key === 'Escape' && !event.isComposing && mobile && mobileOpen) {
      setMobileOpen(false);
      toggle.current.focus();
    }
  }
  const selected = (view, key) => key ? route.project === key : !project && route.view === view;
  function fileLink([view, symbol, name]) {
    return <Link className="tree-file" key={view} to={routeHref(view)} data-view={view} aria-current={selected(view) ? 'page' : undefined}><span className="file-symbol">{symbol}</span> {name}</Link>;
  }

  return <div onClick={click}>
    <a className="skip" href="#screen" onClick={event => { event.preventDefault(); screen.current.focus(); }}>Skip to terminal content</a>
    <div className="desktop-meta"><span><span className="accent">~/</span> kseroy.me</span><span>terminal portfolio</span></div>
    <div className="terminal">
      <header className="titlebar"><div className="window-mark" aria-hidden="true"><span /><span /><span /></div><span className="window-title">karan@seroy: ~/portfolio</span>
      </header>
      <nav className="tabs" aria-label="Workspace views">
        <button ref={toggle} className="tree-toggle" type="button" aria-label={`${open ? 'Hide' : 'Show'} Files sidebar`} title="Toggle Files sidebar" aria-controls="file-tree" aria-expanded={open} onClick={toggleTree}><svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="13" height="11" rx="1" /><path d="M7 4v10" /><path className="sidebar-icon-pane" d="M3 4h4v10H3z" /></svg></button>
        {[['home', '~', 'overview'], ['projects', './', 'projects'], ['experience', '≡', 'experience'], ['contact', '@', 'contact']].map(([view, symbol, label]) => <Link key={view} to={routeHref(view)} data-view={view} aria-current={route.view === view ? 'page' : undefined}><span>{symbol}</span> {label}</Link>)}
        <span className="tab-tail">portfolio / main</span>
      </nav>
      <div className={`workspace${open ? '' : ' is-tree-collapsed'}`}>
        <aside ref={tree} className={`file-tree${mobile && mobileOpen ? ' is-open' : ''}`} id="file-tree" aria-label="Portfolio files" hidden={!open} onKeyDown={dismissDrawer}>
          <div className="tree-title">files <span>~/portfolio</span></div>
          <nav aria-label="Browse files">
            {fileLink(fileItems[0])}
            <details open className="tree-folder"><summary><span className="folder-arrow" aria-hidden="true">▾</span> projects/ <span className="muted">{Object.keys(projects).length}</span></summary><div className="tree-children">
              {Object.entries(projects).map(([key, item], index) => <Link key={key} to={routeHref('projects', key)} data-project={key} aria-current={selected('projects', key) ? 'page' : undefined}><span>{index === Object.keys(projects).length - 1 ? '└─' : '├─'}</span> {item.name}/</Link>)}
            </div></details>
            {fileItems.slice(1).map(fileLink)}
          </nav>
          <div className="sidebar-bottom"><a href="https://github.com/ks6573" target="_blank" rel="noreferrer">github.com/ks6573 <span>↗</span></a></div>
        </aside>
        <main ref={screen} id="screen" className="screen" tabIndex={-1} aria-label="Terminal content" onClick={() => { if (mobile) setMobileOpen(false); }}>
          <div id="view-content" ref={content}>{project ? <ProjectView project={project} /> : <View />}</div>
        </main>
      </div>
      <footer className="statusbar"><span className="mode">PORTFOLIO</span><span className="status-file" id="status-file" title={file}>{file}</span></footer>
    </div>
    <footer className="desktop-footer"><span>Built by Karan Seroy. Still figuring things out.</span><div><a href="https://github.com/ks6573" target="_blank" rel="noreferrer">[ github ]</a><span>© {new Date().getFullYear()}</span></div></footer>
    <div id="announcement" className="sr-only" role="status" aria-live="polite">{announcement}</div>
  </div>;
}
