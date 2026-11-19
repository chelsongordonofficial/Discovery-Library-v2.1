import { useEffect, useMemo, useRef, useState } from 'react';
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

const WORD_PREFIX_REGEX = /^microsoft\s+word\s*[–—-]\s*(.+)$/i;

const SPA_PAGES = [
  {
    id: 'page-home',
    type: 'Page',
    icon: 'compass',
    title: 'Home — Discovery Library',
    desc: 'Pick where to start, 11 Microsoft Word lessons, upcoming live workshops, and APA 7th quick guide.',
    keywords: 'home landing discovery library overview start here word lessons',
    to: SITE_URLS.home,
  },
  {
    id: 'page-resources',
    type: 'Page',
    icon: 'book',
    title: 'Library Resources Hub',
    desc: 'Explore training videos, upcoming workshops, session recordings, and research links.',
    keywords: 'resources hub study materials vet compliance',
    to: SITE_URLS.resources,
  },
  {
    id: 'page-videos',
    type: 'Page',
    icon: 'play',
    title: 'Training Videos',
    desc: 'Step-by-step masterclasses on AI prompting, Microsoft Word, and vocational training standards.',
    keywords: 'training videos masterclasses word ai vet standards',
    to: SITE_URLS.videos,
  },
  {
    id: 'page-sessions',
    type: 'Page',
    icon: 'calendar',
    title: 'Upcoming Sessions',
    desc: 'Join upcoming live referencing clinics, numeracy workshops, and ASQA webinars.',
    keywords: 'upcoming sessions workshops live clinics schedule reserve spot calendar',
    to: SITE_URLS.sessions,
  },
  {
    id: 'page-recordings',
    type: 'Page',
    icon: 'record',
    title: 'Previous Recorded Sessions',
    desc: 'Catch up on past live clinics, workshops, and policy briefings on demand.',
    keywords: 'recorded sessions recordings past webinars archive watch recording',
    to: SITE_URLS.recordings,
  },
  {
    id: 'page-links',
    type: 'Page',
    icon: 'link',
    title: 'Useful Links & Videos',
    desc: 'Authoritative registers, research databases, and instructional media from Discovery Library.',
    keywords: 'useful links videos asqa webinar instructional media databases',
    to: SITE_URLS.links,
  },
  {
    id: 'page-referencing',
    type: 'Page',
    icon: 'listCheck',
    title: 'APA 7th Referencing Guide',
    desc: 'Complete guide to in-text citations, reference lists, journals, books, websites, social media, and AI.',
    keywords: 'referencing apa 7th citation bibliography plagiarism doi',
    to: SITE_URLS.referencing,
  },
  {
    id: 'page-newsletter',
    type: 'Page',
    icon: 'newspaper',
    title: 'Our Newsletter',
    desc: 'Monthly updates, academic writing advice, VET sector updates, and library announcements.',
    keywords: 'newsletter monthly updates download preview pdf 2026 2025',
    to: SITE_URLS.newsletter,
  },
  {
    id: 'page-contact',
    type: 'Page',
    icon: 'chat',
    title: 'Contact Us & Book a Consultation',
    desc: 'Submit an online enquiry, book a consultation, or browse frequently asked questions.',
    keywords: 'contact consultation book enquiry help support librarian faq',
    to: SITE_URLS.contact,
  },
  {
    id: 'page-llnd',
    type: 'Page',
    icon: 'lock',
    title: 'Learning & Language Support (LLND)',
    desc: 'Strengthen foundational language, literacy, numeracy, and digital skills for vocational study.',
    keywords: 'llnd portal language literacy numeracy digital skills grammar math',
    to: '/learning-support',
  },
];

