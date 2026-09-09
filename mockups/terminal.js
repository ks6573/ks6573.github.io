const terminalProjects = {
  syscontrol: {
    name: 'SysControl', stack: 'Python / MCP', summary: 'A systems copilot for your machine.',
    description: 'An AI systems copilot with tools for CPU, memory, GPU, disk, networking, processes, applications, documents, and web research.',
    note: 'The interesting part is connecting the assistant to the machine: giving it useful, inspectable tools instead of making it guess what is happening.',
    diagram: 'assistant\n   │\n   └── MCP tools\n         ├── cpu / memory / gpu\n         ├── disk / network / processes\n         └── apps / documents / research',
    url: 'https://github.com/ks6573/SysControl',
  },
  terminaude: {
    name: 'Terminaude', stack: 'Swift / macOS', summary: 'A terminal built around Claude.',
    description: 'A macOS terminal wrapper designed around a Claude-first workflow for command-line work.',
    note: 'A place to explore what native desktop software can do for AI-assisted development, while keeping the command line close at hand.',
    diagram: 'macOS\n   │\n   └── Terminaude\n         └── Claude-first command-line workflow',
    url: 'https://github.com/ks6573/Terminaude',
  },
  performance: {
    name: 'PerformanceIntelligence', stack: 'Swift / iOS', summary: 'Device health you can act on.',
    description: 'An iOS app that monitors device health, calculates a performance score, and recommends actions to prevent slowdowns.',
    note: 'Making telemetry useful means connecting the measurement to an action the person holding the device can understand.',
    diagram: 'device telemetry\n   └── performance score\n         └── recommended actions',
    url: 'https://github.com/ks6573/PerformanceIntelligence',
  },
  options: {
    name: 'OptionsTitan', stack: 'Python / ML', summary: 'Options data and strategy models.',
    description: 'An options prediction and strategy modeling system using Greeks, technical indicators, VIX regimes, and multi-year datasets.',
    note: 'A modeling project built around market data, engineered features, and the behavior of options strategies.',
    diagram: 'options datasets\n   └── Greeks / indicators / VIX regimes\n         └── prediction & strategy models',
    url: 'https://github.com/ks6573/OptionsTitan',
  },
  psa: {
    name: 'PSA', stack: 'Python / ML', summary: 'Password robustness, visualized.',
    description: 'A Password Strength Analyzer that uses machine learning to assess and visualize password robustness.',
    note: 'An applied security ML project that turns a model assessment into visible feedback.',
    diagram: 'password input\n   └── ML assessment\n         └── robustness visualization',
    url: 'https://github.com/ks6573/PSA',
  },
};

