import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import ResCard from '../components/sections/ResCard';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import { SITE_URLS } from '../data/urls';

const RESOURCE_PARENT_CARDS = [
  {
    to: SITE_URLS.videos,
    cls: 'c-em',
    icon: 'play',
    t: 'Training Videos',
    d: 'Curated video lessons on VET compliance, technology, and assessor standards.',
  },
  {
    to: SITE_URLS.links,
    cls: 'c-gold',
    icon: 'link',
    t: 'Useful Links & Videos',
    d: 'Directory of academic search engines, research databases, and style manuals.',
  },
  {
    to: SITE_URLS.sessions,
    cls: 'c-amber',
    icon: 'calendar',
    t: 'Upcoming Sessions',
    d: 'Live referencing clinics, numeracy workshops, and ASQA webinars.',
  },
  {
    to: SITE_URLS.recordings,
    cls: 'c-mint',
    icon: 'record',
    t: 'Session Recordings',
    d: 'Catch up on past live clinics, workshops, and compliance briefings anytime.',
  },
];

const HUB_HIGHLIGHTS = [
  {
    title: 'Vocational Standards & Integrity',
    desc: 'Align your assessments and training delivery with current ASQA standards, TAE compliance requirements, and student academic integrity protocols.',
    to: SITE_URLS.videos,
    btnLabel: 'Watch Training Videos',
    icon: 'listCheck',
    colorCls: 'c-em',
  },
  {
    title: 'Authoritative Registers & Citations',
    desc: 'Access verified national registers like training.gov.au, USI portals, VOCEDplus international databases, and APA 7th style guides.',
    to: SITE_URLS.links,
    btnLabel: 'Browse Useful Links',
    icon: 'link',
    colorCls: 'c-gold',
  },
  {
    title: 'Interactive Workshops & Live Q&A',
    desc: 'Participate in scheduled online workshops with academic specialists, ask questions in real-time, or stream broadcast recordings on demand.',
    to: SITE_URLS.sessions,
    btnLabel: 'View Workshop Schedule',
    icon: 'calendar',
    colorCls: 'c-amber',
  },
];

export default function ResourcesPage() {
  return (
    <div className="page page-resources" style={{ paddingTop: 36, paddingBottom: 100 }}>
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
            Library <span className="hl-word hl-em">Resources</span>
          </h2>
          <p>
            Explore training videos, upcoming workshops, session recordings, and research databases.
          </p>
        </Reveal>

        {/* Parent Resource Cards Navigation Section (4 Cards) */}
        <div className="cards4" style={{ marginBottom: 48 }}>
          {RESOURCE_PARENT_CARDS.map((card, idx) => (
            <ResCard key={card.t} card={card} index={idx} />
          ))}
        </div>

        {/* Dedicated Learning Pillars Hub */}
        <div style={{ marginTop: 24 }}>
          <Reveal className="sh" style={{ marginBottom: 28, textAlign: 'left' }}>
            <h3 style={{ fontSize: 24, marginBottom: 8, color: 'var(--cream)', fontWeight: 600 }}>
              Discovery Library <span className="hl-word hl-gold">Pillars</span>
            </h3>
            <p style={{ margin: 0, fontSize: 15 }}>
              Comprehensive digital support tailored for vocational students, trainers, and educational assessors.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 20 }}>
            {HUB_HIGHLIGHTS.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 0.06}>
                <div
                  className={`glass panel ${item.colorCls}`}
                  style={{
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    textAlign: 'left',
                    borderRadius: 18,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name={item.icon} style={{ width: 18, height: 18 }} />
                    </div>
                    <h4 style={{ fontSize: 17.5, color: 'var(--cream)', margin: 0, fontWeight: 600 }}>
                      {item.title}
                    </h4>
                  </div>

                  <p style={{ fontSize: 14, color: 'var(--sub)', flexGrow: 1, marginBottom: 20, lineHeight: 1.55 }}>
                    {item.desc}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <SpecularButton
                      as={Link}
                      to={item.to}
                      className="btn btn-ghost btn-sm"
                      radius={10}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {item.btnLabel} <Icon name="arrow" style={{ width: 14, height: 14 }} />
                    </SpecularButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
