/**
 * WordPress REST API Integration Service for Discovery Library
 * Domain: https://discoverylibrary.com.au/
 * Custom Post Types (CPTs):
 *  - Training Videos: /wp-json/wp/v2/training_video
 *  - Upcoming Sessions: /wp-json/wp/v2/upcoming_session
 *  - Useful Links & Videos: /wp-json/wp/v2/useful_link_video
 *  - Newsletters: /wp-json/wp/v2/newsletter
 */

import {
  FALLBACK_UPCOMING_SESSIONS,
  FALLBACK_PREVIOUS_SESSIONS,
  SEARCH_VIDEOS,
  SITE_URLS,
} from '../data/index.js';

export const WP_DOMAIN = 'https://discoverylibrary.com.au';
const CACHE_KEY = 'discovery_library_wp_cache_v10';

export const WP_ENDPOINTS = {
  trainingVideos: `${WP_DOMAIN}/wp-json/wp/v2/training_video`,
  upcomingSessions: `${WP_DOMAIN}/wp-json/wp/v2/upcoming_session`,
  usefulLinks: `${WP_DOMAIN}/wp-json/wp/v2/useful_link_video`,
  newsletters: `${WP_DOMAIN}/wp-json/wp/v2/newsletter`,
};

/**
 * Reads cached WP data synchronously from localStorage to eliminate loading flash
 */
export function getStoredWpCache() {
  if (typeof window === 'undefined') return null;
  try {
    // Clear old legacy cache versions if present
    localStorage.removeItem('discovery_library_wp_cache_v1');
    localStorage.removeItem('discovery_library_wp_cache_v2');
    localStorage.removeItem('discovery_library_wp_cache_v6');
    localStorage.removeItem('discovery_library_wp_cache_v7');
    localStorage.removeItem('discovery_library_wp_cache_v8');
    localStorage.removeItem('discovery_library_wp_cache_v9');

    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cache valid for 30 minutes
    if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
      const data = parsed.data;
      if (data && Array.isArray(data.sessions)) {
        data.sessions = data.sessions.filter((s) => s && s.isWp === true);
      }
      return data;
    }
  } catch {
    // Ignore cache parse errors
  }
  return null;
}

/**
 * Saves WP data to localStorage
 */
export function setStoredWpCache(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Ignore quota errors
  }
}

/**
 * Decodes HTML entities commonly returned by WordPress REST API
 */
export function decodeHtml(html) {
  if (!html) return '';
  if (typeof document !== 'undefined') {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
  return html
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&#8217;|&#39;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Determines whether a session is upcoming (today or in the future)
 * or previous (strictly in the past before today).
 */
export function isSessionUpcoming(session, now = new Date()) {
  if (!session) return false;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Check rawDate string (YYYY-MM-DD)
  if (session.rawDate) {
    const parts = session.rawDate.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const sessionDayStart = new Date(y, m, d, 0, 0, 0, 0);

      // If the day is strictly before today -> previous / past
      if (sessionDayStart.getTime() < todayStart.getTime()) {
        return false;
      }
      // If the day is strictly after today -> upcoming / future
      if (sessionDayStart.getTime() > todayStart.getTime()) {
        return true;
      }
    }
  }

  // If the session is scheduled for today, check time if available
  if (session.iso) {
    const sDate = new Date(session.iso);
    if (!isNaN(sDate.getTime())) {
      const sDay = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), 0, 0, 0, 0);
      if (sDay.getTime() < todayStart.getTime()) return false;
      if (sDay.getTime() > todayStart.getTime()) return true;
      // If date is today, check if timestamp has passed
      return sDate.getTime() >= now.getTime();
    }
  }

  return true;
}

/**
 * Normalizes an upcoming_session CPT item from WordPress
 */