const screen = document.querySelector('#screen');
const content = document.querySelector('#view-content');
const commandLog = document.querySelector('#command-log');
const commandInput = document.querySelector('#command-input');
const announcement = document.querySelector('#announcement');
const tree = document.querySelector('#file-tree');
const treeToggle = document.querySelector('.tree-toggle');
const workspace = document.querySelector('.workspace');
const mobileLayout = window.matchMedia('(max-width: 700px)');
let desktopTreeOpen = true;
let mobileTreeOpen = false;
try { desktopTreeOpen = localStorage.getItem('terminal-design-sidebar') !== 'collapsed'; } catch { /* The sidebar works without storage. */ }
let currentDirectory = '~';
let history = [];
let historyPosition = 0;
let historyDraft = '';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function syncTree(restoreFocus = false) {
  const open = mobileLayout.matches ? mobileTreeOpen : desktopTreeOpen;
  const focusWasInTree = tree.contains(document.activeElement);
  tree.hidden = !open;
  tree.classList.toggle('is-open', mobileLayout.matches && open);
  workspace.classList.toggle('is-tree-collapsed', !open);
  treeToggle.setAttribute('aria-expanded', String(open));
  treeToggle.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} Files sidebar`);
  if (restoreFocus || (!open && focusWasInTree)) treeToggle.focus();
}

function closeTree(restoreFocus = false) {
  if (!mobileLayout.matches) return;
  mobileTreeOpen = false;
  syncTree(restoreFocus);
}

function toggleTree() {
  if (mobileLayout.matches) mobileTreeOpen = !mobileTreeOpen;
  else {
    desktopTreeOpen = !desktopTreeOpen;
    try { localStorage.setItem('terminal-design-sidebar', desktopTreeOpen ? 'expanded' : 'collapsed'); } catch { /* Keep the in-memory preference. */ }
  }
  syncTree();
  if (mobileLayout.matches && mobileTreeOpen) (tree.querySelector('[aria-current="page"]') || tree.querySelector('button')).focus();
  announcement.textContent = `Files sidebar ${tree.hidden ? 'hidden' : 'shown'}.`;
}

function setPath(directory, file) {
  currentDirectory = directory;
  document.querySelector('#prompt-path').textContent = directory;
  document.querySelector('#prompt-path').title = directory;
  document.querySelector('#status-file').textContent = file;
  document.querySelector('#status-file').title = file;
  document.title = `karan@seroy:${directory} — terminal portfolio`;
}

function setSelection(view, project) {
  document.querySelectorAll('[data-view], [data-project]').forEach(button => {
    const selected = project ? button.dataset.project === project || (button.closest('.tabs') && button.dataset.view === 'projects') : button.dataset.view === view;
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

function projectList() {
  const list = element('div', 'project-list');
  const head = element('div', 'project-head');
  head.setAttribute('aria-hidden', 'true');
  for (const text of ['directory', 'stack', 'description', '']) head.append(element('span', '', text));
  list.append(head);
  for (const [key, project] of Object.entries(terminalProjects)) {
    const row = element('button', 'project-row');
    row.dataset.project = key;
    row.setAttribute('aria-label', `Open ${project.name} project`);
    const name = element('span', '', project.name);
    name.append(element('span', 'slash', '/'));
    row.append(name, element('span', '', project.stack), element('span', '', project.summary), element('span', '', '↵'));
    list.append(row);
  }
  return list;
}

function createHeatmap(cells, label, readout) {
  const map = element('div', 'heatmap');
  map.setAttribute('role', 'group');
  map.setAttribute('aria-label', label);
  cells = [...cells];
  while (cells.length % 7) cells.push(null);
  map.style.setProperty('--weeks', cells.length / 7);
  const buttons = [];
  for (const day of cells) {
    const cell = element('button');
    cell.type = 'button';
    cell.tabIndex = -1;
    if (!day) {
      cell.dataset.empty = '';
      cell.disabled = true;
      cell.setAttribute('aria-hidden', 'true');
    } else {
      cell.dataset.level = String(Math.max(0, Math.min(4, day.level || 0)));
      const label = day.label;
      cell.title = label;
      cell.setAttribute('aria-label', label);
      for (const event of ['mouseenter', 'focus', 'click']) cell.addEventListener(event, () => { readout.textContent = label; });
      cell.addEventListener('focus', () => {
        buttons.forEach(button => { button.tabIndex = button === cell ? 0 : -1; });
      });
      cell.addEventListener('keydown', event => {
        const offsets = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
        if (offsets[event.key] === undefined) return;
        event.preventDefault();
        const index = buttons.indexOf(cell);
        buttons[Math.max(0, Math.min(buttons.length - 1, index + offsets[event.key]))].focus();
      });
      buttons.push(cell);
    }
    map.append(cell);
  }
  if (buttons.length) buttons[0].tabIndex = 0;
  return map;
}

function datedActivityCells(days, unit) {
  const offset = days.length ? new Date(days[0].date + 'T00:00:00Z').getUTCDay() : 0;
  return [...Array(offset).fill(null), ...days.map(day => ({
    level: day.level,
    label: `${day.date}: ${day.count.toLocaleString('en-US')} ${unit}${day.count === 1 ? '' : 's'}`,
  }))];
}

function populateActivity(container) {
  const data = TERMINAL_ACTIVITY;
  const top = element('div', 'activity-topline');
  top.append(element('strong', '', `${data.totalContributions.toLocaleString('en-US')} contributions`), element('span', '', `${data.from} → ${data.to}`));
  const bottom = element('div', 'activity-bottomline');
  const readout = element('span', '', 'hover a day to inspect');
  bottom.append(readout, element('span', '', `snapshot: ${data.generatedAt.slice(0, 10)}`));
  const map = createHeatmap(datedActivityCells(data.days, 'contribution'), `GitHub contributions, ${data.from} to ${data.to}`, readout);
  container.append(top, map, bottom);
}

function tokenCount(value) {
  if (!Number.isFinite(value)) return '--';
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toLocaleString('en-US');
}

function duration(seconds) {
  if (!Number.isFinite(seconds)) return '--';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m ${Math.floor(seconds % 60)}s`;
}

