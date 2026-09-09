import { projects } from './projectData';

export const viewPaths = { home: '/', projects: '/projects.html', experience: '/about.html', contact: '/contact.html', activity: '/activity.html', help: '/#help' };
export const viewFiles = { home: '~/README.md', projects: '~/projects/', experience: '~/experience.log', contact: '~/contact.txt', activity: '~/activity.dat', help: 'help' };
export const palettes = ['green', 'amber', 'ice'];

export function projectKey(input = '') {
  const name = input.toLowerCase().replace(/^~?\/?projects\//, '').replace(/\/readme\.md$/, '').replace(/\/$/, '');
  return Object.keys(projects).find(key => name === key || name === projects[key].name.toLowerCase());
}

export function readRoute({ pathname, hash }) {
  const fragment = hash.slice(1);
  if (fragment.startsWith('project/') && projects[fragment.slice(8)]) return { view: 'projects', project: fragment.slice(8) };
  if (Object.hasOwn(viewPaths, fragment)) return { view: fragment };
  const path = pathname.replace(/\/$/, '').replace(/\.html$/, '');
  return { view: ({ '/projects': 'projects', '/about': 'experience', '/contact': 'contact', '/activity': 'activity' })[path] || 'home' };
}

export function routeHref(view, project) {
  return project ? `/projects.html#project/${project}` : viewPaths[view] || '/';
}

export function interpretCommand(raw, directory) {
  const value = raw.trim();
  if (!value) return { type: 'empty' };
  const command = value.toLowerCase().replace(/\s+/g, ' ');
  const go = (view, project) => ({ type: 'navigate', view, project });
  if (command === 'cat readme.md' && directory.startsWith('~/projects/')) return go('projects', projectKey(directory));
  if (['whoami', 'home', 'about', 'cat readme.md', 'cat ~/readme.md', 'cd ~', 'cd', 'cd /'].includes(command)) return go('home');
  if (['projects', 'ls projects', 'ls projects/', 'ls ~/projects', 'ls ~/projects/', 'cd projects', 'cd projects/', 'cd ~/projects', 'cd ~/projects/'].includes(command)) return go('projects');
  if (['experience', 'cat experience.log', 'cat ~/experience.log'].includes(command)) return go('experience');
  if (['contact', 'cat contact.txt', 'cat ~/contact.txt', 'github', 'email', 'linkedin'].includes(command)) return go('contact');
  if (['activity', 'cat activity.dat', 'cat ~/activity.dat'].includes(command)) return go('activity');
  if (['help', '?', 'man portfolio'].includes(command)) return go('help');
  if (command === 'pwd') return { type: 'output', text: directory.replace('~', '/home/karan') };
  if (command === 'clear') return { type: 'clear' };
  if (command === 'cd ..') return go(directory.startsWith('~/projects/') ? 'projects' : 'home');
  if (['ls', 'ls -la', 'ls -l', 'ls -a'].includes(command)) {
    if (directory === '~/projects') return go('projects');
    return { type: 'output', text: directory === '~' ? 'README.md  projects/  experience.log  activity.dat  contact.txt' : 'README.md' };
  }
  if (command.startsWith('theme ')) return { type: 'palette', name: command.slice(6) };
  if (/^(open|cd|cat) /.test(command)) {
    const path = command.replace(/^(open|cd|cat) /, '').replace(/^\.\//, '');
    const key = projectKey(path);
    if (key) return go('projects', key);
    return { type: 'output', text: `No portfolio file named "${path}". Type ls or help to explore.` };
  }
  return { type: 'output', text: `Command not found: ${value}\nType help for portfolio commands.` };
}

export const completions = ['whoami', 'home', 'projects', 'experience', 'contact', 'activity', 'help', 'clear', 'pwd', 'ls', 'cat README.md', 'cat experience.log', 'cat contact.txt', 'cat activity.dat', 'cd projects', 'cd ~', 'theme green', 'theme amber', 'theme ice', ...Object.values(projects).map(project => `open ${project.name.toLowerCase()}`)];
