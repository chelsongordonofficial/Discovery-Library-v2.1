import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Icon from '../ui/Icon';
import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import SpecularButton from '../ui/SpecularButton';
import RippleButton from '../ui/RippleButton';
import { WORD_LESSONS_DATA, SITE_URLS } from '../../data';
import { useWpData } from '../../context/WpContext';

const WORD_PREFIX_REGEX = /^microsoft\s+word\s*[–—-]\s*(.+)$/i;

const LESSON_ORDER_HINTS = [
  'opening & quitting',
  'some commands',
  'how to create a document',
  'document formatting',
  'page formatting',
  'paragraph formatting',
  'word formatting styles',
  'insert and format tables',
  'insert and modify charts',
  'hyperlinks',
  'tracking changes',
];

function getLessonSortRank(topicTitle) {
  const lower = (topicTitle || '').toLowerCase();
  const idx = LESSON_ORDER_HINTS.findIndex((hint) => lower.includes(hint));
  return idx === -1 ? LESSON_ORDER_HINTS.length : idx;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function WordSeries() {
  const { wpVideos } = useWpData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerContainerRef = useRef(null);
  const videoRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const wasPlayingBeforeScrollRef = useRef(false);
  const pendingAutoPlayRef = useRef(false);
  const controlsTimeoutRef = useRef(null);

  const lessons = useMemo(() => {
    const cptWordLessons = (wpVideos || [])
      .filter((v) => v && v.title && WORD_PREFIX_REGEX.test(v.title.trim()) && v.video_url)
      .map((v) => {
        const match = v.title.trim().match(WORD_PREFIX_REGEX);
        const topicName = match ? match[1].trim() : v.title.trim();
        return {
          id: v.id,
          title: topicName,
          fullTitle: v.title.trim(),
          url: v.video_url,
          isWp: true,
        };
      })
      .sort((a, b) => getLessonSortRank(a.title) - getLessonSortRank(b.title));

    if (cptWordLessons.length > 0) {
      return cptWordLessons;
    }

    return WORD_LESSONS_DATA;
  }, [wpVideos]);

  const safeActiveIndex = activeIndex < lessons.length ? activeIndex : 0;
  const currentLesson = lessons[safeActiveIndex] || lessons[0];

  // Auto-hide controls during playback
  const triggerControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2600);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      triggerControls();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, triggerControls]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Viewport scroll pause & resume
  useEffect(() => {
    const el = playerContainerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            // Scrolled out of viewport
            if (!video.paused && !video.ended) {
              wasPlayingBeforeScrollRef.current = true;
              video.pause();
            }
          } else {
            // Scrolled back into viewport
            if (wasPlayingBeforeScrollRef.current) {
              wasPlayingBeforeScrollRef.current = false;
              video.play().catch(() => {});
            }
          }
        });
      },
      { threshold: [0, 0.2, 0.6, 1.0] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Update buffered progress
  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    try {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBufferedPercent(Math.min(100, (bufferedEnd / video.duration) * 100));
      }
    } catch {
      // Ignore buffer calc errors
    }
  };

  // Video time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (!duration && video.duration) {
      setDuration(video.duration);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isEnlarged) {
      setIsEnlarged(true);
    }

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      wasPlayingBeforeScrollRef.current = false;
    } else {
      video.pause();
      wasPlayingBeforeScrollRef.current = false;
    }
  };

  // Reload & auto-play when switching between distinct CPT video URLs, keeping row visible in scrollable list
  useEffect(() => {
    const listEl = listRef.current;
    const itemEl = itemRefs.current[safeActiveIndex];
    if (pendingAutoPlayRef.current && listEl && itemEl) {
      const itemTop = itemEl.offsetTop;
      const itemBottom = itemTop + itemEl.offsetHeight;
      const viewTop = listEl.scrollTop;
      const viewBottom = viewTop + listEl.clientHeight;
      if (itemTop < viewTop) {
        listEl.scrollTo({ top: itemTop, behavior: 'smooth' });
      } else if (itemBottom > viewBottom) {
        listEl.scrollTo({ top: itemBottom - listEl.clientHeight, behavior: 'smooth' });
      }
    }

    const video = videoRef.current;
    if (!video || !pendingAutoPlayRef.current) return;
    pendingAutoPlayRef.current = false;
    video.load();
    video.currentTime = 0;
    video.play().catch(() => {});
    wasPlayingBeforeScrollRef.current = false;
  }, [currentLesson?.url, safeActiveIndex]);

  // Choose a specific lesson
  const selectLesson = (index) => {
    setIsEnlarged(true);
    if (index === safeActiveIndex) {
      togglePlay();
      return;
    }
    pendingAutoPlayRef.current = true;
    setActiveIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setBufferedPercent(0);
  };

  // Seek on track click
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * duration;
    setCurrentTime(video.currentTime);
  };

  // Skip time (+/- 10s)
  const skipTime = (delta) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + delta));
  };

  // Toggle Mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Volume change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    video.muted = val === 0;
    setIsMuted(val === 0);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="section" id="word-series-section">
      <div className={`wrap split${isEnlarged ? ' split-expanded' : ''}`}>
        <Reveal>
          <h2>
            Learn <span className="hl-word hl-em">Microsoft Word</span> in 11 short lessons
          </h2>
          <p className="lead">
            From opening the program to tracking changes and comments. Work through the series in order, or jump to the lesson you need.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
            <SpecularButton
              as={Link}
              to={SITE_URLS.videos}
              className="btn btn-em btn-lg"
              radius={14}
              lineColor="#ffffff"
              baseColor="#19D68A"
              intensity={1.25}
            >
              Open the series
            </SpecularButton>
            {isEnlarged && (
              <RippleButton
                as="button"
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEnlarged(false)}
                title="Reset card size"
                rippleColor="var(--em)"
              >
                Compact view
              </RippleButton>
            )}
          </div>
        </Reveal>

        <Reveal className={`glass panel${isEnlarged ? ' is-enlarged' : ''}`} delay={0.12}>
          <div
            ref={playerContainerRef}
            className={`player${isEnlarged ? ' is-enlarged' : ''}${isPlaying ? ' is-playing' : ''}`}
            onMouseMove={triggerControls}
            onTouchStart={triggerControls}
            tabIndex={0}
            role="region"
            aria-label="Microsoft Word Training Video Player"
          >
            {/* Native Video Element */}
            <video
              ref={videoRef}
              src={currentLesson.url}
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onProgress={handleProgress}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                // Autoplay next lesson if available
                if (safeActiveIndex < lessons.length - 1) {
                  selectLesson(safeActiveIndex + 1);
                }
              }}
              onClick={togglePlay}
              className="v-media"
            />

            {/* Poster / Play Overlay when not yet started playing */}
            {(!isPlaying && currentTime === 0) && (
              <div className="v-poster-overlay" onClick={togglePlay}>
                <button
                  type="button"
                  className="pl"
                  aria-label={`Play ${currentLesson.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                >
                  <Icon name="playSimple" />
                </button>
                <div className="v-poster-info">
                  <span className="v-tag">Lesson {safeActiveIndex + 1} of {lessons.length}</span>
                  <span className="cap">{currentLesson.title}</span>
                </div>
              </div>
            )}

            {/* Center Pause / Play button when active (both default & fullscreen mode) */}
            {(isPlaying || currentTime > 0) && (
              <button
                type="button"
                className={`v-center-btn${isPlaying ? ' is-pause' : ' is-play'}${showControls || !isPlaying ? ' show' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Resume video'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <Icon name={isPlaying ? 'pauseSimple' : 'playSimple'} />
              </button>
            )}

            {/* Custom Theme-Palette Video Controls */}
            <div className={`v-controls${showControls || !isPlaying ? ' show' : ''}`}>
              {/* Top Scrubber Track */}
              <div
                className="v-scrubber"
                onClick={handleSeek}
                role="slider"
                aria-label="Seek video"
                aria-valuemin={0}
                aria-valuemax={duration || 100}
                aria-valuenow={currentTime}
                tabIndex={0}
              >
                <div className="v-track-bg" />
                <div className="v-track-buffered" style={{ width: `${bufferedPercent}%` }} />
                <div className="v-track-played" style={{ width: `${progressPercent}%` }}>
                  <span className="v-scrubber-thumb" />
                </div>
              </div>

              {/* Bottom Control Bar Row */}
              <div className="v-control-row">
                {/* Left controls: Play/Pause, Skip, Time */}
                <div className="v-ctrl-group">
                  <button
                    type="button"
                    className="v-btn v-btn-play"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    <Icon name={isPlaying ? 'pauseSimple' : 'playSimple'} />
                  </button>

                  <button
                    type="button"
                    className="v-btn v-btn-small v-btn-skip"
                    onClick={() => skipTime(-10)}
                    aria-label="Rewind 10 seconds"
                    title="Rewind 10s"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M1 4v6h6" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    <span style={{ fontSize: 9.5, fontWeight: 700, marginLeft: 2 }}>10</span>
                  </button>

                  <button
                    type="button"
                    className="v-btn v-btn-small v-btn-skip"
                    onClick={() => skipTime(10)}
                    aria-label="Forward 10 seconds"
                    title="Forward 10s"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M23 4v6h-6" />
                      <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                    </svg>
                    <span style={{ fontSize: 9.5, fontWeight: 700, marginLeft: 2 }}>10</span>
                  </button>

                  <span className="v-time-display">
                    <b>{formatTime(currentTime)}</b>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </span>
                </div>

                {/* Center: Current lesson title badge */}
                <div className="v-title-badge">
                  <span className="v-dot" />
                  <span className="v-title-text">{currentLesson.title}</span>
                </div>

                {/* Right controls: Volume & Fullscreen */}
                <div className="v-ctrl-group">
                  <div className="v-volume-box">
                    <button
                      type="button"
                      className="v-btn"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : volume < 0.5 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="v-volume-slider"
                      aria-label="Volume slider"
                    />
                  </div>

                  <button
                    type="button"
                    className="v-btn"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clickable Scrollable Lessons List in <ol class="mini"> */}
          <ol ref={listRef} className="mini" role="list">
            {lessons.map((lesson, idx) => {
              const isCurrent = idx === safeActiveIndex;
              return (
                <li
                  key={lesson.id || lesson.title}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className={`mini-item${isCurrent ? ' active' : ''}${isCurrent && isPlaying ? ' playing' : ''}`}
                  onClick={() => selectLesson(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectLesson(idx);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isCurrent}
                  title={`Click to play: ${lesson.title}`}
                >
                  <span className="mini-title">{lesson.title}</span>
                  <span className="mini-status">
                    {isCurrent && isPlaying ? (
                      <span className="mini-badge-playing">
                        <span className="bar bar1" />
                        <span className="bar bar2" />
                        <span className="bar bar3" />
                        Playing
                      </span>
                    ) : isCurrent ? (
                      <span className="mini-badge-active">Selected</span>
                    ) : (
                      <span className="mini-play-hint">
                        <Icon name="play" />
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export default WordSeries;