function usageMetrics(metrics) {
  const list = element('dl', 'usage-metrics');
  for (const [label, value] of metrics) {
    const pair = element('div');
    pair.append(element('dt', '', label), element('dd', '', value));
    list.append(pair);
  }
  return list;
}

function monthLabels(months, weeks) {
  const row = element('div', 'usage-months');
  row.style.setProperty('--weeks', weeks);
  row.setAttribute('aria-hidden', 'true');
  for (const month of months) {
    const label = element('span', '', month.label);
    label.style.gridColumn = `${month.weekIndex + 1} / span ${Math.min(month.span || 1, weeks - month.weekIndex)}`;
    row.append(label);
  }
  return row;
}

function datedMonths(days) {
  const offset = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
  const seen = new Set();
  const months = [];
  for (const [index, day] of days.entries()) {
    const month = day.date.slice(0, 7);
    if (seen.has(month)) continue;
    seen.add(month);
    months.push({ label: new Date(day.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), weekIndex: Math.floor((index + offset) / 7), span: 3 });
  }
  return months;
}

function usageDetails(data) {
  const details = element('details', 'usage-details');
  details.append(element('summary', '', 'insights + most used plugins'));
  const lists = element('div', 'usage-detail-columns');
  lists.append(usageMetrics(data.insights.map(item => [item.label, item.value])), usageMetrics(data.plugins.map(item => [item.name, `${item.runs} runs`])));
  details.append(lists);
  return details;
}

function claudeTrend(days) {
  const recent = days.slice(-42);
  if (!recent.length) return document.createDocumentFragment();
  const peak = Math.max(...recent.map(day => day.count), 1);
  const panel = element('div', 'usage-trend');
  const head = element('div', 'activity-topline');
  head.append(element('strong', '', 'daily messages / last 42 days'), element('span', '', `peak: ${peak.toLocaleString('en-US')}`));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 720 104');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Daily Claude messages, ${recent[0].date} to ${recent.at(-1).date}. Peak ${peak.toLocaleString('en-US')} messages.`);
  for (const y of [8, 50, 94]) {
    const line = document.createElementNS(svg.namespaceURI, 'line');
    for (const [key, value] of Object.entries({ x1: 4, x2: 716, y1: y, y2: y })) line.setAttribute(key, value);
    line.setAttribute('class', 'trend-guide');
    svg.append(line);
  }
  const points = recent.map((day, index) => [4 + index / Math.max(1, recent.length - 1) * 712, 94 - day.count / peak * 86]);
  const line = document.createElementNS(svg.namespaceURI, 'polyline');
  line.setAttribute('points', points.map(point => point.join(',')).join(' '));
  line.setAttribute('class', 'usage-trend-line');
  svg.append(line);
  for (const [index, day] of recent.entries()) {
    const dot = document.createElementNS(svg.namespaceURI, 'circle');
    dot.setAttribute('cx', points[index][0]);
    dot.setAttribute('cy', points[index][1]);
    dot.setAttribute('r', '2');
    const title = document.createElementNS(svg.namespaceURI, 'title');
    title.textContent = `${day.date}: ${day.count.toLocaleString('en-US')} messages`;
    dot.append(title);
    svg.append(dot);
  }
  const dates = element('div', 'activity-bottomline');
  dates.append(element('span', '', recent[0].date), element('span', '', recent.at(-1).date));
  panel.append(head, svg, dates);
  return panel;
}