export function normalizeUpcomingSession(item) {
  if (!item) return null;
  const meta = item.meta || {};
  if (meta.is_visible === false) return null;

  const rawTitle = meta.show_title === false ? '' : decodeHtml(item.title?.rendered || '');

  // Exclude {AEDT} or {AEST} from displaying in the website title
  const title = rawTitle
    .replace(/\s*\{(AEDT|AEST)\}\s*/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const isDateHidden = meta.show_session_date === false || ('session_date' in meta && meta.session_date === null);
  const dateStr = isDateHidden ? '' : (meta.session_date || (item.date ? item.date.split('T')[0] : ''));

  const isTimeHidden = meta.show_session_time === false || ('session_time' in meta && meta.session_time === null);
  let timeStr = isTimeHidden ? '' : (meta.session_time || item.session_time || '');

  // Extract timezone only if provided in timeStr or title
  let detectedTz = '';
  if (timeStr) {
    const tzInTimeMatch = timeStr.match(/\b(AEST|AEDT|AWST|ACST|ACDT)\b/i);
    if (tzInTimeMatch) {
      detectedTz = tzInTimeMatch[1].toUpperCase();
    } else {
      const tzInTitleMatch = rawTitle.match(/\{(AEDT|AEST)\}/i);
      if (tzInTitleMatch) {
        detectedTz = tzInTitleMatch[1].toUpperCase();
        timeStr = `${timeStr} ${detectedTz}`;
      }
    }
  }

  // Extract description strictly when enabled from CPT
  const isDescHidden = meta.show_description === false || ('description' in meta && meta.description === null);
  const rawDesc = isDescHidden ? '' : (meta.description || '');
  const desc = decodeHtml(rawDesc.replace(/<[^>]+>/g, '').trim());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let d = '';
  let mon = '';
  let wd = '';
  let year = '';
  let iso = item.date || '';

  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const yearNum = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const dayNum = parseInt(parts[2], 10);

      let hours = 14;
      let minutes = 0;
      if (timeStr) {
        const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
        if (match) {
          let h = parseInt(match[1], 10);
          const m = match[2] ? parseInt(match[2], 10) : 0;
          let ampm = match[3] ? match[3].toUpperCase() : null;

          if (!ampm) {
            const overallAmpm = timeStr.match(/\b(AM|PM)\b/i);
            if (overallAmpm) ampm = overallAmpm[1].toUpperCase();
          }

          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          hours = h;
          minutes = m;
        }
      }

      const dateObj = new Date(yearNum, monthIdx, dayNum, hours, minutes, 0);
      d = String(dayNum).padStart(2, '0');
      mon = months[monthIdx] || '';
      wd = days[dateObj.getDay()] || '';
      year = String(yearNum);
      iso = dateObj.toISOString();
    }
  }

  // Categorization kept strictly for optional filter matching
  const lower = title.toLowerCase();
  let cat = 'live';
  if (lower.includes('workshop')) {
    cat = 'workshop';
  } else if (lower.includes('webinar')) {
    cat = 'webinar';
  }

  const sessionObj = {
    id: item.id,
    cat,
    type: '',
    title,
    rawTitle,
    desc,
    timezone: detectedTz,
    d,
    mon,
    wd,
    year,
    time: timeStr,
    iso,
    rawDate: dateStr,
    video_url: meta.show_video_url === false ? '' : (meta.video_url || ''),
    link: item.link || '',
    isWp: true,
  };

  const isUpcoming = isSessionUpcoming(sessionObj);
  sessionObj.isUpcoming = isUpcoming;
  sessionObj.isPast = !isUpcoming;

  return sessionObj;
}

/**
 * Normalizes a training_video CPT item from WordPress
 */
export function normalizeTrainingVideo(item) {
  if (!item) return null;
  const meta = item.meta || {};
  if (meta.is_visible === false) return null;

  const title = meta.show_title === false ? '' : decodeHtml(item.title?.rendered || 'Training Video');
  const description = meta.show_description === false ? '' : decodeHtml(meta.description || '');

  return {
    id: item.id,
    title,
    desc: description,
    video_url: meta.show_video_url === false ? '' : (meta.video_url || ''),
    quiz_link: meta.show_quiz_link === false ? '' : (meta.quiz_link || ''),
    link: item.link || '',
    isWp: true,
  };
}

/**
 * Normalizes a useful_link_video CPT item from WordPress
 */
export function normalizeUsefulLink(item) {
  if (!item) return null;
  const meta = item.meta || {};
  if (meta.is_visible === false) return null;

  const title = meta.show_title === false ? '' : decodeHtml(item.title?.rendered || 'Useful Link & Resource');

  return {
    id: item.id,
    title,
    desc: meta.show_description === false ? '' : decodeHtml(meta.description || meta.desc || ''),
    url: meta.show_video_url === false ? '' : (meta.video_url || meta.url || meta.link || ''),
    isWp: true,
  };
}

