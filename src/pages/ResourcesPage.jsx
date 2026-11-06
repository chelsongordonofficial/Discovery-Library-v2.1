import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import ResCard from '../components/sections/ResCard';
import RippleButton from '../components/ui/RippleButton';
import GradientText from '../components/ui/GradientText';
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
    <div className="page page-resources" style={{ paddingTop: 36, paddingBottom: 0 }}>
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
        <Reveal className="sh" style={{marginLeft: 0}}>
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Library</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Resources
            </GradientText>
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

        
      </div>
    </div>
  );
}