function populateUsage(container) {
  const kind = container.dataset.usage;
  const data = TERMINAL_USAGE[kind];
  const summary = data.summary;
  const bottom = element('div', 'activity-bottomline');
  const readout = element('span', '', kind === 'codex' ? 'relative activity / levels 0–4' : 'hover a day to inspect messages');
  bottom.append(readout, element('span', '', `snapshot: ${data.generatedAt.slice(0, 10)}`));
  let cells;
  let months;
  if (kind === 'codex') {
    container.append(usageMetrics([
      ['lifetime tokens', tokenCount(summary.lifetimeTokens)],
      ['peak tokens', tokenCount(summary.peakTokens)],
      ['longest chat', duration(summary.longestChatSeconds)],
      ['current streak', `${summary.currentStreakDays}d`],
      ['longest streak', `${summary.longestStreakDays}d`],
    ]));
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // This export contains week/day intensity levels, not dated daily token counts.
    cells = data.heatmap.weeks.flatMap((week, weekIndex) => week.map((level, dayIndex) => ({
      level,
      label: `Week ${weekIndex + 1}, ${weekdays[dayIndex]}: activity level ${level} of 4`,
    })));
    months = data.heatmap.monthLabels;
  } else {
    container.append(usageMetrics([
      ['sessions', summary.sessions.toLocaleString('en-US')],
      ['messages', summary.messages.toLocaleString('en-US')],
      ['tokens', tokenCount(summary.totalTokens)],
      ['active days', `${summary.activeDays}d`],
    ]));
    cells = datedActivityCells(data.heatmap.days, 'Claude message');
    months = datedMonths(data.heatmap.days);
  }
  const weeks = Math.ceil(cells.length / 7);
  const label = kind === 'codex' ? 'ChatGPT and Codex cumulative token activity, Jan–Aug 2026; relative levels 0 to 4' : `Claude Code daily messages, ${data.heatmap.days[0].date} to ${data.sourceLastComputedDate}`;
  container.append(monthLabels(months, weeks), createHeatmap(cells, label, readout), bottom);
  if (kind === 'codex') container.append(usageDetails(data));
  else container.append(claudeTrend(data.heatmap.days));
}

function finishView(label, preserveFocus) {
  commandLog.replaceChildren();
  screen.scrollTop = 0;
  closeTree();
  if (preserveFocus) screen.focus({ preventScroll: true });
  announcement.textContent = `${label} opened.`;
}

function renderView(view) {
  const template = document.querySelector(`#${view}-template`);
  if (!template) return;
  const preserveFocus = content.contains(document.activeElement) || (tree.classList.contains('is-open') && tree.contains(document.activeElement));
  content.replaceChildren(template.content.cloneNode(true));
  content.querySelectorAll('[data-project-list]').forEach(slot => slot.append(projectList()));
  content.querySelectorAll('[data-activity]').forEach(populateActivity);
  content.querySelectorAll('[data-usage]').forEach(populateUsage);
  const files = { home: '~/README.md', projects: '~/projects/', experience: '~/experience.log', contact: '~/contact.txt', activity: '~/activity.dat', help: 'help' };
  setPath(view === 'projects' ? '~/projects' : '~', files[view]);
  setSelection(view);
  window.history.replaceState(null, '', `#${view}`);
  finishView(view === 'home' ? 'Overview' : view, preserveFocus);
}

