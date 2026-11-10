import { useState, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import GradientText from '../components/ui/GradientText';
import { WORD_LESSONS, SEARCH_VIDEOS } from '../data';
import { useWpData } from '../context/WpContext';

export default function VideosPage({ onNotify }) {
  const { wpVideos } = useWpData();
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Combine live WP CPT posts with fallback training videos
  const allVideos = useMemo(() => {
    const liveItems = (wpVideos || []).map((v, idx) => ({
      id: `wp-${v.id || idx}`,
      title: v.title,
      desc: v.desc || 'Comprehensive instructional training video for VET students and staff.',
      duration: '12:00',
      url: v.video_url || 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/training/Effective%20Prompting%20%20Tips%20and%20techniques.mp4',
      quiz_link: v.quiz_link || 'https://forms.gle/EfYLeaWkr51kSdYc7',
      isWp: true,
    }));

    const fallbackSearchItems = SEARCH_VIDEOS.map(([title, desc], index) => ({
      id: `vid-${index}`,
      title,
      desc,
      duration: `${10 + (index % 5)}:00`,
      url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
      quiz_link: 'https://forms.gle/EfYLeaWkr51kSdYc7',
      isWp: false,
    }));

    const wordSeriesItems = WORD_LESSONS.map((title, i) => ({
      id: `word-${i}`,
      title: `MS Word: ${title}`,
      desc: `Hands-on tutorial on ${title.toLowerCase()} for vocational reports and assessment portfolios.`,
      duration: `0${5 + i}:30`,
      url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
      quiz_link: null,
      isWp: false,
    }));

    // Live data Priority 1: If live WordPress training videos exist, return ONLY live items
    if (liveItems && liveItems.length > 0) {
      return liveItems;
    }

    // Fallback data: Shown strictly when REST endpoint is unreachable or empty
    return [...fallbackSearchItems, ...wordSeriesItems];
  }, [wpVideos]);

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return allVideos;
    const q = search.toLowerCase();
    return allVideos.filter(
      (v) => v.title.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q)
    );
  }, [allVideos, search]);

  const handlePlay = (video) => {
    setActiveVideo(video);
    if (onNotify) onNotify(`Opening "${video.title}"`);
  };

  return (
    <div className="page page-videos" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Button */}
        <div style={{ textAlign: 'left', marginBottom: 20, marginLeft: 90 }}>
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
        <Reveal className="sh" style={{marginLeft: 90}}>
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Training</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Videos
            </GradientText>
          </h2>
          <p>
            Watch step-by-step masterclasses on AI prompting, Microsoft Word, and vocational training standards.
          </p>
        </Reveal>

        {/* Clean Search Bar - No filter pills, matched to 960px card width */}
        <Reveal
          className="glass panel"
          style={{
            maxWidth: 960,
            margin: '0 auto 36px',
            padding: '14px 20px',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
            <Icon name="search" style={{ width: 20, height: 20, color: 'var(--sub)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search training video titles or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--cream)',
                fontSize: 15.5,
                fontFamily: 'inherit',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  color: 'var(--sub)',
                  fontSize: 13,
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                Clear
              </button>
            )}
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

        {/* Video Cards List - 1 Card Per Row with Scroll Image Reveal applied to the whole card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, maxWidth: 960, margin: '0 auto' }}>
          {filteredVideos.map((v, index) => (
            <VideoCardRow key={v.id} video={v} index={index} onPlay={handlePlay} />
          ))}

          {filteredVideos.length === 0 && (
            <div
              className="glass panel"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                borderRadius: 16,
              }}
            >
              <p style={{ color: 'var(--sub)', fontSize: 16 }}>
                No training videos found matching "{search}".
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 16 }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 1-Card-Per-Row Video Card with active motion.dev scroll reveal effect applied to the WHOLE card
 * Continuously transforms (clipPath curtain, scale, y parallax, opacity, inner video zoom) while scrolling
 */
function VideoCardRow({ video: v, index, onPlay }) {
  const containerRef = useRef(null);

  // motion.dev scroll reveal: tracks scroll progress as card moves from viewport bottom to center
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center 50%'],
  });

  // Dynamic whole-card curtain reveal:
  // 0% horizontal inset so card left/right padding and text are NEVER cut off
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(10% 0% 10% 0% round 24px)', 'inset(0% 0% 0% 0% round 20px)']
  );

  // Active scroll transforms on the whole card
  const scale = useTransform(scrollYProgress, [0, 1], [0.90, 1.0]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);

  // First card has 100% opacity on page load; subsequent cards smoothly bloom in
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    index === 0 ? [1.0, 1.0] : [0.35, 1.0]
  );

  // Subtle var(--mint) outline highlight when the card is active / in focus
  const borderColor = useTransform(
    scrollYProgress,
    [0.75, 1],
    index === 0
      ? ['rgba(140, 247, 197, 0.38)', 'rgba(140, 247, 197, 0.48)']
      : ['rgba(120, 240, 190, 0.16)', 'rgba(140, 247, 197, 0.42)']
  );

  const boxShadow = useTransform(
    scrollYProgress,
    [0.75, 1],
    [
      '0 4px 20px rgba(0, 0, 0, 0.25)',
      '0 16px 40px rgba(25, 214, 138, 0.12)',
    ]
  );

  // Layered parallax zoom on the video preview inside the thumbnail
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.14, 1.0]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <motion.div
        className="glass panel video-showcase-row"
        style={{
          clipPath,
          scale,
          y,
          opacity,
          borderColor,
          boxShadow,
          transformOrigin: 'center center',
        }}
      >
        {/* Video Thumbnail Container */}
        <div
          className="video-reveal-container"
          onClick={() => onPlay(v)}
          title={`Play: ${v.title}`}
        >
          {/* Video preview element with parallax scale */}
          <motion.video
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
              opacity: 0.65,
              filter: 'contrast(1.05) brightness(0.92)',
              scale: videoScale,
            }}
          />

          {/* Gradient vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(3,20,13,0.12) 0%, rgba(3,20,13,0.72) 100%)',
            }}
          />

          {/* Center Play Button Overlay */}
          <div
            className="play-icon-badge"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(255, 200, 58, 0.95)',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <Icon name="playSimple" style={{ width: 22, height: 22 }} />
          </div>

          {/* Duration Badge */}
          <span
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 2,
              background: 'rgba(3, 20, 13, 0.88)',
              color: 'var(--cream)',
              fontSize: 11.5,
              fontFamily: 'var(--f-mono)',
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {v.duration}
          </span>
        </div>

        {/* Video Details & Meta (No extra fluff, clean title, description & actions) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          <h3
            onClick={() => onPlay(v)}
            style={{
              fontSize: 20,
              lineHeight: 1.35,
              marginBottom: 10,
              color: 'var(--cream)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {v.title}
          </h3>

          <p
            style={{
              fontSize: 14.5,
              color: 'var(--sub)',
              lineHeight: 1.55,
              marginBottom: 20,
              flexGrow: 1,
            }}
          >
            {v.desc}
          </p>

          {/* Card Action Buttons (Watch Video with Specular Ghost & Take Quiz) */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <SpecularButton
              as="button"
              type="button"
              onClick={() => onPlay(v)}
              className="btn btn-ghost btn-sm"
              radius={10}
              style={{ minWidth: 150, justifyContent: 'center' }}
            >
              Watch Video <Icon name="arrow" style={{ width: 14, height: 14 }} />
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
      </motion.div>
    </div>
  );
}
