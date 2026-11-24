import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Icon from '../ui/Icon';
import Link from '../ui/Link';
import {
  SEARCH_VIDEOS as FALLBACK_VIDEOS,
  WORD_LESSONS_DATA,
  RES_CARDS,
  QUICK,
  SITE_URLS,
} from '../../data';
import { REFERENCING_SECTIONS } from '../../data/referencingData';
import { FAQS as CONTACT_FAQS } from '../../pages/ContactPage';
import { LLND_PILLARS } from '../../pages/LlndPage';
import { useWpData } from '../../context/WpContext';
import { useRouter } from '../../context/RouterContext';

const MotionLink = motion.create(Link);

const WORD_PREFIX_REGEX = /^microsoft\s+word\s*[–—-]\s*(.+)$/i;

const SPA_PAGES = [
  {
    id: 'page-home',
    section: 'Home Page',
    title: 'Home — Discovery Library',
    keywords: 'home landing discovery library overview start here word lessons',
    to: SITE_URLS.home,
  },
  {
    id: 'page-resources',
    section: 'Resources Hub',
    title: 'Library Resources',
    keywords: 'resources hub study materials vet compliance',
    to: SITE_URLS.resources,
  },
  {
    id: 'page-videos',
    section: 'Training Videos',
    title: 'All Training Videos',
    keywords: 'training videos masterclasses word ai vet standards',
    to: SITE_URLS.videos,
  },
  {
    id: 'page-sessions',
    section: 'Sessions',
    title: 'Upcoming Live Sessions',
    keywords: 'upcoming sessions workshops live clinics schedule reserve spot calendar',
    to: SITE_URLS.sessions,
  },
  {
    id: 'page-recordings',
    section: 'Recorded Sessions',
    title: 'Previous Recorded Sessions',
    keywords: 'recorded sessions recordings past webinars archive watch recording',
    to: SITE_URLS.recordings,
  },
  {
    id: 'page-links',
    section: 'Useful Links & Videos',
    title: 'Useful Links & Videos Directory',
    keywords: 'useful links videos asqa webinar instructional media databases',
    to: SITE_URLS.links,
  },
  {
    id: 'page-referencing',
    section: 'APA Referencing',
    title: 'APA 7th Referencing Guide',
    keywords: 'referencing apa 7th citation bibliography plagiarism doi',
    to: SITE_URLS.referencing,
  },
  {
    id: 'page-newsletter',
    section: 'Newsletter',
    title: 'Monthly Newsletters',
    keywords: 'newsletter monthly updates download preview pdf 2026 2025',
    to: SITE_URLS.newsletter,
  },
  {
    id: 'page-contact',
    section: 'Contact & Consultation',
    title: 'Book a Consultation & Contact Us',
    keywords: 'contact consultation book enquiry help support librarian faq',
    to: SITE_URLS.contact,
  },
  {
    id: 'page-llnd',
    section: 'Learning Support',
    title: 'Learning & Language Support (LLND)',
    keywords: 'llnd portal language literacy numeracy digital skills grammar math',
    to: '/learning-support',
  },
];

function scoreItem(item, tokens, fullQuery) {
  const titleLower = (item.title || '').toLowerCase();
  const sectionLower = (item.section || '').toLowerCase();
  const bodyLower = (item.body || '').toLowerCase();
  const combined = `${titleLower} ${sectionLower} ${bodyLower}`;

  for (const tok of tokens) {
    if (!combined.includes(tok)) return 0;
  }

  let score = 10;
  if (titleLower === fullQuery) score += 120;
  else if (titleLower.startsWith(fullQuery)) score += 70;
  else if (titleLower.includes(fullQuery)) score += 45;

  if (sectionLower.includes(fullQuery)) score += 20;

  for (const tok of tokens) {
    if (titleLower.includes(tok)) score += 18;
    else if (sectionLower.includes(tok)) score += 8;
    else score += 2;
  }

  return score;
}

