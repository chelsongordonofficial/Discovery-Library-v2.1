/**
 * Fallback session data for Discovery Library
 * Dates configured with upcoming sessions (relative to current date) and past sessions.
 */

const FALLBACK_UPCOMING_SESSIONS = [
  {
    id: 'fb-up-1',
    cat: 'live',
    type: 'Live session',
    title: 'Referencing Clinic: APA 7th Edition',
    d: '07',
    mon: 'Nov',
    wd: 'Sat',
    time: '3:00 PM – 4:00 PM AEST',
    iso: '2026-11-07T05:00:00Z',
    rawDate: '2026-11-07',
  },
  {
    id: 'fb-up-2',
    cat: 'workshop',
    type: 'Workshop',
    title: 'Research Skills Workshop: Finding Credible Sources',
    d: '14',
    mon: 'Nov',
    wd: 'Sat',
    time: '10:00 AM – 11:30 AM AEST',
    iso: '2026-11-14T00:00:00Z',
    rawDate: '2026-11-14',
  },
  {
    id: 'fb-up-3',
    cat: 'webinar',
    type: 'Webinar',
    title: 'Using AI Responsibly in Your Coursework',
    d: '21',
    mon: 'Nov',
    wd: 'Sat',
    time: '11:00 AM – 12:00 PM AEDT',
    iso: '2026-11-21T00:00:00Z',
    rawDate: '2026-11-21',
  },
  {
    id: 'fb-up-4',
    cat: 'workshop',
    type: 'Workshop',
    title: 'Numeracy Clinic: Assessment Math & Measurements',
    d: '28',
    mon: 'Nov',
    wd: 'Sat',
    time: '2:00 PM – 3:30 PM AEDT',
    iso: '2026-11-28T03:00:00Z',
    rawDate: '2026-11-28',
  },
  {
    id: 'fb-up-5',
    cat: 'live',
    type: 'Live session',
    title: 'ASQA Standards Update: Information Briefing',
    d: '05',
    mon: 'Dec',
    wd: 'Sat',
    time: '1:00 PM – 2:30 PM AEDT',
    iso: '2026-12-05T02:00:00Z',
    rawDate: '2026-12-05',
  },
];

const FALLBACK_PREVIOUS_SESSIONS = [
  {
    id: 'fb-prev-1',
    cat: 'live',
    type: 'Live session',
    title: 'ASQA Standards Update: Information Briefing',
    d: '24',
    mon: 'Oct',
    wd: 'Sat',
    time: '1:00 PM – 2:30 PM AEDT',
    iso: '2026-10-24T02:00:00Z',
    rawDate: '2026-10-24',
  },
  {
    id: 'fb-prev-2',
    cat: 'workshop',
    type: 'Workshop',
    title: 'Numeracy Clinic: Assessment Math & Measurements',
    d: '17',
    mon: 'Oct',
    wd: 'Sat',
    time: '2:00 PM – 3:30 PM AEDT',
    iso: '2026-10-17T03:00:00Z',
    rawDate: '2026-10-17',
  },
  {
    id: 'fb-prev-3',
    cat: 'webinar',
    type: 'Webinar',
    title: 'Using AI Responsibly in Your Coursework',
    d: '10',
    mon: 'Oct',
    wd: 'Sat',
    time: '11:00 AM – 12:00 PM AEDT',
    iso: '2026-10-10T00:00:00Z',
    rawDate: '2026-10-10',
  },
  {
    id: 'fb-prev-4',
    cat: 'workshop',
    type: 'Workshop',
    title: 'Research Skills Workshop: Finding Credible Sources',
    d: '03',
    mon: 'Oct',
    wd: 'Sat',
    time: '10:00 AM – 11:30 AM AEST',
    iso: '2026-10-03T00:00:00Z',
    rawDate: '2026-10-03',
  },
  {
    id: 'fb-prev-5',
    cat: 'live',
    type: 'Live session',
    title: 'Referencing Clinic: APA 7th Edition',
    d: '26',
    mon: 'Sep',
    wd: 'Sat',
    time: '3:00 PM – 4:00 PM AEST',
    iso: '2026-09-26T05:00:00Z',
    rawDate: '2026-09-26',
  },
];

const SESSIONS = FALLBACK_UPCOMING_SESSIONS;

function nextSession() {
  const now = Date.now();
  return SESSIONS.find((s) => new Date(s.iso).getTime() > now) || SESSIONS[0];
}

export { SESSIONS, FALLBACK_UPCOMING_SESSIONS, FALLBACK_PREVIOUS_SESSIONS, nextSession };