import { projects } from './projectData';

export const viewPaths = { home: '/', projects: '/projects.html', experience: '/about.html', contact: '/contact.html', activity: '/activity.html' };
export const viewFiles = { home: '~/README.md', projects: '~/projects/', experience: '~/experience.log', contact: '~/contact.txt', activity: '~/activity.dat' };
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