const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SHORT_MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Extracts normalized { month, year, rawDate, sortTime } from WordPress CPT meta.newsletter_date or post date
 */
export function parseNewsletterDate(rawDateStr, fallbackIsoDate = '') {
  const candidates = [rawDateStr, fallbackIsoDate].filter((v) => typeof v === 'string' && v.trim());

  for (const raw of candidates) {
    const str = raw.trim();

    // 1. YYYY-MM-DD or YYYY/MM/DD or YYYY-MM (with optional time)
    const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
    if (isoMatch) {
      const yearNum = parseInt(isoMatch[1], 10);
      const monthIdx = Math.max(0, Math.min(11, parseInt(isoMatch[2], 10) - 1));
      const dayNum = isoMatch[3] ? parseInt(isoMatch[3], 10) : 1;
      return {
        month: FULL_MONTHS[monthIdx],
        year: String(yearNum),
        rawDate: str.split('T')[0],
        sortTime: new Date(yearNum, monthIdx, dayNum).getTime(),
      };
    }

    // 2. DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmyMatch) {
      const dayNum = parseInt(dmyMatch[1], 10);
      const monthIdx = Math.max(0, Math.min(11, parseInt(dmyMatch[2], 10) - 1));
      const yearNum = parseInt(dmyMatch[3], 10);
      return {
        month: FULL_MONTHS[monthIdx],
        year: String(yearNum),
        rawDate: str,
        sortTime: new Date(yearNum, monthIdx, dayNum).getTime(),
      };
    }

    // 3. Text month & year (e.g. "October 2026", "October 15, 2026", "Oct 2025")
    const lower = str.toLowerCase();
    const yearMatch = str.match(/\b(20\d{2})\b/);
    const monthIdx = SHORT_MONTHS.findIndex((m) => lower.includes(m));
    if (monthIdx !== -1 || yearMatch) {
      const resolvedMonthIdx = monthIdx !== -1 ? monthIdx : 0;
      const yearNum = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      const dayMatch = str.match(/\b(\d{1,2})\b/);
      const dayNum = dayMatch && parseInt(dayMatch[1], 10) <= 31 ? parseInt(dayMatch[1], 10) : 1;
      return {
        month: monthIdx !== -1 ? FULL_MONTHS[resolvedMonthIdx] : '',
        year: yearMatch ? yearMatch[1] : String(yearNum),
        rawDate: str,
        sortTime: new Date(yearNum, resolvedMonthIdx, dayNum).getTime(),
      };
    }

    // 4. Native Date fallback
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return {
        month: FULL_MONTHS[parsed.getMonth()],
        year: String(parsed.getFullYear()),
        rawDate: str.split('T')[0],
        sortTime: parsed.getTime(),
      };
    }
  }

  return {
    month: '',
    year: String(new Date().getFullYear()),
    rawDate: '',
    sortTime: 0,
  };
}

/**
 * Normalizes a newsletter CPT item from WordPress
 */
export function normalizeNewsletter(item) {
  if (!item) return null;
  const meta = item.meta || {};
  if (meta.is_visible === false) return null;

  const title = decodeHtml(item.title?.rendered || 'Discovery Library Newsletter');
  const { month, year, rawDate, sortTime } = parseNewsletterDate(
    meta.newsletter_date || item.newsletter_date,
    item.date || item.date_gmt
  );

  const fileUrl = meta.file_url || meta.pdf_url || item.acf?.file_url || item.acf?.pdf_url || '';
  const previewUrl = fileUrl || item.link || '';

  return {
    id: item.id,
    title,
    month,
    year,
    date: rawDate,
    sortTime,
    file_url: fileUrl,
    pdf_url: previewUrl,
    show_title: meta.show_title !== false,
    show_newsletter_date: meta.show_newsletter_date !== false,
    show_file_url: meta.show_file_url !== false,
    link: item.link || '',
    isWp: true,
  };
}

/**
 * Fetch with timeout helper
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Fetch Upcoming Sessions from WordPress
 */