function openProject(key) {
  const project = terminalProjects[key];
  if (!project) return;
  const preserveFocus = content.contains(document.activeElement) || (tree.classList.contains('is-open') && tree.contains(document.activeElement));
  content.replaceChildren();
  const command = element('div', 'output-command', `karan@seroy:~/projects/${project.name}$ cat README.md`);
  const heading = element('h1', 'file-heading', project.name);
  const meta = element('div', 'project-meta');
  meta.append(element('span', '', project.stack), element('span', '', 'public repository'));
  const body = element('div', 'project-body');
  body.append(element('p', '', project.description), element('h2', '', '# The shape of it'), element('pre', 'project-architecture', project.diagram), element('h2', '', '# Project notes'), element('p', '', project.note));
  const links = element('div', 'project-links');
  const repository = element('a', '', 'Open repository ↗');
  repository.href = project.url;
  repository.target = '_blank';
  repository.rel = 'noreferrer';
  const back = element('button', '', 'cd ..');
  back.dataset.command = 'cd ..';
  links.append(repository, back);
  body.append(links);
  content.append(command, heading, meta, body);
  setPath(`~/projects/${project.name}`, `~/projects/${project.name}/README.md`);
  setSelection('projects', key);
  window.history.replaceState(null, '', `#project/${key}`);
  finishView(project.name, preserveFocus);
}

function appendResult(rawCommand, text) {
  const entry = element('div', 'log-entry');
  entry.append(element('div', 'command-echo', `karan@seroy:${currentDirectory}$ ${rawCommand}`), element('div', 'command-result', text));
  commandLog.append(entry);
  // Keep exploratory sessions bounded without affecting the selected portfolio view.
  while (commandLog.children.length > 40) commandLog.firstElementChild.remove();
  screen.scrollTop = screen.scrollHeight;
  announcement.textContent = text;
}

