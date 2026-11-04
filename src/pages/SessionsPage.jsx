import { useState, useEffect, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
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
  const [studentEmail, setStudentEmail] = useState('');
  const [confirmedSessions, setConfirmedSessions] = useState(new Set());
  const [activePlayback, setActivePlayback] = useState(null);

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

  const submitRsvp = (e) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;
    setConfirmedSessions((prev) => new Set([...prev, rsvpSession.title]));
    if (onNotify) onNotify(`RSVP confirmed for "${rsvpSession.title}". Calendar invite sent to ${studentEmail}!`);
    setRsvpSession(null);
    setStudentEmail('');
  };

  const handlePlayRecording = (s) => {
    setActivePlayback(s);
    if (onNotify) onNotify(`Opening recording: "${s.title}"`);
  };

  return (
    <div className="page page-sessions" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Button - No random pill */}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <RippleButton
            as={Link}
            to="/"
            className="btn btn-ghost btn-sm"
            rippleColor="var(--em)"
          >
            <Icon name="arrowLeft" />
            Back to Home
          </RippleButton>
        </div>

        {/* Section Header with Disciplined Typography */}
        <Reveal className="sh">
          <h2>
            Workshops & <span className="hl-word hl-gold">Sessions</span>
          </h2>
          <p>
            Join upcoming live referencing clinics and workshops, or stream previous session recordings on demand.
          </p>
        </Reveal>

        {/* Quick Jump Navigation */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
          <RippleButton
            as="a"
            href="#upcoming-sessions-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('upcoming-sessions-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-ghost"
            style={{ borderRadius: 100, minWidth: 190, justifyContent: 'center' }}
            rippleColor="var(--em)"
          >
            <Icon name="calendar" />
            Upcoming Sessions {hasLiveUpcomingSessions ? `(${upcomingSessions.length})` : ''}
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
            Previous Recorded Sessions ({previousSessions.length})
          </RippleButton>
        </div>

        {/* =========================================================================
            SECTION 1 [FIRST]: UPCOMING SESSIONS
            ========================================================================= */}
        <div id="upcoming-sessions-section" style={{ scrollMarginTop: 90 }}>
          <Reveal className="sh" style={{ marginBottom: 24, textAlign: 'left' }}>
            <h3 style={{ fontSize: 24, marginBottom: 6, color: 'var(--cream)', fontWeight: 600 }}>
              Upcoming <span className="hl-word hl-gold">Sessions</span>
            </h3>
            <p style={{ margin: 0, fontSize: 15 }}>
              Reserve your spot in upcoming live clinics, assessment workshops, and compliance briefings.
            </p>
          </Reveal>

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
                return (
                  <Reveal key={s.id || s.title} delay={idx * 0.05}>
                    <div
                      className={`glass panel c-${s.cat}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(60px, 76px) 1fr auto',
                        gap: 20,
                        alignItems: 'center',
                        padding: '20px 24px',
                        textAlign: 'left',
                      }}
                    >
                      <div className="datebadge" style={{ width: 66, height: 70 }}>
                        <b style={{ fontSize: 24 }}>{s.d}</b>
                        <span style={{ fontSize: 12 }}>{s.mon}</span>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span className="typetag">{s.type}</span>
                          <span style={{ fontSize: 13, color: 'var(--sub)' }}>{s.wd} · {s.time}</span>
                        </div>
                        <h4 style={{ fontSize: 17.5, margin: '0 0 4px', color: 'var(--cream)', fontWeight: 600 }}>
                          {s.title}
                        </h4>
                      </div>

                      <div>
                        <SpecularButton
                          as="button"
                          type="button"
                          onClick={() => handleBook(s)}
                          className={isConfirmed ? 'btn btn-em btn-sm' : 'btn btn-gold btn-sm'}
                          radius={10}
                        >
                          <Icon name={isConfirmed ? 'check' : 'calendar'} />
                          {isConfirmed ? 'Reserved' : 'Reserve Spot'}
                        </SpecularButton>
                      </div>
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
              Previous Recorded <span className="hl-word hl-gold">Sessions</span>
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
                          className="btn btn-gold btn-sm"
                          radius={10}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Icon name="play" /> Watch Recording
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

        {/* RSVP Modal */}
        {rsvpSession && (
          <div
            className="backdrop show"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) setRsvpSession(null); }}
          >
            <div className="modal" style={{ width: 480 }}>
              <h3 style={{ fontSize: 20, marginBottom: 6, color: 'var(--cream)', textAlign: 'left' }}>
                Reserve Spot: {rsvpSession.title}
              </h3>
              <p style={{ color: 'var(--sub)', fontSize: 14, marginBottom: 20, textAlign: 'left' }}>
                {rsvpSession.wd} · {rsvpSession.d} {rsvpSession.mon} · {rsvpSession.time}
              </p>
              <form onSubmit={submitRsvp}>
                <div className="sbox" style={{ marginBottom: 16 }}>
                  <Icon name="lock" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your student email..."
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setRsvpSession(null)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <SpecularButton type="submit" className="btn btn-gold" radius={10}>
                    Confirm Reservation
                  </SpecularButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
