import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import RippleButton from '../ui/RippleButton';
import SpecularButton from '../ui/SpecularButton';
import Icon from '../ui/Icon';
import { SITE_URLS } from '../../data';
import { useWpData } from '../../context/WpContext';

function getSessionTypeIcon(type) {
  const norm = (type || '').toLowerCase();
  if (norm.includes('live')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="typetag-ico" aria-hidden="true">
        <path d="M4.9 19.1A10 10 0 0 1 2 12a10 10 0 0 1 2.9-7.1" />
        <path d="M7.8 16.2A6 6 0 0 1 6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M16.2 7.8A6 6 0 0 1 18 12c0 1.7-.7 3.2-1.8 4.2" />
        <path d="M19.1 4.9A10 10 0 0 1 22 12a10 10 0 0 1-2.9 7.1" />
      </svg>
    );
  }
  if (norm.includes('workshop')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="typetag-ico" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="typetag-ico" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <polygon points="10 7 15 10 10 13 10 7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ComingUp() {
  const { isInitialLoading, hasLiveUpcomingSessions, wpUpcomingSessions } = useWpData();

  return (
    <section className="section" id="upcoming-section">
      <div className="wrap">
        <Reveal className="sh">
          <h2>
            Coming <span className="hl-word hl-gold">up</span>
          </h2>
          <p>Reserve your spot and set a reminder so you don’t miss a session.</p>
        </Reveal>

        {isInitialLoading ? (
          /* Subtle skeleton while initial REST response settles */
          <div className="glass upnext" style={{ opacity: 0.6 }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="uprow" style={{ minHeight: 76, alignItems: 'center' }}>
                <div className="datebadge" style={{ animation: 'pulse 1.6s infinite ease-in-out' }}>
                  <b style={{ opacity: 0.3 }}>--</b>
                  <span style={{ opacity: 0.3 }}>---</span>
                </div>
                <div className="uprow-info" style={{ textAlign: 'left', justifySelf: 'start', width: '100%' }}>
                  <div style={{ height: 16, width: '60%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 12, width: '35%', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : hasLiveUpcomingSessions ? (
          /* Live upcoming sessions from WordPress */
          <>
            <Reveal className="glass upnext">
              {wpUpcomingSessions.slice(0, 3).map((s, i) => {
                const tzMatch = (s.rawTitle || s.title || '').match(/\{(AEDT|AEST)\}/i);
                const detectedTz = tzMatch ? tzMatch[1].toUpperCase() : (s.timezone || null);
                const displayTitle = (s.title || '')
                  .replace(/\s*\{(AEDT|AEST)\}\s*/gi, ' ')
                  .replace(/\s{2,}/g, ' ')
                  .trim();

                let displayTime = s.time || '';
                if (detectedTz) {
                  if (/\b(AEST|AEDT)\b/i.test(displayTime)) {
                    displayTime = displayTime.replace(/\b(AEST|AEDT)\b/gi, detectedTz);
                  } else {
                    displayTime = `${displayTime} ${detectedTz}`;
                  }
                }

                return (
                  <Reveal key={s.id || s.title} className={`uprow c-${s.cat}`} delay={i * 0.1}>
                    <div className="datebadge"><b>{s.d}</b><span>{s.mon}</span></div>
                    <div className="uprow-info" style={{ textAlign: 'left', justifySelf: 'start' }}>
                      <h3 style={{ textAlign: 'left' }}>{displayTitle}</h3>
                      <div className="m" style={{ textAlign: 'left' }}>{s.wd} · {displayTime}</div>
                    </div>
                    <span className="typetag">
                      {getSessionTypeIcon(s.type)}
                      <span>{s.type}</span>
                    </span>
                  </Reveal>
                );
              })}
            </Reveal>
            <Reveal style={{ marginTop: 26 }}>
              <RippleButton as={Link} to={SITE_URLS.sessions} className="btn btn-ghost" rippleColor="var(--em)">
                See all sessions
              </RippleButton>
            </Reveal>
          </>
        ) : (
          /* Coming Soon state when live data confirms no upcoming sessions exist */
          <Reveal className="glass panel" delay={0.1}>
            <div style={{ padding: '36px 24px', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
              <div style={{
                width: 60,
                height: 60,
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
              <div style={{ marginBottom: 12 }}>
                <span className="chip" style={{ display: 'inline-flex' }}>
                  <span className="live" style={{ background: 'var(--gold)' }} />
                  Coming Soon
                </span>
              </div>
              <h3 style={{ fontSize: 24, marginBottom: 10, color: 'var(--cream)' }}>
                New Live Sessions Schedule Coming Soon
              </h3>
              <p style={{ color: 'var(--sub)', fontSize: 15.5, lineHeight: 1.6, marginBottom: 24 }}>
                We are currently finalizing dates for upcoming live referencing clinics and academic integrity workshops. In the meantime, explore our library of recorded sessions or book a 1-on-1 consultation.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <SpecularButton
                  as={Link}
                  to={SITE_URLS.recordings}
                  className="btn btn-gold"
                  radius={12}
                  lineColor="#ffffff"
                  baseColor="#ffd860"
                  intensity={1.2}
                >
                  <Icon name="record" />
                  View Previous Session Recordings
                </SpecularButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default ComingUp;