function palette(name) {
  if (!['green', 'amber', 'ice'].includes(name)) return false;
  document.documentElement.dataset.palette = name;
  document.querySelectorAll('button[data-palette]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.palette === name)));
  try { localStorage.setItem('terminal-design-palette', name); } catch { /* The palette still works without storage. */ }
  announcement.textContent = `${name} palette selected.`;
  return true;
}

function projectKey(input) {
  const normalized = input.toLowerCase().replace(/^~?\/?projects\//, '').replace(/\/readme\.md$/, '').replace(/\/$/, '');
  return Object.keys(terminalProjects).find(key => normalized === key || normalized === terminalProjects[key].name.toLowerCase());
}

function runCommand(raw) {
  const value = raw.trim();
  if (!value) return;
  if (history.at(-1) !== value) history.push(value);
  if (history.length > 100) history.shift();
  historyPosition = history.length;
  historyDraft = '';
  const command = value.toLowerCase().replace(/\s+/g, ' ');
  if (command === 'cat readme.md' && currentDirectory.startsWith('~/projects/')) return openProject(projectKey(currentDirectory));
  if (['whoami', 'home', 'about', 'cat readme.md', 'cat ~/readme.md', 'cd ~', 'cd', 'cd /'].includes(command)) return renderView('home');
  if (['projects', 'ls projects', 'ls projects/', 'ls ~/projects', 'ls ~/projects/', 'cd projects', 'cd projects/', 'cd ~/projects', 'cd ~/projects/'].includes(command)) return renderView('projects');
  if (['experience', 'cat experience.log', 'cat ~/experience.log'].includes(command)) return renderView('experience');
  if (['contact', 'cat contact.txt', 'cat ~/contact.txt', 'github', 'email', 'linkedin'].includes(command)) return renderView('contact');
  if (['activity', 'cat activity.dat', 'cat ~/activity.dat'].includes(command)) return renderView('activity');
  if (['help', '?', 'man portfolio'].includes(command)) return renderView('help');
  if (command === 'pwd') return appendResult(value, currentDirectory.replace('~', '/home/karan'));
  if (command === 'clear') {
    content.replaceChildren();
    commandLog.replaceChildren();
    announcement.textContent = 'Terminal cleared. Type home to return to the overview.';
    return;
  }
  if (command === 'cd ..') return renderView(currentDirectory.startsWith('~/projects/') ? 'projects' : 'home');
  if (['ls', 'ls -la', 'ls -l', 'ls -a'].includes(command)) {
    if (currentDirectory === '~/projects') return renderView('projects');
    return appendResult(value, currentDirectory === '~' ? 'README.md  projects/  experience.log  activity.dat  contact.txt' : 'README.md');
  }
  if (command.startsWith('theme ')) {
    const name = command.slice(6);
    return appendResult(value, palette(name) ? `palette: ${name}` : 'Available palettes: green, amber, ice.');
  }
  if (/^(open|cd|cat) /.test(command)) {
    const path = command.replace(/^(open|cd|cat) /, '').replace(/^\.\//, '');
    const key = projectKey(path);
    if (key) return openProject(key);
    return appendResult(value, `No portfolio file named "${path}". Type ls or help to explore.`);
  }
  appendResult(value, `Command not found: ${value}\nType help for portfolio commands.`);
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.view) renderView(button.dataset.view);
  else if (button.dataset.project) openProject(button.dataset.project);
  else if (button.dataset.command) runCommand(button.dataset.command);
  else if (button.dataset.palette) palette(button.dataset.palette);
});

document.querySelector('#command-form').addEventListener('submit', event => {
  event.preventDefault();
  const command = commandInput.value;
  commandInput.value = '';
  runCommand(command);
});

const completions = ['whoami', 'home', 'projects', 'experience', 'contact', 'activity', 'help', 'clear', 'pwd', 'ls', 'cat README.md', 'cat experience.log', 'cat contact.txt', 'cat activity.dat', 'cd projects', 'cd ~', 'theme green', 'theme amber', 'theme ice', ...Object.keys(terminalProjects).map(key => `open ${terminalProjects[key].name.toLowerCase()}`)];
commandInput.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (historyPosition === history.length) historyDraft = commandInput.value;
    historyPosition = Math.max(0, historyPosition - 1);
    commandInput.value = history[historyPosition] || '';
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    historyPosition = Math.min(history.length, historyPosition + 1);
    commandInput.value = historyPosition === history.length ? historyDraft : history[historyPosition];
  } else if (event.key === 'Tab' && !event.shiftKey && commandInput.value.trim()) {
    const candidates = completions.filter(item => item.toLowerCase().startsWith(commandInput.value.toLowerCase()));
    if (!candidates.length) return;
    event.preventDefault();
    if (candidates.length === 1) commandInput.value = candidates[0];
    else appendResult(commandInput.value, candidates.join('  '));
  } else if (event.key === 'Escape') {
    commandInput.blur();
    screen.focus({ preventScroll: true });
  } else if (event.ctrlKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    runCommand('clear');
  }
});

document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'b' && !event.isComposing) {
    event.preventDefault();
    if (!event.repeat) toggleTree();
    return;
  }
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, [contenteditable]')) {
    event.preventDefault();
    commandInput.focus();
  }
  if (event.key === 'Escape' && tree.classList.contains('is-open')) closeTree(true);
});

treeToggle.addEventListener('click', toggleTree);
mobileLayout.addEventListener('change', () => {
  mobileTreeOpen = false;
  syncTree();
});
screen.addEventListener('click', () => closeTree());
syncTree();

try { palette(localStorage.getItem('terminal-design-palette') || 'green'); } catch { palette('green'); }
function renderRoute(initial = false) {
  const route = window.location.hash.slice(1);
  if (route.startsWith('project/') && terminalProjects[route.slice(8)]) openProject(route.slice(8));
  else if (['home', 'projects', 'experience', 'contact', 'activity', 'help'].includes(route)) renderView(route);
  else if (initial) renderView('home');
}
window.addEventListener('hashchange', () => renderRoute());
renderRoute(true);
