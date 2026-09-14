/* Tiny client-side router.
   Every page lives in the DOM as a <section data-route="..."> and we just
   show one at a time — no fetching, no framework. */

// history.pushState needs a real origin, so fall back to hashes on file://
const useHash = location.protocol === 'file:';

const sections = document.querySelectorAll('main section[data-route]');
const tabs = document.querySelectorAll('.tabs a');

const TITLES = {
  '/': 'Anna Poutanen',
  '/experience': 'Experience — Anna Poutanen',
  '/projects': 'Projects — Anna Poutanen',
  '/education': 'Education — Anna Poutanen',
  '/contact': 'Contact — Anna Poutanen',
  '404': 'Not found — Anna Poutanen',
};

function normalize(path) {
  path = (path || '/').split('?')[0].replace(/index\.html$/, '');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path.toLowerCase() || '/';
}

function currentPath() {
  return normalize(useHash ? location.hash.slice(1) : location.pathname);
}

function render() {
  const path = currentPath();
  const known = [...sections].some((s) => s.dataset.route === path);
  const route = known ? path : '404';

  sections.forEach((s) => {
    s.hidden = s.dataset.route !== route;
  });

  tabs.forEach((a) => {
    const href = normalize(a.getAttribute('href'));
    if (href === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  document.title = TITLES[route] || TITLES['404'];
}

function navigate(path) {
  if (normalize(path) === currentPath()) return;
  if (useHash) {
    location.hash = path; // fires hashchange, which re-renders
  } else {
    history.pushState({}, '', path);
    render();
  }
  window.scrollTo(0, 0);
}

// Intercept same-site links; leave mailto, external, and new-tab clicks alone.
document.addEventListener('click', (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const link = e.target.closest('a');
  if (!link || link.target === '_blank') return;

  const href = link.getAttribute('href');
  if (!href || !href.startsWith('/')) return;

  e.preventDefault();
  navigate(href);
});

window.addEventListener('popstate', render);
window.addEventListener('hashchange', render);

// On file:// the tab hrefs have to become hashes so they still work without JS.
if (useHash) {
  document.querySelectorAll('a[href^="/"]').forEach((a) => {
    a.setAttribute('href', '#' + a.getAttribute('href'));
  });
}

// A deep link on GitHub Pages lands on 404.html, which stashes the path here.
const stashed = sessionStorage.getItem('route');
if (stashed) {
  sessionStorage.removeItem('route');
  if (!useHash) history.replaceState({}, '', stashed);
}

render();
