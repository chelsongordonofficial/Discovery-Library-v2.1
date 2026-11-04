import Link from '../ui/Link';
import SpecularButton from '../ui/SpecularButton';
import RippleButton from '../ui/RippleButton';
import { nextSession as fallbackNextSession, SITE_URLS } from '../../data';
import { useWpData } from '../../context/WpContext';
import Icon from '../ui/Icon';

function Hero({ cueHidden }) {
  const { hasLiveUpcomingSessions, nextSession: liveNextSession, isInitialLoading } = useWpData();
  const ns = liveNextSession;
  const displayTitle = ns && ns.title ? ns.title.split(':')[0] : 'Upcoming Session';

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-text">
            <span className="chip">
              <span className="live" style={!hasLiveUpcomingSessions ? { background: 'var(--gold)' } : undefined} />
              {isInitialLoading ? (
                'Checking upcoming schedule...'
              ) : hasLiveUpcomingSessions && ns ? (
                `Next live session: ${displayTitle} · ${ns.wd} ${ns.d} ${ns.mon}`
              ) : (
                'Live sessions: New schedule coming soon'
              )}
            </span>
            <h1 className="mega">
              {['Study smarter', 'with everything', 'in one library.'].map((line, i) => (
                <span key={line} className="hl" style={{ '--i': i }}>
                  {line.split(' ').map((word, j) => (
                    <span key={j} className={`word word-${word.replace(/[.,]/g, '')}`}>
                      {word}{' '}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="hero-sub">
              Training videos, session recordings, live workshops and an APA 7th referencing guide, all in one place for VET students and trainers.
            </p>
            <div className="hero-cta">
              <SpecularButton
                as={Link}
                to={SITE_URLS.resources}
                className="btn btn-gold btn-lg"
                radius={14}
                lineColor="#ffffff"
                baseColor="#ffd860"
                intensity={1.2}
              >
                <Icon name="browse" />Browse resources
              </SpecularButton>
              <RippleButton
                as={Link}
                to={SITE_URLS.videos}
                className="btn btn-ghost btn-lg"
                rippleColor="var(--em)"
              >
                <Icon name="play" />Watch training videos
              </RippleButton>
            </div>
          </div>
          <div />
        </div>
      </div>
      <div className="cue" aria-hidden="true" style={cueHidden ? { display: 'none' } : undefined}>
        <span className="mouse" />Scroll
      </div>
    </section>
  );
}

export default Hero;