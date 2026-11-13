import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Icon from './Icon';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseMediaSource(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return { type: 'none', url: '' };
  const url = rawUrl.trim();

  // YouTube (youtu.be/ID, youtube.com/watch?v=ID, shorts/ID, embed/ID, live/ID)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i
  );
  if (ytMatch) {
    const ytId = ytMatch[1];
    return {
      type: 'youtube',
      id: ytId,
      url,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      thumbUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
    };
  }

  // Vimeo (vimeo.com/ID or player.vimeo.com/video/ID)
  const vimeoMatch = url.match(/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      id: vimeoId,
      url,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
    };
  }

  // Direct HTML5 video streams
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url)) {
    return { type: 'video', url };
  }

  return { type: 'link', url };
}

/**
 * Reusable Homepage Media Player (.player)
 * Replicates the WordSeries homepage media player controls & visual shell for direct videos
 * and embeds YouTube/Vimeo streams seamlessly inside the exact same .player container.
 */
export default function MediaPlayer({
  url,
  title = '',
  tag = '',
  showPosterInfo = true,
  playSignal = 0,
  onPlayStart,
}) {
  const media = useMemo(() => parseMediaSource(url), [url]);

  const [embedActive, setEmbedActive] = useState(false);
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
  const wasPlayingBeforeScrollRef = useRef(false);
  const controlsTimeoutRef = useRef(null);

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

  // Viewport scroll pause & resume for native video
  useEffect(() => {
    if (media.type !== 'video') return undefined;
    const el = playerContainerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            if (!video.paused && !video.ended) {
              wasPlayingBeforeScrollRef.current = true;
              video.pause();
            }
          } else if (wasPlayingBeforeScrollRef.current) {
            wasPlayingBeforeScrollRef.current = false;
            video.play().catch(() => {});
          }
        });
      },
      { threshold: [0, 0.2, 0.6, 1.0] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [media.type]);

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    try {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBufferedPercent(Math.min(100, (bufferedEnd / video.duration) * 100));
      }
    } catch {
      // Ignore buffer errors
    }
  };

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

  const onPlayStartRef = useRef(onPlayStart);
  onPlayStartRef.current = onPlayStart;

  const activatePlayback = useCallback(() => {
    if (media.type === 'youtube' || media.type === 'vimeo') {
      if (!embedActive) {
        setEmbedActive(true);
        if (onPlayStartRef.current) onPlayStartRef.current();
      }
      return;
    }

    if (media.type === 'video') {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused || video.ended) {
        video.play().catch(() => {});
        wasPlayingBeforeScrollRef.current = false;
        if (onPlayStartRef.current) onPlayStartRef.current();
      } else {
        video.pause();
        wasPlayingBeforeScrollRef.current = false;
      }
    }
  }, [media.type, embedActive]);

  const activatePlaybackRef = useRef(activatePlayback);
  activatePlaybackRef.current = activatePlayback;

  useEffect(() => {
    if (playSignal > 0) {
      activatePlaybackRef.current();
    }
  }, [playSignal]);

  const handleSeek = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * duration;
    setCurrentTime(video.currentTime);
  };

  const skipTime = (e, delta) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + delta));
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    video.muted = val === 0;
    setIsMuted(val === 0);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const el = playerContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const activeState = media.type === 'video' ? isPlaying : embedActive;

  // Embedded YouTube / Vimeo inside the homepage .player frame
  if (media.type === 'youtube' || media.type === 'vimeo') {
    return (
      <div
        ref={playerContainerRef}
        className={`player${embedActive ? ' is-enlarged is-playing' : ''}`}
        role="region"
        aria-label={title || 'Video Player'}
      >
        {embedActive ? (
          <iframe
            src={media.embedUrl}
            title={title || 'Video Player'}
            className="v-media"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div
            className="v-poster-overlay"
            onClick={(e) => {
              e.stopPropagation();
              activatePlayback();
            }}
          >
            {media.thumbUrl && (
              <img
                src={media.thumbUrl}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.38,
                  filter: 'contrast(1.05) brightness(0.82)',
                }}
              />
            )}
            <button
              type="button"
              className="pl"
              aria-label={`Play ${title || 'video'}`}
              onClick={(e) => {
                e.stopPropagation();
                activatePlayback();
              }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              <Icon name="playSimple" />
            </button>
            {showPosterInfo && (tag || title) && (
              <div className="v-poster-info" style={{ zIndex: 2 }}>
                {tag && <span className="v-tag">{tag}</span>}
                {title && <span className="cap">{title}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Native HTML5 video with full homepage custom player controls
  return (
    <div
      ref={playerContainerRef}
      className={`player${activeState ? ' is-enlarged is-playing' : ''}`}
      onMouseMove={triggerControls}
      onTouchStart={triggerControls}
      tabIndex={0}
      role="region"
      aria-label={title || 'Video Player'}
    >
      <video
        ref={videoRef}
        src={media.url}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={(e) => {
          e.stopPropagation();
          activatePlayback();
        }}
        className="v-media"
      />

      {!isPlaying && currentTime === 0 && (
        <div
          className="v-poster-overlay"
          onClick={(e) => {
            e.stopPropagation();
            activatePlayback();
          }}
        >
          <button
            type="button"
            className="pl"
            aria-label={`Play ${title || 'video'}`}
            onClick={(e) => {
              e.stopPropagation();
              activatePlayback();
            }}
          >
            <Icon name="playSimple" />
          </button>
          {showPosterInfo && (tag || title) && (
            <div className="v-poster-info">
              {tag && <span className="v-tag">{tag}</span>}
              {title && <span className="cap">{title}</span>}
            </div>
          )}
        </div>
      )}

      {(isPlaying || currentTime > 0) && (
        <button
          type="button"
          className={`v-center-btn${isPlaying ? ' is-pause' : ' is-play'}${showControls || !isPlaying ? ' show' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            activatePlayback();
          }}
          aria-label={isPlaying ? 'Pause video' : 'Resume video'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <Icon name={isPlaying ? 'pauseSimple' : 'playSimple'} />
        </button>
      )}

      <div
        className={`v-controls${showControls || !isPlaying ? ' show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="v-control-row">
          <div className="v-ctrl-group">
            <button
              type="button"
              className="v-btn v-btn-play"
              onClick={(e) => {
                e.stopPropagation();
                activatePlayback();
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <Icon name={isPlaying ? 'pauseSimple' : 'playSimple'} />
            </button>

            <button
              type="button"
              className="v-btn v-btn-small v-btn-skip"
              onClick={(e) => skipTime(e, -10)}
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
              onClick={(e) => skipTime(e, 10)}
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

          <div className="v-title-badge">
            <span className="v-dot" />
            <span className="v-title-text">{title}</span>
          </div>

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
  );
}
