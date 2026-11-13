import { useState, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import GradientText from '../components/ui/GradientText';
import { useWpData } from '../context/WpContext';

const FALLBACK_RECORDINGS = [
  {
    id: 'rec-1',
    title: 'Referencing Clinic: Mastering In-Text Citations & Quotations',
    date: '19 Sep 2026',
    duration: '52 mins',
    facilitator: 'Dr. Evelyn Ward',
    category: 'Referencing',
    desc: 'Deep dive into direct quotations versus paraphrasing, block quotes, and multi-author citation rules under APA 7th.',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
  },
  {
    id: 'rec-2',
    title: 'ASQA Compliance Briefing: Evidence Gathering & Competency',
    date: '12 Sep 2026',
    duration: '74 mins',
    facilitator: 'Rachel Green',
    category: 'VET Compliance',
    desc: 'Understanding rules of evidence, authenticity, and student intervention thresholds for accredited qualifications.',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
  },
  {
    id: 'rec-3',
    title: 'Research Skills Masterclass: Evaluating Peer-Reviewed Sources',
    date: '05 Sep 2026',
    duration: '48 mins',
    facilitator: 'Marcus Tan',
    category: 'Research Skills',
    desc: 'How to use Google Scholar, VOCEDplus, and Boolean operators to locate high-impact academic journal papers.',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
  },
];

export default function RecordingsPage({ onNotify }) {
  const { previousSessions, wpVideos } = useWpData();
  const [activeRec, setActiveRec] = useState(null);
  const [search, setSearch] = useState('');

  const allRecordings = useMemo(() => {
    // Live WP previous sessions with video recordings (e.g. Academic Misconduct Policy)
    const liveItems = (previousSessions || []).map((s) => ({
      id: `wp-prev-${s.id}`,
      title: s.title,
      date: `${s.d} ${s.mon} ${s.rawDate ? s.rawDate.split('-')[0] : '2026'}`,
      duration: '45 mins',
      facilitator: s.facilitator || 'Discovery Library Academic Lead',
      category: s.type || 'Compliance Briefing',
      desc: s.desc || '',
      url: s.video_url || '',
      isWp: !!s.isWp,
    }));

    // Live data Priority 1: If live WordPress session recordings exist, return ONLY live items
    if (liveItems && liveItems.length > 0) {
      return liveItems;
    }

    // Fallback data: Shown strictly when REST endpoint is unreachable or empty
    return FALLBACK_RECORDINGS;
  }, [previousSessions]);

  const filtered = useMemo(() => {
    return allRecordings.filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    });
  }, [allRecordings, search]);

  const handlePlay = (rec) => {
    if (!rec?.url) {
      if (onNotify) onNotify('Recording video is not available for this session yet.');
      return;
    }
    setActiveRec(rec);
    if (onNotify) onNotify(`Playing recording: ${rec.title}`);
  };

  return (
    <div className="page page-recordings" style={{ paddingTop: 40, paddingBottom: 100 }}>
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

        <Reveal className="sh">
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Session Recordings</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Archive
            </GradientText>
          </h2>
          <p>
            Catch up on previous live referencing clinics, compliance briefings, and academic mentoring workshops anytime.
          </p>
        </Reveal>

        {/* Video Player Modal */}
        {activeRec && (
          <div
            className="backdrop show"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) setActiveRec(null); }}
          >
            <div className="modal" style={{ width: 760, maxWidth: '95vw', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span className="typetag" style={{ marginBottom: 4 }}>{activeRec.category}</span>
                  <h3 style={{ fontSize: 18, color: 'var(--cream)', margin: 0 }}>
                    {activeRec.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRec(null)}
                  style={{ color: 'var(--sub)', padding: '4px 8px', border: '1px solid var(--line)', borderRadius: 6 }}
                >
                  Close
                </button>
              </div>

              <video
                src={activeRec.url}
                controls
                autoPlay
                style={{ width: '100%', borderRadius: 12, maxHeight: '60vh', background: '#000' }}
              />

              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', color: 'var(--sub)', fontSize: 13.5 }}>
                <span>Facilitated by {activeRec.facilitator}</span>
                <span>Broadcast date: {activeRec.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <Reveal className="glass panel" style={{ marginBottom: 32, padding: '16px 20px' }}>
          <div className="sbox" style={{ margin: 0 }}>
            <Icon name="search" />
            <input
              type="text"
              placeholder="Search past recordings by topic or presenter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Reveal>

        {/* Grid of Recordings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map((rec, i) => (
            <Reveal key={rec.id + i} delay={i * 0.05}>
              <div
                className="glass panel"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textAlign: 'left',
                  border: rec.isWp ? '1px solid rgba(25, 214, 138, 0.4)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className="typetag">{rec.category}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{rec.duration}</span>
                </div>

                <h3 style={{ fontSize: 17, marginBottom: 8, color: 'var(--cream)', lineHeight: 1.3 }}>
                  {rec.title}
                </h3>

                <p style={{ fontSize: 13.5, color: 'var(--sub)', flexGrow: 1, marginBottom: 18, lineHeight: 1.5 }}>
                  {rec.desc}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--sub)' }}>{rec.date}</span>
                  {rec.url && (
                    <SpecularButton
                      as="button"
                      type="button"
                      onClick={() => handlePlay(rec)}
                      className="btn btn-gold btn-sm"
                      radius={10}
                    >
                      <Icon name="play" /> Watch Recording
                    </SpecularButton>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
