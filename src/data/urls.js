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

  const [rawPath, rawQuery] = to.split('?');
  const suffix = rawQuery ? `?${rawQuery}` : '';
  const clean = (rawPath || '').replace(/^[#/]+/, '').toLowerCase();

  if (!clean || clean === 'home') return `/${suffix}`;
  if (clean.startsWith('resource')) return `/resources${suffix}`;
  if (clean.startsWith('video')) return `/videos${suffix}`;
  if (clean.startsWith('session') || clean.startsWith('upcoming') || clean.startsWith('training')) return `/sessions${suffix}`;
  if (clean.startsWith('referenc')) return `/referencing${suffix}`;
  if (clean.startsWith('newsletter')) return `/newsletter${suffix}`;
  if (clean.startsWith('llnd') || clean.startsWith('myllnd')) return 'https://myllnd.com/login';
  if (clean.startsWith('learning-support')) return `/learning-support${suffix}`;
  if (clean.startsWith('consult') || clean.startsWith('contact')) return `/contact${suffix}`;
  if (clean.includes('link') || clean.startsWith('tool')) return `/useful-links${suffix}`;
  if (clean.startsWith('record')) return `/recordings${suffix}`;

  return `/${clean}${suffix}`;
}