export async function fetchUpcomingSessions() {
  try {
    const res = await fetchWithTimeout(`${WP_ENDPOINTS.upcomingSessions}?per_page=100`);
    if (!res.ok) throw new Error(`WP upcoming_session status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(normalizeUpcomingSession).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.warn('[Discovery Library] Failed to fetch upcoming_session from WP:', err.message);
    return null;
  }
}

/**
 * Fetch Training Videos from WordPress
 */
export async function fetchTrainingVideos() {
  try {
    const res = await fetchWithTimeout(`${WP_ENDPOINTS.trainingVideos}?per_page=100`);
    if (!res.ok) throw new Error(`WP training_video status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(normalizeTrainingVideo).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.warn('[Discovery Library] Failed to fetch training_video from WP:', err.message);
    return null;
  }
}

/**
 * Fetch Useful Links & Videos from WordPress
 */
export async function fetchUsefulLinks() {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetchWithTimeout(`${WP_ENDPOINTS.usefulLinks}?per_page=100`);
      if (!res.ok) throw new Error(`WP useful_link_video status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(normalizeUsefulLink).filter(Boolean);
      }
      return [];
    } catch (err) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      console.warn('[Discovery Library] Failed to fetch useful_link_video from WP:', err.message);
      return null;
    }
  }
  return null;
}

/**
 * Fetch Newsletters from WordPress
 * Returns array (possibly empty) when connected, or null when unreachable/errored.
 */
export async function fetchNewsletters() {
  try {
    const res = await fetchWithTimeout(`${WP_ENDPOINTS.newsletters}?per_page=100`);
    if (!res.ok) throw new Error(`WP newsletter status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data
        .map(normalizeNewsletter)
        .filter(Boolean)
        .sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0));
    }
    return [];
  } catch (err) {
    console.warn('[Discovery Library] Failed to fetch newsletter from WP:', err.message);
    return null;
  }
}

/**
 * Partitions sessions into upcoming (today or future) and previous (past before today)
 */
export function partitionSessions(sessions = []) {
  const upcoming = [];
  const previous = [];

  sessions.forEach((s) => {
    if (isSessionUpcoming(s)) {
      upcoming.push(s);
    } else {
      previous.push(s);
    }
  });

  // Sort upcoming sessions ascending (soonest first)
  upcoming.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());

  // Sort previous sessions descending (most recent past session first)
  previous.sort((a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime());

  return { upcoming, previous };
}

/**
 * Returns upcoming sessions:
 * If WordPress has upcoming sessions, return ONLY the live WP upcoming sessions.
 * Never mix live sessions with fallback data.
 * If live connected and there are no upcoming sessions, return [] so "Coming Soon" shows.
 * Only if completely disconnected from WP and fetch failed, return fallback data.
 */
export function getMergedUpcomingSessions(wpSessions = [], isLiveConnected = true) {
  const { upcoming: wpUpcoming } = partitionSessions(wpSessions);

  // If live WP upcoming sessions exist, return strictly the live sessions
  if (wpUpcoming && wpUpcoming.length > 0) {
    return wpUpcoming;
  }

  // If live connection is active but no sessions are currently upcoming in WP,
  // return empty array so "Coming Soon" design displays (no fallback pollution)
  if (isLiveConnected) {
    return [];
  }

  return FALLBACK_UPCOMING_SESSIONS;
}

/**
 * Returns previous/past sessions:
 * When WordPress data is available, return ONLY the live WP previous sessions.
 * Show fallback data only if the REST endpoint is disconnected/errored.
 */
export function getMergedPreviousSessions(wpSessions = [], isLiveConnected = true) {
  const { previous: wpPrevious } = partitionSessions(wpSessions);

  if (wpPrevious && wpPrevious.length > 0) {
    return wpPrevious;
  }

  // If live connection is active but no past sessions are recorded yet
  if (isLiveConnected && wpSessions.length > 0) {
    return [];
  }

  return FALLBACK_PREVIOUS_SESSIONS;
}

/**
 * Returns the single next upcoming session for the Hero chip.
 * Guaranteed to be today or in the future.
 */
export function getNextUpcomingSession(upcomingSessions = []) {
  if (upcomingSessions && upcomingSessions.length > 0) {
    return upcomingSessions[0];
  }
  return FALLBACK_UPCOMING_SESSIONS[0];
}

/**
 * Returns search videos:
 * When live WP training videos exist, use live WP training videos as Priority 1.
 * Return fallback only when disconnected/empty.
 */
export function getMergedSearchVideos(wpVideos = []) {
  if (wpVideos && wpVideos.length > 0) {
    return wpVideos.map((v) => [v.title, v.desc, v.video_url]);
  }

  return SEARCH_VIDEOS;
}