function SearchModal({ open, onClose }) {
  const {
    wpVideos,
    upcomingSessions,
    previousSessions,
    usefulLinks,
    newsletters,
    isLiveConnected,
  } = useWpData();
  const { navigate } = useRouter();
  const [q, setQ] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [tipPos, setTipPos] = useState({ top: 180, visible: false });
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        setQ('');
        setActiveIdx(0);
        inputRef.current?.focus();
      }, 30);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Build unified index across all React SPA pages + live WP CPT items displayed in the SPA
  const searchIndex = useMemo(() => {
    const items = [];

    // 1. All SPA pages
    SPA_PAGES.forEach((p) => {
      items.push({
        id: p.id,
        section: p.section,
        title: p.title,
        body: p.keywords,
        to: p.to,
      });
    });

    // 2. Resource Hub Cards
    RES_CARDS.forEach((card, i) => {
      items.push({
        id: `res-card-${i}`,
        section: 'Resources Hub',
        title: card.t,
        body: `${card.d || ''} library resources start here`,
        to: card.to,
      });
    });

    // 3. Training Videos + 11 Microsoft Word Lessons (Live CPT priority)
    const videoItems = wpVideos && wpVideos.length > 0
      ? wpVideos.map((v, i) => ({
          id: `wp-vid-${v.id || i}`,
          title: v.title || '',
          desc: v.desc || '',
        }))
      : !isLiveConnected
        ? [
            ...FALLBACK_VIDEOS.map(([t, d], i) => ({ id: `fb-vid-${i}`, title: t, desc: d })),
            ...WORD_LESSONS_DATA.map((l) => ({ id: `fb-word-${l.id}`, title: `Microsoft Word – ${l.title}`, desc: '' })),
          ]
        : [];

    videoItems.forEach((v) => {
      if (!v.title) return;
      const isWordLesson = WORD_PREFIX_REGEX.test(v.title.trim());
      items.push({
        id: v.id,
        section: isWordLesson ? 'Word Lessons · Videos' : 'Training Videos',
        title: v.title,
        body: `${v.desc || ''} ${isWordLesson ? 'microsoft word 11 short lessons' : 'training video'}`,
        to: `${SITE_URLS.videos}?q=${encodeURIComponent(v.title)}`,
      });
    });

    // 4. Upcoming Sessions
    (upcomingSessions || []).forEach((s, i) => {
      if (!s?.title) return;
      items.push({
        id: `up-sess-${s.id || i}`,
        section: 'Upcoming Sessions',
        title: s.title,
        body: [s.desc, s.mon, s.year, s.time, 'upcoming session live workshop'].filter(Boolean).join(' '),
        to: SITE_URLS.sessions,
      });
    });

    // 5. Previous Recorded Sessions
    (previousSessions || []).forEach((s, i) => {
      if (!s?.title) return;
      items.push({
        id: `rec-sess-${s.id || i}`,
        section: 'Recorded Sessions',
        title: s.title,
        body: [s.desc, s.mon, s.year, s.time, 'recorded session recording archive'].filter(Boolean).join(' '),
        to: `${SITE_URLS.recordings}?q=${encodeURIComponent(s.title)}`,
      });
    });

    // 6. Useful Links & Videos (Live CPT only)
    (usefulLinks || []).forEach((u, i) => {
      if (!u?.title) return;
      items.push({
        id: `useful-${u.id || i}`,
        section: 'Useful Links & Videos',
        title: u.title,
        body: `${u.desc || ''} useful links videos webinar resource`,
        to: `${SITE_URLS.links}?q=${encodeURIComponent(u.title)}`,
      });
    });

    // 7. Newsletters
    (newsletters || []).forEach((n, i) => {
      if (!n?.title) return;
      const issuePeriod = [n.month, n.year].filter(Boolean).join(' ');
      items.push({
        id: `news-${n.id || i}`,
        section: issuePeriod ? `Newsletter · ${issuePeriod}` : 'Newsletter',
        title: n.title,
        body: `${issuePeriod} newsletter pdf issue`,
        to: n.year ? `${SITE_URLS.newsletter}?year=${encodeURIComponent(n.year)}` : SITE_URLS.newsletter,
      });
    });

    // 8. APA 7th Referencing Guide (All Sections + Tabs + Quick Citations)
    REFERENCING_SECTIONS.forEach((sec) => {
      (sec.tabs || []).forEach((tab) => {
        const subText = [
          sec.title,
          tab.intro,
          ...(tab.paragraphs || []),
          ...(tab.generalRules || []),
          tab.callout?.title,
          tab.callout?.text,
          ...(tab.highlights || []).map((h) => `${h.title} ${h.desc}`),
          ...(tab.sections || []).map((s) => `${s.heading} ${s.desc || ''} ${(s.formats || []).join(' ')}`),
        ]
          .filter(Boolean)
          .join(' ');

        items.push({
          id: `ref-tab-${tab.id}`,
          section: `APA Referencing · ${sec.shortTitle || sec.title}`,
          title: tab.title,
          body: `${subText} ${tab.tabNum || ''} apa 7th citation reference`,
          to: `${SITE_URLS.referencing}?sec=${encodeURIComponent(sec.id)}&tab=${encodeURIComponent(tab.id)}`,
        });
      });
    });

    QUICK.forEach((qItem, i) => {
      items.push({
        id: `ref-quick-${i}`,
        section: 'APA Quick Format',
        title: qItem.k,
        body: `${qItem.k} ${qItem.ref} ${qItem.it} ${qItem.n} apa citation example`,
        to: `${SITE_URLS.referencing}?sec=${encodeURIComponent(qItem.sectionId)}&tab=${encodeURIComponent(qItem.tabId)}`,
      });
    });

    // 9. Contact FAQs
    CONTACT_FAQS.forEach((faq, idx) => {
      items.push({
        id: `faq-${idx}`,
        section: 'Contact & FAQs',
        title: faq.q,
        body: `${faq.a} frequently asked question contact help`,
        to: `${SITE_URLS.contact}?faq=${idx}`,
      });
    });

    // 10. LLND Support Pillars
    LLND_PILLARS.forEach((pillar, idx) => {
      items.push({
        id: `llnd-${idx}`,
        section: 'Learning Support',
        title: pillar.title,
        body: `${pillar.desc} ${(pillar.resources || []).join(' ')} llnd language literacy numeracy digital`,
        to: '/learning-support',
      });
    });

    return items;
  }, [wpVideos, upcomingSessions, previousSessions, usefulLinks, newsletters, isLiveConnected]);

  const results = useMemo(() => {
    const raw = q.trim().toLowerCase();
    if (!raw) {
      return searchIndex.slice(0, 10);
    }

    const tokens = raw.split(/\s+/).filter(Boolean);
    const ranked = [];

    for (const item of searchIndex) {
      const score = scoreItem(item, tokens, raw);
      if (score > 0) {
        ranked.push({ item, score });
      }
    }

    ranked.sort((a, b) => b.score - a.score);
    return ranked.slice(0, 20).map((r) => r.item);
  }, [q, searchIndex]);

  useEffect(() => {
    setActiveIdx(0);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [q]);

  const updateTipPosition = useCallback(() => {
    if (!open) return;
    const wrapperEl = wrapperRef.current;
    const listEl = listRef.current;
    const rowEl = rowRefs.current[activeIdx];
    if (!wrapperEl || !listEl || !rowEl) {
      setTipPos((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const wrapperRect = wrapperEl.getBoundingClientRect();
    const listRect = listEl.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();
    const rowCenterY = rowRect.top + rowRect.height / 2;
    const isRowInView = rowCenterY >= listRect.top + 4 && rowCenterY <= listRect.bottom - 4;
    const top = Math.round(rowCenterY - wrapperRect.top);

    setTipPos({ top, visible: isRowInView });
  }, [open, activeIdx]);

  useEffect(() => {
    if (!open) {
      setTipPos((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return undefined;
    }
    const raf = requestAnimationFrame(updateTipPosition);
    const settled = setTimeout(updateTipPosition, 320);
    window.addEventListener('resize', updateTipPosition);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settled);
      window.removeEventListener('resize', updateTipPosition);
    };
  }, [open, activeIdx, results.length, updateTipPosition]);

  const handleInputKeyDown = (e) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (activeIdx + 1) % results.length;
      setActiveIdx(next);
      rowRefs.current[next]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (activeIdx - 1 + results.length) % results.length;
      setActiveIdx(prev);
      rowRefs.current[prev]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIdx] || results[0];
      if (target) {
        navigate(target.to);
        onClose();
      }
    }
  };

  return (
    <div
      className={`backdrop${open ? ' show' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stitle"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <div
          className="modal"
          onTransitionEnd={updateTipPosition}
          style={{
            width: 620,
            maxWidth: 'calc(100vw - 32px)',
            padding: 24,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <h3 id="stitle" style={{ fontSize: 19, display: 'flex', alignItems: 'center', gap: 10, margin: 0, color: 'var(--cream)' }}>
            <Icon name="search" className="gold" style={{ width: 20, height: 20, flexShrink: 0 }} />
            <span>Search</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            title="Close (Esc)"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 200, 58, 0.14)',
              border: '1px solid rgba(255, 200, 58, 0.45)',
              color: 'var(--gold)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = 'var(--ink)';
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 200, 58, 0.14)';
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Icon name="close" style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div className="sbox" style={{ marginBottom: 14, width: '100%' }}>
          <Icon name="search" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search for videos, sessions, keywords, newsletters..."
            aria-label="Search entire app"
            style={{
              boxSizing: 'border-box',
              paddingRight: q ? 70 : 14,
            }}
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('');
                inputRef.current?.focus();
              }}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--sub)',
                fontSize: 12,
                padding: '3px 8px',
                borderRadius: 6,
                border: '1px solid var(--line)',
                background: 'rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div
          ref={listRef}
          onScroll={updateTipPosition}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 8,
            maxHeight: '52vh',
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            padding: '4px 6px',
            boxSizing: 'border-box',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(25,214,138,0.45) rgba(255,255,255,0.04)',
          }}
        >
          {results.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
              No matching pages or sections found for &ldquo;{q}&rdquo;.
            </div>
          )}
          {results.map((r, i) => {
            const isHighlighted = i === activeIdx;
            return (
              <MotionLink
                key={r.id || i}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                to={r.to}
                className="linkrow"
                onClick={onClose}
                onMouseEnter={() => setActiveIdx(i)}
                whileHover={{ y: -2, scale: 1.012 }}
                whileTap={{ scale: 0.99 }}
                transition={{
                  type: 'spring',
                  stiffness: 460,
                  damping: 28,
                  mass: 0.7,
                }}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 14px',
                  background: isHighlighted ? 'rgba(255, 200, 58, 0.1)' : 'rgba(2,14,9,.45)',
                  borderColor: isHighlighted ? 'rgba(255, 200, 58, 0.48)' : 'var(--line)',
                  boxShadow: isHighlighted
                    ? '0 8px 22px -8px rgba(0, 0, 0, 0.55), 0 0 18px -6px rgba(255, 200, 58, 0.22)'
                    : '0 2px 6px rgba(0, 0, 0, 0.15)',
                  textAlign: 'left',
                  overflow: 'hidden',
                  transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.22s ease',
                }}
              >
                <span
                  style={{
                    flex: '1 1 auto',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    fontWeight: 600,
                    color: isHighlighted ? '#FFF8E1' : 'var(--cream)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {r.title}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                    maxWidth: '48%',
                  }}
                >
                  <span
                    style={{
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--gold)',
                      background: 'rgba(255, 200, 58, 0.1)',
                      border: '1px solid rgba(255, 200, 58, 0.28)',
                      borderRadius: 100,
                      padding: '3px 10px',
                    }}
                  >
                    {r.section}
                  </span>
                  <motion.span
                    animate={{
                      x: isHighlighted ? 3 : 0,
                      opacity: isHighlighted ? 1 : 0.65,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 26,
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isHighlighted ? 'var(--gold)' : 'var(--sub)',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="arrow" style={{ width: 15, height: 15 }} />
                  </motion.span>
                </span>
              </MotionLink>
            );
          })}
        </div>
        </div>

        <motion.span
          className="search-side-tip"
          aria-hidden="true"
          initial={{ opacity: 0, x: -6, y: tipPos.top }}
          animate={{
            opacity: open && results.length > 0 && tipPos.visible ? 1 : 0,
            x: open && tipPos.visible ? 0 : -6,
            y: tipPos.top,
          }}
          transition={{
            y: { type: 'spring', stiffness: 460, damping: 34, mass: 0.6 },
            opacity: { duration: 0.18 },
            x: { duration: 0.2 },
          }}
          style={{
            position: 'absolute',
            left: 'calc(100% + 16px)',
            top: 0,
            color: 'rgba(140, 247, 197, 0.72)',
            fontSize: 12.5,
            fontWeight: 500,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <span style={{ display: 'inline-block', transform: 'translateY(-50%)' }}>
            Click for more information
          </span>
        </motion.span>
      </div>
    </div>
  );
}

export default SearchModal;