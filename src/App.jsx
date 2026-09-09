import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { projects } from './projectData';
import { completions, interpretCommand, palettes, readRoute, routeHref, viewFiles } from './terminalModel';
import { HomeView, ProjectsView, ExperienceView, ContactView, ActivityView, HelpView } from './TerminalViews';
import { ProjectView } from './ProjectList';

const views = { home: HomeView, projects: ProjectsView, experience: ExperienceView, contact: ContactView, activity: ActivityView, help: HelpView };
const fileItems = [['home', '≡', 'README.md'], ['experience', '≡', 'experience.log'], ['activity', '▦', 'activity.dat'], ['contact', '@', 'contact.txt'], ['help', '?', 'help']];
function preference(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function remember(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Display preferences remain usable without storage. */ }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = readRoute(location);
  const project = projects[route.project];
  const directory = project ? `~/projects/${project.name}` : route.view === 'projects' ? '~/projects' : '~';
  const file = project ? `${directory}/README.md` : viewFiles[route.view];
  const View = views[route.view];
  const [palette, setPalette] = useState(() => {
    const saved = preference('portfolio-palette', 'green');
    return palettes.includes(saved) ? saved : 'green';
  });
  const [desktopOpen, setDesktopOpen] = useState(() => preference('portfolio-sidebar', 'expanded') !== 'collapsed');
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 700px)').matches);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [input, setInput] = useState('');
  const [log, setLog] = useState([]);
  const [cleared, setCleared] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const tree = useRef(null);
  const toggle = useRef(null);
  const screen = useRef(null);
  const content = useRef(null);
  const prompt = useRef(null);
  const focusContent = useRef(false);
  const history = useRef([]);
  const historyIndex = useRef(0);
  const historyDraft = useRef('');
  const nextLogId = useRef(0);
  const open = mobile ? mobileOpen : desktopOpen;

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    remember('portfolio-palette', palette);
  }, [palette]);
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
    setLog([]);
    setCleared(false);
    setMobileOpen(false);
    screen.current.scrollTop = 0;
    if (focusContent.current) screen.current.focus({ preventScroll: true });
    focusContent.current = false;
    const title = project?.name || ({ home: 'ML Engineer', projects: 'Projects', experience: 'Experience', contact: 'Contact', activity: 'Activity', help: 'Help' })[route.view];
    document.title = `Karan Seroy — ${title}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://kseroy.me${routeHref(route.view, route.project).split('#')[0]}`;
    setAnnouncement(`${project?.name || (route.view === 'home' ? 'Overview' : route.view)} opened.`);
  }, [location.key]);

  useLayoutEffect(() => {
    if (log.length) screen.current.scrollTop = screen.current.scrollHeight;
  }, [log]);
  useLayoutEffect(() => {
    if (mobile && mobileOpen) (tree.current.querySelector('[aria-current="page"]') || tree.current.querySelector('a, button')).focus();
  }, [mobile, mobileOpen]);

  function toggleTree() {
    if (open && tree.current.contains(document.activeElement)) toggle.current.focus();
    if (mobile) setMobileOpen(value => !value);
    else setDesktopOpen(value => !value);
    setAnnouncement(`Files sidebar ${open ? 'hidden' : 'shown'}.`);
  }
  useEffect(() => {
    function keydown(event) {
      if (event.isComposing) return;
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        if (!event.repeat) toggleTree();
      } else if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, [contenteditable]')) {
        event.preventDefault();
        prompt.current.focus();
      } else if (event.key === 'Escape' && mobile && mobileOpen) {
        setMobileOpen(false);
        toggle.current.focus();
      }
    }
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [mobile, mobileOpen, desktopOpen]);

  function prepareNavigation() {
    focusContent.current = content.current.contains(document.activeElement) || (mobile && tree.current.contains(document.activeElement));
  }
  function go(view, key) {
    prepareNavigation();
    navigate(routeHref(view, key));
  }
  function output(raw, text) {
    setLog(entries => [...entries.slice(-39), { id: nextLogId.current++, raw, text, directory }]);
    setAnnouncement(text);
  }
  function choosePalette(name) {
    if (!palettes.includes(name)) return false;
    setPalette(name);
    setAnnouncement(`${name} palette selected.`);
    return true;
  }
  function runCommand(raw) {
    const value = raw.trim();
    if (!value) return;
    if (history.current.at(-1) !== value) history.current.push(value);
    if (history.current.length > 100) history.current.shift();
    historyIndex.current = history.current.length;
    historyDraft.current = '';
    const result = interpretCommand(value, directory);
    if (result.type === 'navigate') go(result.view, result.project);
    else if (result.type === 'clear') {
      setCleared(true);
      setLog([]);
      setAnnouncement('Terminal cleared. Type home to return to the overview.');
    } else if (result.type === 'palette') output(value, choosePalette(result.name) ? `palette: ${result.name}` : 'Available palettes: green, amber, ice.');
    else if (result.type === 'output') output(value, result.text);
  }
  function click(event) {
    const link = event.target.closest('a');
    if (link && link.origin === window.location.origin && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) prepareNavigation();
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.view) go(button.dataset.view);
    else if (button.dataset.project) go('projects', button.dataset.project);
    else if (button.dataset.command) runCommand(button.dataset.command);
    else if (button.dataset.palette) choosePalette(button.dataset.palette);
  }
  function promptKey(event) {
    if (event.isComposing) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex.current === history.current.length) historyDraft.current = input;
      historyIndex.current = Math.max(0, historyIndex.current - 1);
      setInput(history.current[historyIndex.current] || '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      historyIndex.current = Math.min(history.current.length, historyIndex.current + 1);
      setInput(historyIndex.current === history.current.length ? historyDraft.current : history.current[historyIndex.current]);
    } else if (event.key === 'Tab' && !event.shiftKey && input.trim()) {
      const matches = completions.filter(item => item.toLowerCase().startsWith(input.toLowerCase()));
      if (!matches.length) return;
      event.preventDefault();
      if (matches.length === 1) setInput(matches[0]);
      else output(input, matches.join('  '));
    } else if (event.key === 'Escape') screen.current.focus({ preventScroll: true });
    else if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); runCommand('clear'); }
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
        <div className="palettes" role="group" aria-label="Terminal palette">{palettes.map(name => <button key={name} data-palette={name} aria-pressed={palette === name} aria-label={`${name === 'green' ? 'Green phosphor' : name[0].toUpperCase() + name.slice(1)} palette`}><i /></button>)}</div>
      </header>
      <nav className="tabs" aria-label="Workspace views">
        <button ref={toggle} className="tree-toggle" type="button" aria-label={`${open ? 'Hide' : 'Show'} Files sidebar`} title="Toggle Files sidebar (⌘/Ctrl+B)" aria-controls="file-tree" aria-expanded={open} aria-keyshortcuts="Meta+b Control+b" onClick={toggleTree}><svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="13" height="11" rx="1" /><path d="M7 4v10" /><path className="sidebar-icon-pane" d="M3 4h4v10H3z" /></svg></button>
        {[['home', '~', 'overview'], ['projects', './', 'projects'], ['experience', '≡', 'experience'], ['contact', '@', 'contact']].map(([view, symbol, label]) => <Link key={view} to={routeHref(view)} data-view={view} aria-current={route.view === view ? 'page' : undefined}><span>{symbol}</span> {label}</Link>)}
        <span className="tab-tail">portfolio / main</span>
      </nav>
      <div className={`workspace${open ? '' : ' is-tree-collapsed'}`}>
        <aside ref={tree} className={`file-tree${mobile && mobileOpen ? ' is-open' : ''}`} id="file-tree" aria-label="Portfolio files" hidden={!open}>
          <div className="tree-title">files <span>~/portfolio</span></div>
          <nav aria-label="Browse files">
            {fileLink(fileItems[0])}
            <details open className="tree-folder"><summary><span className="folder-arrow" aria-hidden="true">▾</span> projects/ <span className="muted">{Object.keys(projects).length}</span></summary><div className="tree-children">
              {Object.entries(projects).map(([key, item], index) => <Link key={key} to={routeHref('projects', key)} data-project={key} aria-current={selected('projects', key) ? 'page' : undefined}><span>{index === Object.keys(projects).length - 1 ? '└─' : '├─'}</span> {item.name}/</Link>)}
            </div></details>
            {fileItems.slice(1).map(fileLink)}
          </nav>
          <div className="sidebar-bottom"><p className="muted">mouse optional.</p><div><kbd>/</kbd><span>focus prompt</span></div><div><kbd>↑ ↓</kbd><span>command history</span></div><div><kbd>tab</kbd><span>complete a command</span></div><div><kbd>⌘/ctrl b</kbd><span>toggle files</span></div><div className="sidebar-rule" /><a href="https://github.com/ks6573" target="_blank" rel="noreferrer">github.com/ks6573 <span>↗</span></a><button data-command="help">$ help <span>↵</span></button></div>
        </aside>
        <main ref={screen} id="screen" className="screen" tabIndex={-1} aria-label="Terminal content" onClick={() => { if (mobile) setMobileOpen(false); }}>
          <div id="view-content" ref={content}>{!cleared && (project ? <ProjectView project={project} /> : <View />)}</div>
          <div id="command-log" aria-label="Command output">{log.map(entry => <div className="log-entry" key={entry.id}><div className="command-echo">karan@seroy:{entry.directory}$ {entry.raw}</div><div className="command-result">{entry.text}</div></div>)}</div>
        </main>
      </div>
      <form className="commandbar" id="command-form" autoComplete="off" onSubmit={event => { event.preventDefault(); runCommand(input); setInput(''); }}>
        <label htmlFor="command-input"><span className="prompt-user">karan@seroy</span><span className="muted">:</span><span id="prompt-path" title={directory}>{directory}</span><span className="prompt-dollar">$</span><span className="sr-only">Portfolio command</span></label>
        <input ref={prompt} id="command-input" value={input} onChange={event => setInput(event.target.value)} onKeyDown={promptKey} type="text" placeholder="type help, or click around" spellCheck={false} autoCapitalize="off" autoCorrect="off" enterKeyHint="go" aria-describedby="command-hint" />
        <button type="submit" aria-label="Run portfolio command">enter <span aria-hidden="true">↵</span></button>
      </form>
      <footer className="statusbar"><span className="mode">PORTFOLIO</span><span className="status-file" id="status-file" title={file}>{file}</span><span className="status-hint" id="command-hint">click a file or enter a command</span><span className="status-right">UTF-8 <span className="muted">│</span> browser shell</span></footer>
    </div>
    <footer className="desktop-footer"><span>Built by Karan Seroy. Still figuring things out.</span><div><button data-command="theme amber">[ theme amber ]</button><a href="https://github.com/ks6573" target="_blank" rel="noreferrer">[ github ]</a><span>© {new Date().getFullYear()}</span></div></footer>
    <div id="announcement" className="sr-only" role="status" aria-live="polite">{announcement}</div>
  </div>;
}
