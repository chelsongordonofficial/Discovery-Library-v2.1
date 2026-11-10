/**
 * Internal SPA Route Destinations for Discovery Library
 * Removes hardcoded WordPress page redirects so the entire portal acts as a single cohesive app.
 */
export const SITE_URLS = {
  home: '/',
  resources: '/resources',
  videos: '/videos',
  sessions: '/sessions',
  referencing: '/referencing',
  newsletter: '/newsletter',
  llnd: 'http://myllnd.com/login',
  consultation: '/contact',
  contact: '/contact',
  links: '/useful-links',
  recordings: '/recordings',
};

/**
 * Resolves any route or path to the corresponding client-side route.
 */
export function resolveUrl(to) {
  if (!to) return '/';

  // External URLs
  if (
    to.startsWith('http://') ||
    to.startsWith('https://') ||
    to.startsWith('//') ||
    to.startsWith('mailto:') ||
    to.startsWith('tel:')
  ) {
    return to;
  }

  // Anchors
  if (to.startsWith('#') && !to.startsWith('#/')) {
    return to;
  }

  const clean = to.replace(/^[#/]+/, '').toLowerCase();

  if (!clean || clean === 'home') return '/';
  if (clean.startsWith('resource')) return '/resources';
  if (clean.startsWith('video')) return '/videos';
  if (clean.startsWith('session') || clean.startsWith('upcoming') || clean.startsWith('training')) return '/sessions';
  if (clean.startsWith('referenc')) return '/referencing';
  if (clean.startsWith('newsletter')) return '/newsletter';
  if (clean.startsWith('llnd') || clean.startsWith('myllnd')) return 'https://myllnd.com/login';
  if (clean.startsWith('consult') || clean.startsWith('contact')) return '/contact';
  if (clean.includes('link') || clean.startsWith('tool')) return '/useful-links';
  if (clean.startsWith('record')) return '/recordings';

  return `/${clean}`;
}
