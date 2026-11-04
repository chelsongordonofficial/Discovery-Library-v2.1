import { useState, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import { WORD_LESSONS, SEARCH_VIDEOS } from '../data';
import { useWpData } from '../context/WpContext';

const VIDEO_CATEGORIES = [
  { id: 'all', label: 'All Videos' },
  { id: 'ai', label: 'AI & Integrity' },
  { id: 'word', label: 'Microsoft Word' },
  { id: 'vet', label: 'VET Standards' },
];

export default function VideosPage({ onNotify }) {
  const { wpVideos } = useWpData();
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Combine live WP CPT posts with fallback training videos
  const allVideos = useMemo(() => {
    const liveItems = (wpVideos || []).map((v, idx) => {
      let cat = 'ai';
      const low = (v.title + ' ' + (v.desc || '')).toLowerCase();
      if (low.includes('word')) cat = 'word';
      else if (low.includes('vet') || low.includes('standard') || low.includes('policy')) cat = 'vet';

      return {
        id: `wp-${v.id || idx}`,
        title: v.title,
        desc: v.desc || 'Comprehensive instructional training video for VET students and staff.',
        cat,
        duration: '12:00',
        url: v.video_url || 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/training/Effective%20Prompting%20%20Tips%20and%20techniques.mp4',
        quiz_link: v.quiz_link || 'https://forms.gle/EfYLeaWkr51kSdYc7',
        isWp: true,
      };
    });

    const fallbackSearchItems = SEARCH_VIDEOS.map(([title, desc], index) => {
      let cat = 'vet';
      if (title.toLowerCase().includes('ai')) cat = 'ai';
      return {
        id: `vid-${index}`,
        title,
        desc,
        cat,
        duration: `${10 + (index % 5)}:00`,
        url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
        quiz_link: 'https://forms.gle/EfYLeaWkr51kSdYc7',
        isWp: false,
      };
    });

    const wordSeriesItems = WORD_LESSONS.map((title, i) => ({
      id: `word-${i}`,
      title: `MS Word: ${title}`,
      desc: `Hands-on tutorial on ${title.toLowerCase()} for vocational reports and assessment portfolios.`,
      cat: 'word',
      duration: `0${5 + i}:30`,
      url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
      quiz_link: null,
      isWp: false,
    }));

    return [...liveItems, ...fallbackSearchItems, ...wordSeriesItems];
  }, [wpVideos]);

  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      const matchCat = selectedCat === 'all' || v.cat === selectedCat;
      const matchSearch =
        !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allVideos, selectedCat, search]);

  const handlePlay = (video) => {
    setActiveVideo(video);
    if (onNotify) onNotify(`Opening "${video.title}"`);
  };

  return (
    <div className="page page-videos" style={{ paddingTop: 36, paddingBottom: 100 }}>
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
            Training <span className="hl-word hl-gold">Videos</span>
          </h2>
          <p>
            Watch step-by-step masterclasses on AI prompting, Microsoft Word, and vocational training standards.
          </p>
        </Reveal>

        {/* Clean Search and Category Tabs in a Single Horizontal Row */}
        <Reveal className="glass panel" style={{ marginBottom: 36, padding: '16px 20px' }}>
          <div className="filter-bar">
            <div className="sbox">
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search training video titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              {VIDEO_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`filter-tab${selectedCat === c.id ? ' active' : ''}`}
                  onClick={() => setSelectedCat(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Video Player Modal */}
        {activeVideo && (
          <div
            className="backdrop show"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) setActiveVideo(null); }}
          >
            <div className="modal" style={{ width: 780, maxWidth: '95vw', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, color: 'var(--cream)', margin: 0, textAlign: 'left' }}>
                  {activeVideo.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  style={{ color: 'var(--sub)', padding: '4px 10px', border: '1px solid var(--line)', borderRadius: 6 }}
                >
                  Close
                </button>
              </div>

              <video
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', borderRadius: 12, background: '#000', maxHeight: '55vh' }}
              />

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <p style={{ color: 'var(--sub)', fontSize: 14, margin: 0, textAlign: 'left', maxWidth: '70%' }}>
                  {activeVideo.desc}
                </p>
                {activeVideo.quiz_link && (
                  <SpecularButton
                    as="a"
                    href={activeVideo.quiz_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-sm"
                    radius={10}
                  >
                    Take Quiz
                  </SpecularButton>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
          {filteredVideos.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.04}>
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
                {/* Video Thumbnail Container with Poster & Play Overlay */}
                <div
                  onClick={() => handlePlay(v)}
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
                  title={`Play: ${v.title}`}
                >
                  {/* Subtle video preview element if available */}
                  <video
                    src={v.url + '#t=0.5'}
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
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <Icon name="playSimple" style={{ width: 18, height: 18 }} />
                  </div>

                  {/* Duration Badge */}
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
                    {v.duration}
                  </span>
                </div>

                {/* Video Title */}
                <h3
                  onClick={() => handlePlay(v)}
                  style={{
                    fontSize: 16.5,
                    lineHeight: 1.35,
                    marginBottom: 14,
                    color: 'var(--cream)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {v.title}
                </h3>

                {/* Card Action Buttons (Watch Video & Take Quiz) */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <SpecularButton
                    as="button"
                    type="button"
                    onClick={() => handlePlay(v)}
                    className="btn btn-gold btn-sm"
                    radius={10}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Icon name="play" /> Watch Video
                  </SpecularButton>

                  {v.quiz_link && (
                    <RippleButton
                      as="a"
                      href={v.quiz_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      rippleColor="var(--gold)"
                      title="Test your comprehension"
                    >
                      Take Quiz
                    </RippleButton>
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