function scoreItem(item, tokens, fullQuery) {
  const titleLower = (item.title || '').toLowerCase();
  const descLower = (item.desc || '').toLowerCase();
  const typeLower = (item.type || '').toLowerCase();
  const bodyLower = (item.body || '').toLowerCase();
  const combined = `${titleLower} ${descLower} ${typeLower} ${bodyLower}`;

  for (const tok of tokens) {
    if (!combined.includes(tok)) return 0;
  }

  let score = 10;
  if (titleLower === fullQuery) score += 120;
  else if (titleLower.startsWith(fullQuery)) score += 70;
  else if (titleLower.includes(fullQuery)) score += 45;

  if (descLower.includes(fullQuery)) score += 20;

  for (const tok of tokens) {
    if (titleLower.includes(tok)) score += 18;
    else if (descLower.includes(tok)) score += 8;
    else if (typeLower.includes(tok)) score += 6;
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
  const inputRef = useRef(null);

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
        type: p.type,
        icon: p.icon,
        title: p.title,
        desc: p.desc,
        body: p.keywords,
        to: p.to,
      });
    });

    // 2. Resource Hub Cards
    RES_CARDS.forEach((card, i) => {
      items.push({
        id: `res-card-${i}`,
        type: 'Resource',
        icon: card.icon || 'book',
        title: card.t,
        desc: card.d,
        body: 'library resources start here',
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
        type: isWordLesson ? 'Word Lesson' : 'Video',
        icon: 'play',
        title: v.title,
        desc: v.desc || (isWordLesson ? 'Microsoft Word 11-lesson series' : 'Training Video'),
        body: isWordLesson ? 'microsoft word 11 short lessons' : 'training video',
        to: `${SITE_URLS.videos}?q=${encodeURIComponent(v.title)}`,
      });
    });

    // 4. Upcoming Sessions
    (upcomingSessions || []).forEach((s, i) => {
      if (!s?.title) return;
      const dateStr = s.d && s.mon ? `${s.wd ? `${s.wd}, ` : ''}${s.d} ${s.mon}${s.year ? ` ${s.year}` : ''}` : '';
      const metaSummary = [dateStr, s.time].filter(Boolean).join(' · ');
      items.push({
        id: `up-sess-${s.id || i}`,
        type: 'Upcoming Session',
        icon: 'calendar',
        title: s.title,
        desc: metaSummary || s.desc || 'Live upcoming session',
        body: [s.desc, dateStr, s.time, 'upcoming session live workshop'].filter(Boolean).join(' '),
        to: SITE_URLS.sessions,
      });
    });

    // 5. Previous Recorded Sessions
    (previousSessions || []).forEach((s, i) => {
      if (!s?.title) return;
      const dateStr = s.d && s.mon ? `${s.wd ? `${s.wd}, ` : ''}${s.d} ${s.mon}${s.year ? ` ${s.year}` : ''}` : '';
      const metaSummary = [dateStr, s.time].filter(Boolean).join(' · ');
      items.push({
        id: `rec-sess-${s.id || i}`,
        type: 'Recorded Session',
        icon: 'record',
        title: s.title,
        desc: metaSummary || s.desc || 'Previous recorded session',
        body: [s.desc, dateStr, s.time, 'recorded session recording archive'].filter(Boolean).join(' '),
        to: `${SITE_URLS.recordings}?q=${encodeURIComponent(s.title)}`,
      });
    });

    // 6. Useful Links & Videos (Live CPT only)
    (usefulLinks || []).forEach((u, i) => {
      if (!u?.title) return;
      items.push({
        id: `useful-${u.id || i}`,
        type: 'Useful Link',
        icon: 'link',
        title: u.title,
        desc: u.desc || 'Useful Links & Videos',
        body: 'useful links videos webinar resource',
        to: `${SITE_URLS.links}?q=${encodeURIComponent(u.title)}`,
      });
    });

    // 7. Newsletters
    (newsletters || []).forEach((n, i) => {
      if (!n?.title) return;
      const issuePeriod = [n.month, n.year].filter(Boolean).join(' ');
      items.push({
        id: `news-${n.id || i}`,
        type: 'Newsletter',
        icon: 'newspaper',
        title: n.title,
        desc: issuePeriod ? `${issuePeriod} Issue` : 'Newsletter Issue',
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
          type: `Referencing · ${sec.shortTitle || sec.title}`,
          icon: 'listCheck',
          title: `${tab.tabNum ? `${tab.tabNum} ` : ''}${tab.title}`,
          desc: tab.intro || sec.title,
          body: `${subText} apa 7th citation reference`,
          to: `${SITE_URLS.referencing}?sec=${encodeURIComponent(sec.id)}&tab=${encodeURIComponent(tab.id)}`,
        });
      });
    });

    QUICK.forEach((qItem, i) => {
      items.push({
        id: `ref-quick-${i}`,
        type: 'APA Quick Format',
        icon: 'listCheck',
        title: `APA 7th: ${qItem.k}`,
        desc: qItem.n || qItem.ref,
        body: `${qItem.k} ${qItem.ref} ${qItem.it} ${qItem.n} apa citation example`,
        to: `${SITE_URLS.referencing}?sec=${encodeURIComponent(qItem.sectionId)}&tab=${encodeURIComponent(qItem.tabId)}`,
      });
    });

    // 9. Contact FAQs
    CONTACT_FAQS.forEach((faq, idx) => {
      items.push({
        id: `faq-${idx}`,
        type: 'FAQ',
        icon: 'chat',
        title: faq.q,
        desc: faq.a,
        body: 'frequently asked question contact help',
        to: `${SITE_URLS.contact}?faq=${idx}`,
      });
    });

    // 10. LLND Support Pillars
    LLND_PILLARS.forEach((pillar, idx) => {
      items.push({
        id: `llnd-${idx}`,
        type: 'LLND Support',
        icon: pillar.icon || 'book',
        title: pillar.title,
        desc: pillar.desc,
        body: `${(pillar.resources || []).join(' ')} llnd language literacy numeracy digital`,
        to: '/learning-support',
      });
    });

    return items;
  }, [wpVideos, upcomingSessions, previousSessions, usefulLinks, newsletters, isLiveConnected]);

  const results = useMemo(() => {
    const raw = q.trim().toLowerCase();
    if (!raw) {
      // Show top quick destinations & latest content across the app when search is empty
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
  }, [q]);

  const handleInputKeyDown = (e) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => (prev - 1 + results.length) % results.length);
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
      <div className="modal" style={{ width: 680 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 id="stitle" style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, marginTop: 0, marginBottom: 0 }}>
            <Icon name="search" className="gold" style={{ width: 22, height: 22 }} />
            Search Discovery Library
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--sub)', fontSize: 13, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--line)', cursor: 'pointer' }}
          >
            Esc
          </button>
        </div>

        <div className="sbox" style={{ marginBottom: 14 }}>
          <Icon name="search" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search pages, videos, sessions, referencing, newsletters, FAQs..."
            aria-label="Search entire app"
            style={q ? { paddingRight: 68 } : undefined}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 12, color: 'var(--sub)' }}>
          <span>{q.trim() ? `${results.length} matching result${results.length === 1 ? '' : 's'}` : 'Quick Destinations Across App'}</span>
          <span>Use ↑ ↓ &amp; Enter to open</span>
        </div>

        <div style={{ display: 'grid', gap: 8, maxHeight: '52vh', overflowY: 'auto', paddingRight: 4 }}>
          {results.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
              No matching content found for &ldquo;{q}&rdquo;.
            </div>
          )}
          {results.map((r, i) => {
            const isHighlighted = i === activeIdx;
            return (
              <Link
                key={r.id || i}
                to={r.to}
                className="linkrow"
                onClick={onClose}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  background: isHighlighted ? 'rgba(255, 200, 58, 0.08)' : 'rgba(2,14,9,.4)',
                  borderColor: isHighlighted ? 'rgba(255, 200, 58, 0.45)' : 'var(--line)',
                  marginBottom: 2,
                  textAlign: 'left',
                }}
              >
                <span className="lico" style={{ width: 34, height: 34 }}>
                  <Icon name={r.icon} style={{ width: 17, height: 17 }} />
                </span>
                <span className="ltext">
                  <h4 style={{ fontSize: 14, color: 'var(--cream)', margin: 0 }}>{r.title}</h4>
                  {r.desc && (
                    <p
                      style={{
                        fontSize: 12.5,
                        color: 'var(--sub)',
                        marginTop: 2,
                        marginBottom: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.desc}
                    </p>
                  )}
                </span>
                <span className="ltag" style={{ fontSize: 10 }}>{r.type}</span>
                <span className="lgo">
                  <Icon name="arrow" style={{ width: 15, height: 15 }} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;