import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import SpecularButton from '../ui/SpecularButton';
import CiteRow from './CiteRow';
import { QUICK, SITE_URLS } from '../../data';

function getTabIcon(sourceType) {
  const norm = (sourceType || '').toLowerCase();
  if (norm.includes('journal')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-ico" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    );
  }
  if (norm.includes('webpage')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-ico" aria-hidden="true">
        <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
        <line x1="2" y1="9" x2="22" y2="9" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="10" cy="6" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (norm.includes('blog')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-ico" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-ico" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ApaQuick({ onCopy }) {
  const [i, setI] = useState(0);
  const q = QUICK[i];

  return (
    <section className="section">
      <div className="wrap split">
        <Reveal>
          <h2>
            Cite in <span className="hl-word hl-gold">APA 7th</span> without the <span className="hl-word hl-em">guesswork</span>
          </h2>
          <p className="lead">
            Pick a source type, copy the format, and paste it into your assignment. The full guide covers every section, with a search to find what you need fast.
          </p>
          <SpecularButton
            as={Link}
            to={`/referencing?sec=${q.sectionId || 'articles'}&tab=${q.tabId || '4-1'}`}
            className="btn btn-gold btn-lg"
            radius={14}
            lineColor="#ffffff"
            baseColor="#ffd860"
            intensity={1.2}
          >
            Open {q.k} in Referencing Guide
          </SpecularButton>
        </Reveal>
        <Reveal className="glass quick" delay={0.12}>
          <div className="tabs" role="tablist">
            {QUICK.map((x, k) => {
              const isActive = k === i;
              return (
                <button
                  key={x.k}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tab tab-${x.k.toLowerCase().replace(/\s+/g, '-')}${isActive ? ' on' : ''}`}
                  onClick={() => setI(k)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabPill"
                      className="tab-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="tab-label">
                    {getTabIcon(x.k)}
                    <span>{x.k}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={q.k}
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <CiteRow label="Reference list" text={q.ref} onCopy={onCopy} />
              <CiteRow label="In-text" text={q.it} onCopy={onCopy} />
              <p className="note">{q.n}</p>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to={`/referencing?sec=${q.sectionId || 'articles'}&tab=${q.tabId || '4-1'}`}
                  className="link-hover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    color: 'var(--gold)',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: 'rgba(255, 200, 58, 0.08)',
                    border: '1px solid rgba(255, 200, 58, 0.22)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>Explore full {q.k} rules in Guide</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

export default ApaQuick;