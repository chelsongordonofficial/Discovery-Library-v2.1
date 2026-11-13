import { useState, useMemo, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import GradientText from '../components/ui/GradientText';
import MediaPlayer, { parseMediaSource } from '../components/ui/MediaPlayer';
import { useWpData } from '../context/WpContext';
import { SITE_URLS } from '../data/urls';

export default function UsefulLinksPage({ onNotify }) {
  const { usefulLinks, isLinksLoading, refetch } = useWpData();
  const [searchTerm, setSearchTerm] = useState('');
  const [playSignals, setPlaySignals] = useState({});

  // Ensure live CPT data is fetched if empty when opening the page
  useEffect(() => {
    if (!isLinksLoading && Array.isArray(usefulLinks) && usefulLinks.length === 0) {
      refetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredItems = useMemo(() => {
    const items = Array.isArray(usefulLinks) ? usefulLinks : [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const hay = [item.title, item.desc].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [usefulLinks, searchTerm]);

  const triggerCardPlay = (cardKey, title) => {
    setPlaySignals((prev) => ({
      ...prev,
      [cardKey]: (prev[cardKey] || 0) + 1,
    }));
    if (onNotify && title) {
      onNotify(`Playing: "${title}"`);
    }
  };

  return (
    <div className="page page-links" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Button */}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <RippleButton
            as={Link}
            to={SITE_URLS.resources}
            className="btn btn-ghost btn-sm"
            rippleColor="var(--em)"
          >
            <Icon name="arrowLeft" />
            Back to Resources
          </RippleButton>
        </div>

        {/* Section Header */}
        <Reveal className="sh">
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Useful</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Links & Videos
            </GradientText>
          </h2>
          <p>
            Authoritative registers, research databases, and instructional media from Discovery Library.
          </p>
        </Reveal>

        {/* Clean Search Bar (No Category Filters), aligned left with heading (~65% width) */}
        <div
          className="glass panel"
          style={{
            maxWidth: 780,
            width: '100%',
            margin: '0 0 32px 0',
            padding: '14px 20px',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
            <Icon name="search" style={{ width: 20, height: 20, color: 'var(--sub)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search useful links and videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search useful links and videos"
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
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  color: 'var(--sub)',
                  fontSize: 13,
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Live WordPress CPT Cards (~65% of section width), aligned left with heading */}
        <div style={{ display: 'grid', gap: 24, maxWidth: 780, width: '100%', margin: 0 }}>
          {isLinksLoading && filteredItems.length === 0 ? (
            <div className="glass panel" style={{ padding: 40, textAlign: 'left', color: 'var(--sub)' }}>
              Loading useful links and videos...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="glass panel" style={{ padding: 40, textAlign: 'left', color: 'var(--sub)' }}>
              {searchTerm ? (
                <>
                  No items match &ldquo;{searchTerm}&rdquo;.
                  <div style={{ marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      style={{
                        color: 'var(--cream)',
                        fontSize: 13.5,
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        background: 'rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                      }}
                    >
                      Clear Search
                    </button>
                  </div>
                </>
              ) : (
                'No useful links or videos are published yet.'
              )}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const cardKey = item.id || `${item.title}-${idx}`;
              const media = parseMediaSource(item.url);
              const isVideoMedia =
                media.type === 'youtube' || media.type === 'vimeo' || media.type === 'video';

              return (
                <div
                  key={cardKey}
                  className="glass panel"
                  onClick={isVideoMedia ? () => triggerCardPlay(cardKey, item.title) : undefined}
                  style={{
                    padding: '24px 26px',
                    borderRadius: 24,
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    cursor: isVideoMedia ? 'pointer' : 'default',
                  }}
                >
                  {item.title && (
                    <h3
                      style={{
                        fontSize: 21,
                        lineHeight: 1.35,
                        margin: 0,
                        color: 'var(--cream)',
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </h3>
                  )}

                  {item.desc && (
                    <p
                      style={{
                        fontSize: 14.5,
                        color: 'var(--sub)',
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  )}

                  {isVideoMedia && item.url && (
                    <div style={{ marginTop: 4 }}>
                      <MediaPlayer
                        url={item.url}
                        title={item.title}
                        showPosterInfo={false}
                        playSignal={playSignals[cardKey] || 0}
                        onPlayStart={() => {
                          if (onNotify && item.title) onNotify(`Playing: "${item.title}"`);
                        }}
                      />
                    </div>
                  )}

                  {media.type === 'link' && item.url && (
                    <div style={{ marginTop: 4, display: 'flex' }}>
                      <SpecularButton
                        as="a"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold"
                        radius={12}
                        style={{ padding: '12px 22px', justifyContent: 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNotify && item.title) onNotify(`Opening ${item.title}`);
                        }}
                      >
                        Open Link <Icon name="arrow" style={{ width: 16, height: 16 }} />
                      </SpecularButton>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
