import { useState, useEffect, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import GradientText from '../components/ui/GradientText';
import { useWpData } from '../context/WpContext';

const RECORDING_FILTERS = [
  { id: 'all', label: 'All Recordings' },
  { id: 'live', label: 'Live Clinics & Briefings' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'webinar', label: 'Webinars' },
];

export default function SessionsPage({ scrollTo = 'upcoming', onNotify }) {
  const {
    upcomingSessions,
    previousSessions,
    hasLiveUpcomingSessions,
    isInitialLoading,
  } = useWpData();

  const [recFilter, setRecFilter] = useState('all');
  const [rsvpSession, setRsvpSession] = useState(null);
  const [confirmedSessions] = useState(new Set());
  const [activePlayback, setActivePlayback] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState(new Set());

  // Auto-scroll to section based on navigation target
  useEffect(() => {
    if (scrollTo === 'recordings' || window.location.hash.includes('recording')) {
      const timer = setTimeout(() => {
        const el = document.getElementById('previous-recordings');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollTo]);

  const filteredRecordings = useMemo(() => {
    return previousSessions.filter((s) => {
      if (recFilter === 'all') return true;
      return s.cat === recFilter;
    });
  }, [previousSessions, recFilter]);

  const handleBook = (s) => {
    setRsvpSession(s);
  };

  const toggleExpand = (id) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Generate and download standard .ics calendar invite
  const handleSaveToCalendar = (session) => {
    try {
      let startDate = new Date();
      let endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      if (session.rawDate) {
        const parts = session.rawDate.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);

          let startH = 14;
          let startM = 0;
          let endH = 15;
          let endM = 30;

          const timeStr = session.time || '';
          const rangeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);

          if (rangeMatch) {
            let h1 = parseInt(rangeMatch[1], 10);
            const m1 = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : 0;
            let ampm1 = rangeMatch[3] ? rangeMatch[3].toUpperCase() : null;

            let h2 = parseInt(rangeMatch[4], 10);
            const m2 = rangeMatch[5] ? parseInt(rangeMatch[5], 10) : 0;
            let ampm2 = rangeMatch[6] ? rangeMatch[6].toUpperCase() : null;

            if (!ampm1 && ampm2) ampm1 = ampm2;
            if (ampm1 === 'PM' && h1 < 12) h1 += 12;
            if (ampm1 === 'AM' && h1 === 12) h1 = 0;

            if (ampm2 === 'PM' && h2 < 12) h2 += 12;
            if (ampm2 === 'AM' && h2 === 12) h2 = 0;

            startH = h1;
            startM = m1;
            endH = h2;
            endM = m2;
          } else {
            const singleMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
            if (singleMatch) {
              let h = parseInt(singleMatch[1], 10);
              const m = singleMatch[2] ? parseInt(singleMatch[2], 10) : 0;
              const ampm = singleMatch[3] ? singleMatch[3].toUpperCase() : 'PM';
              if (ampm === 'PM' && h < 12) h += 12;
              if (ampm === 'AM' && h === 12) h = 0;
              startH = h;
              startM = m;
              endH = h + 1;
              endM = m;
            }
          }

          startDate = new Date(y, m, d, startH, startM, 0);
          endDate = new Date(y, m, d, endH, endM, 0);
        }
      } else if (session.iso) {
        startDate = new Date(session.iso);
        endDate = new Date(startDate.getTime() + 90 * 60 * 1000);
      }

      const pad = (n) => String(n).padStart(2, '0');
      const toIcsDate = (date) =>
        `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

      const cleanTitle = (session.title || 'Discovery Library Session')
        .replace(/\s*\{(AEDT|AEST)\}\s*/gi, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      const desc = (session.desc || 'Discovery Library live referencing session')
        .replace(/\r?\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;');

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Discovery Library//Upcoming Sessions//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${session.id || Date.now()}@discoverylibrary.com.au`,
        `DTSTAMP:${toIcsDate(new Date())}Z`,
        `DTSTART:${toIcsDate(startDate)}`,
        `DTEND:${toIcsDate(endDate)}`,
        `SUMMARY:${cleanTitle}`,
        `DESCRIPTION:${desc}`,
        `LOCATION:Discovery Library Online Session (${session.timezone || 'AEST'})`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-session.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (onNotify) {
        onNotify(`Calendar event (.ics) downloaded for "${cleanTitle}".`);
      }
    } catch (err) {
      console.error('Error generating calendar event:', err);
      if (onNotify) onNotify('Could not download calendar file.');
    }
  };

  const handlePlayRecording = (s) => {
    setActivePlayback(s);
    if (onNotify) onNotify(`Opening recording: "${s.title}"`);
  };

  return (
    <div className="page page-sessions" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Button - No random pill */}
        <div style={{ display: 'flex', textAlign: 'left', marginBottom: 20, gap: 20 }}>
          <RippleButton
            as={Link}
            to="/"
            className="btn btn-ghost btn-sm"
            rippleColor="var(--em)"
          >
            <Icon name="arrowLeft" />
            Back to Home
          </RippleButton>

          <RippleButton
            as="a"
            href="#previous-recordings"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('previous-recordings')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-ghost"
            style={{ borderRadius: 100, minWidth: 190, justifyContent: 'center' }}
            rippleColor="var(--gold)"
          >
            <Icon name="record" />
            Go to Previous Recorded Sessions 
          </RippleButton>

        </div>

        {/* Section Header with Disciplined Typography */}
        <Reveal className="sh" style={{marginLeft: 0}}>
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Upcoming</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Sessions
            </GradientText>
          </h2>
          <p>
            Join upcoming live referencing clinics and workshops.
          </p>
        </Reveal>

        {/* =========================================================================
            SECTION 1 [FIRST]: UPCOMING SESSIONS
            ========================================================================= */}
        <div id="upcoming-sessions-section" style={{ scrollMarginTop: 90 }}>
          {isInitialLoading ? (
            <div className="glass panel" style={{ padding: 40, textAlign: 'center', color: 'var(--sub)' }}>
              Loading upcoming session schedule...
            </div>
          ) : !hasLiveUpcomingSessions || upcomingSessions.length === 0 ? (
            /* Coming Soon Design if nothing is upcoming */
            <Reveal className="glass panel" delay={0.06}>
              <div style={{ padding: '44px 24px', textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: 'rgba(255, 200, 58, 0.12)',
                  border: '1px solid var(--line-gold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon name="calendar" className="gold" />
                </div>
                <h3 style={{ fontSize: 22, marginBottom: 10, color: 'var(--cream)', fontWeight: 600 }}>
                  Upcoming Sessions Schedule Coming Soon
                </h3>
                <p style={{ color: 'var(--sub)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 24 }}>
                  New dates for our live academic integrity clinics and workshops are currently being finalized. You can stream full recordings of our previous sessions below.
                </p>
                <SpecularButton
                  as="a"
                  href="#previous-recordings"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('previous-recordings')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-gold"
                  radius={12}
                >
                  <Icon name="record" />
                  Explore Previous Recorded Sessions
                </SpecularButton>
              </div>
            </Reveal>
          ) : (
            /* Upcoming sessions live list */
            <div style={{ display: 'grid', gap: 16 }}>
              {upcomingSessions.map((s, idx) => {
                const isConfirmed = confirmedSessions.has(s.title);
                const sessionId = s.id || s.title;
                const isExpanded = expandedSessions.has(sessionId);

                // Exclude {AEDT} or {AEST} from displaying in website title
                const displayTitle = (s.title || '')
                  .replace(/\s*\{(AEDT|AEST)\}\s*/gi, ' ')
                  .replace(/\s{2,}/g, ' ')
                  .trim();

                // Get timezone directly from time field (e.g. "3:00 PM – 4:00 PM AEST")
                let displayTime = s.time || '';
                const hasTzInTime = /\b(AEST|AEDT|AWST|ACST|ACDT)\b/i.test(displayTime);
                if (!hasTzInTime && s.timezone) {
                  displayTime = `${displayTime} ${s.timezone}`;
                }

                return (
                  <Reveal key={sessionId} delay={idx * 0.05}>
                    <div
                      className={`glass panel c-${s.cat} upcoming-session-card`}
                    >
                      <div className="datebadge" style={{ width: 66, height: 70 }}>
                        <b style={{ fontSize: 24 }}>{s.d}</b>
                        <span style={{ fontSize: 12 }}>{s.mon}</span>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 13.5, color: 'var(--sub)' }}>{s.wd} · {displayTime}</span>
                        </div>
                        <h4 style={{ fontSize: 17.5, margin: '0 0 8px 0', color: 'var(--cream)', fontWeight: 600 }}>
                          {displayTitle}
                        </h4>
                        <div>
                          <button
                            type="button"
                            onClick={() => toggleExpand(sessionId)}
                            className="session-expand-toggle"
                            aria-expanded={isExpanded}
                            title={isExpanded ? 'Hide session description' : 'View session description'}
                          >
                            <span>{isExpanded ? 'Hide details' : 'View details'}</span>
                            <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} />
                          </button>
                        </div>
                      </div>

                      <div className="session-action-col">
                        <SpecularButton
                          as="button"
                          type="button"
                          onClick={() => handleSaveToCalendar(s)}
                          className="btn btn-em btn-sm save-calendar-btn"
                          radius={12}
                          lineColor="#ffffff"
                          baseColor="#19D68A"
                          intensity={1.25}
                          title="Save session to your calendar (.ics)"
                        >
                          <Icon name="calendar" />
                          Save to Calendar
                        </SpecularButton>

                        <SpecularButton
                          as="button"
                          type="button"
                          onClick={() => handleBook(s)}
                          className="btn btn-gold btn-sm reserve-spot-btn"
                          radius={12}
                          lineColor="#ffffff"
                          baseColor="#FFC83A"
                          intensity={1.25}
                        >
                          <Icon name={isConfirmed ? 'check' : 'calendar'} />
                          {isConfirmed ? 'Reserved' : 'Reserve Spot'}
                        </SpecularButton>
                      </div>

                      {isExpanded && (
                        <div className="session-description-panel">
                          <div className="session-description-icon">
                            <Icon name="info" />
                          </div>
                          <div className="session-description-content">
                            <div className="session-description-label">Session Overview</div>
                            <p className="session-description-text">
                              {s.desc || 'Interactive live referencing clinic covering citation mechanics, ASQA evidence requirements, and Q&A with academic mentors.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

       

        {/* =========================================================================
            SECTION 2 [SECOND]: PREVIOUS RECORDED SESSIONS (Same Cards as Videos Page)
            ========================================================================= */}
        <div id="previous-recordings" style={{ scrollMarginTop: 90, marginTop: 64 }}>
          <Reveal className="sh" style={{ marginBottom: 24, textAlign: 'left' }}>
            <h3 style={{ fontSize: 24, marginBottom: 6, color: 'var(--cream)', fontWeight: 600 }}>
              <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Previous Recorded</span>{' '}
              <GradientText
                colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
                animationSpeed={5}
                style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
              >
                Sessions
              </GradientText>
            </h3>
            <p style={{ margin: 0, fontSize: 15 }}>
              Catch up on past live clinics, workshops, and policy briefings on demand with full trainer guidance.
            </p>
          </Reveal>

          {/* Clean Filter Bar in a Single Horizontal Row */}
          <Reveal className="glass panel" style={{ marginBottom: 32, padding: '16px 20px' }}>
            <div className="filter-group" style={{ justifyContent: 'flex-start' }}>
              {RECORDING_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-tab${recFilter === f.id ? ' active' : ''}`}
                  onClick={() => setRecFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Previous Recorded Sessions Grid - SAME CARDS AS VIDEOS PAGE */}
          {filteredRecordings.length === 0 ? (
            <div className="glass panel" style={{ padding: 36, textAlign: 'center', color: 'var(--sub)' }}>
              No recorded sessions match the selected filter.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
              {filteredRecordings.map((s, idx) => {
                const videoUrl =
                  s.video_url ||
                  'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Academic%20Misconduct%20Policy%20and%20Procedure%20V3.0%20Student%20Training%20Video.mp4';

                return (
                  <Reveal key={s.id || s.title} delay={idx * 0.05}>
                    <div
                      className="glass panel"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        padding: 16,
                        textAlign: 'left',
                        borderRadius: 18,
                      }}
                    >
                      {/* Video Thumbnail Container with Poster & Play Overlay (Same as Videos Page) */}
                      <div
                        onClick={() => handlePlayRecording(s)}
                        style={{
                          position: 'relative',
                          aspectRatio: '16 / 9',
                          borderRadius: 12,
                          overflow: 'hidden',
                          background: 'radial-gradient(circle at center, #093323 0%, #03140d 100%)',
                          cursor: 'pointer',
                          marginBottom: 14,
                          border: '1px solid var(--line)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={`Watch Recording: ${s.title}`}
                      >
                        {/* Subtle video preview */}
                        <video
                          src={videoUrl + '#t=0.5'}
                          preload="metadata"
                          muted
                          playsInline
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.55,
                            filter: 'contrast(1.05) brightness(0.9)',
                          }}
                        />

                        {/* Gradient vignette */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,20,13,0.1) 0%, rgba(3,20,13,0.7) 100%)' }} />

                        {/* Play Button Overlay */}
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: '50%',
                            background: 'rgba(255, 200, 58, 0.92)',
                            color: 'var(--ink)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 2,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                          }}
                        >
                          <Icon name="playSimple" style={{ width: 18, height: 18 }} />
                        </div>

                        {/* Date / Time Badge */}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            zIndex: 2,
                            background: 'rgba(3, 20, 13, 0.85)',
                            color: 'var(--cream)',
                            fontSize: 11,
                            fontFamily: 'var(--f-mono)',
                            padding: '2px 7px',
                            borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          {s.d} {s.mon}
                        </span>
                      </div>

                      {/* Header details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="typetag">{s.type || 'Recorded Session'}</span>
                        <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{s.wd ? `${s.wd} · ` : ''}{s.time || ''}</span>
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => handlePlayRecording(s)}
                        style={{
                          fontSize: 16.5,
                          lineHeight: 1.35,
                          marginBottom: 14,
                          color: 'var(--cream)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {s.title}
                      </h4>

                      {/* Action Button (Same as Videos Page) */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <SpecularButton
                          as="button"
                          type="button"
                          onClick={() => handlePlayRecording(s)}
                          className="btn btn-ghost btn-sm"
                          radius={10}
                          style={{ flex: 1, width: '100%', justifyContent: 'center' }}
                        >
                          Watch Recording <Icon name="arrow" style={{ width: 14, height: 14 }} />
                        </SpecularButton>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Video Playback Modal */}
        {activePlayback && (
          <div
            className="backdrop show"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) setActivePlayback(null); }}
          >
            <div className="modal" style={{ width: 780, maxWidth: '95vw', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, color: 'var(--cream)', margin: 0, textAlign: 'left' }}>
                  {activePlayback.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setActivePlayback(null)}
                  style={{ color: 'var(--sub)', padding: '4px 10px', border: '1px solid var(--line)', borderRadius: 6 }}
                >
                  Close
                </button>
              </div>
              <video
                src={
                  activePlayback.video_url ||
                  'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Academic%20Misconduct%20Policy%20and%20Procedure%20V3.0%20Student%20Training%20Video.mp4'
                }
                controls
                autoPlay
                playsInline
                style={{ width: '100%', borderRadius: 12, maxHeight: '58vh', background: '#000' }}
              />
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', color: 'var(--sub)', fontSize: 13.5 }}>
                <span>Date: {activePlayback.d} {activePlayback.mon}</span>
                <span>Type: {activePlayback.type}</span>
              </div>
            </div>
          </div>
        )}

        {/* RSVP Modal with Gravity Form Mount */}
        {rsvpSession && (
          <div
            className="backdrop show"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) setRsvpSession(null); }}
          >
            <div className="modal" style={{ width: 560, maxWidth: '95vw', padding: '28px 24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <h3 style={{ fontSize: 20, marginBottom: 4, color: 'var(--cream)', fontWeight: 700 }}>
                    Reserve Spot: {(rsvpSession.title || '').replace(/\s*\{(AEDT|AEST)\}\s*/gi, ' ').trim()}
                  </h3>
                  <p style={{ color: 'var(--sub)', fontSize: 13.5, margin: 0 }}>
                    {rsvpSession.wd} · {rsvpSession.d} {rsvpSession.mon} · {rsvpSession.time}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRsvpSession(null)}
                  aria-label="Close"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    color: 'var(--sub)',
                    borderRadius: 8,
                    width: 34,
                    height: 34,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Icon name="close" />
                </button>
              </div>

              {/* Designated Mount Container for WordPress Gravity Forms Session Reservations */}
              <div
                id="gravity-form-session-mount"
                className="gravity-form-mount-target"
                data-gform-mount="true"
                data-session-id={rsvpSession.id}
                data-session-title={rsvpSession.title}
                data-session-date={`${rsvpSession.wd} · ${rsvpSession.d} ${rsvpSession.mon} · ${rsvpSession.time}`}
              >
                <div className="gform-mount-placeholder">
                  <div className="gf-placeholder-icon">
                    <Icon name="calendar" />
                  </div>
                  <div className="gf-placeholder-title">
                    Gravity Form Reservation Mount
                  </div>
                  <p className="gf-placeholder-text">
                    Target container configured for WordPress Gravity Forms. All fields, labels, inputs, and submission buttons inherit the Discovery Library theme.
                  </p>
                  <code className="gf-placeholder-code">
                    #gravity-form-session-mount
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
