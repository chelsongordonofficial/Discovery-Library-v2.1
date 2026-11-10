import { useState, useMemo, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import GradientText from '../components/ui/GradientText';
import { REFERENCING_SECTIONS } from '../data/referencingData';

export default function ReferencingPage({ onCopy, onNotify }) {
  const [activeSectionId, setActiveSectionId] = useState('intro');
  const [activeTabId, setActiveTabId] = useState('1-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(null);

  // Deep-linking: sync section and tab from URL params (e.g. /referencing?sec=articles&tab=4-1)
  useEffect(() => {
    try {
      let secParam = null;
      let tabParam = null;

      if (typeof window !== 'undefined') {
        if (window.location.search) {
          const sp = new URLSearchParams(window.location.search);
          secParam = sp.get('sec') || sp.get('section');
          tabParam = sp.get('tab');
        }

        if (!secParam && window.location.hash) {
          const hashQuery = window.location.hash.split('?')[1];
          if (hashQuery) {
            const sp = new URLSearchParams(hashQuery);
            secParam = sp.get('sec') || sp.get('section');
            tabParam = sp.get('tab');
          }
        }

        if (secParam) {
          const foundSec = REFERENCING_SECTIONS.find((s) => s.id === secParam);
          if (foundSec) {
            setActiveSectionId(foundSec.id);
            if (tabParam) {
              const foundTab = foundSec.tabs.find((t) => t.id === tabParam);
              if (foundTab) {
                setActiveTabId(foundTab.id);
              } else {
                setActiveTabId(foundSec.tabs[0].id);
              }
            } else {
              setActiveTabId(foundSec.tabs[0].id);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[ReferencingPage] Deep-link param error:', err);
    }
  }, []);

  const currentSection = useMemo(() => {
    return REFERENCING_SECTIONS.find((s) => s.id === activeSectionId) || REFERENCING_SECTIONS[0];
  }, [activeSectionId]);

  const currentTab = useMemo(() => {
    return currentSection.tabs.find((t) => t.id === activeTabId) || currentSection.tabs[0];
  }, [currentSection, activeTabId]);

  const handleSelectSection = (section) => {
    setActiveSectionId(section.id);
    setActiveTabId(section.tabs[0].id);
    setSearchQuery('');
  };

  const handleCopyCitation = (text) => {
    if (!text) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);

    if (onCopy) {
      onCopy(text);
    } else if (onNotify) {
      onNotify('Citation copied to clipboard!');
    }
  };

  // Search results across all sections and tabs
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matches = [];
    REFERENCING_SECTIONS.forEach((sec) => {
      sec.tabs.forEach((tab) => {
        const textToSearch = [
          sec.title,
          tab.title,
          tab.tabNum,
          tab.intro || '',
          ...(tab.paragraphs || []),
          ...(tab.generalRules || []),
          ...(tab.rules || []),
          JSON.stringify(tab.formats || ''),
          JSON.stringify(tab.examples || ''),
          JSON.stringify(tab.table || ''),
        ].join(' ').toLowerCase();

        if (textToSearch.includes(q)) {
          matches.push({ sec, tab });
        }
      });
    });
    return matches;
  }, [searchQuery]);

  return (
    <div className="page page-referencing" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Navigation */}
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

        {/* Header Section (Hero graphic illustration removed as requested) */}
        <Reveal className="sh" style={{ marginLeft: 0, textAlign: 'left', marginBottom: 28 }}>
          <h2 style={{ marginBottom: 8 }}>
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Referencing
            </GradientText>{' '}
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Guide</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--sub)', margin: '0 0 20px 0', maxWidth: 720, lineHeight: 1.55 }}>
            Streamline your citations with Discovery Library. Complete APA 7th edition rules, in-text citation guidelines, and verified reference list formats.
          </p>

          {/* Search Bar for Rapid Referencing Lookup */}
          <div style={{ maxWidth: 620, position: 'relative' }}>
            <div className="sbox" style={{ width: '100%', borderRadius: 14 }}>
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search referencing rules, journals, websites, DOIs, tables, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: 14 }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--sub)',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: 12,
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* If searching, render search results */}
        {searchResults !== null ? (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, color: 'var(--cream)', margin: 0, fontWeight: 600 }}>
                Search Results ({searchResults.length}) for <span style={{ color: 'var(--gold)' }}>"{searchQuery}"</span>
              </h3>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="btn btn-ghost btn-sm"
              >
                Back to Modules
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="glass panel" style={{ padding: 40, textAlign: 'center', color: 'var(--sub)' }}>
                No referencing topics matched your search. Try searching for "Journal", "Book", "Website", "Figure", "Table", or "Author".
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {searchResults.map(({ sec, tab }) => (
                  <div
                    key={`${sec.id}-${tab.id}`}
                    className="glass panel"
                    style={{
                      padding: 20,
                      cursor: 'pointer',
                      border: '1px solid var(--line)',
                      textAlign: 'left',
                      transition: 'border-color 0.2s',
                    }}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      setActiveTabId(tab.id);
                      setSearchQuery('');
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span className="citation-badge">{sec.shortTitle}</span>
                      <span style={{ fontSize: 13, color: 'var(--mint)', fontFamily: 'var(--f-mono)' }}>
                        Section {tab.tabNum}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 17, color: 'var(--cream)', margin: '0 0 6px 0', fontWeight: 600 }}>
                      {tab.title}
                    </h4>
                    <p style={{ fontSize: 13.5, color: 'var(--sub)', margin: 0, lineHeight: 1.5 }}>
                      {tab.intro || 'Click to view complete APA 7th rules and reference formats.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Standard Categorized View */
          <>
            {/* Level 1: Parent Hierarchy (8 Core Modules) */}
            <div className="ref-parent-hierarchy" role="tablist" aria-label="Referencing Modules">
              <div className="ref-hierarchy-header">
                <span className="ref-hierarchy-label">
                  <b>Core Modules</b> · Select an APA 7th Category (1–8)
                </span>
                <span style={{ fontSize: 12, color: 'var(--sub)', fontFamily: 'var(--f-mono)' }}>
                  Module {currentSection.num} of 8
                </span>
              </div>
              <div className="ref-parent-grid">
                {REFERENCING_SECTIONS.map((sec) => {
                  const isActive = sec.id === activeSectionId;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`ref-module-card${isActive ? ' active' : ''}`}
                      onClick={() => handleSelectSection(sec)}
                    >
                      <span className="mod-num">{sec.num}</span>
                      <span className="mod-title">{sec.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level 2: Child Hierarchy (Sub-sections / Topics inside selected module) */}
            <div className="ref-child-hierarchy" role="region" aria-label="Module Subtopics">
              <div className="ref-child-header">
                <div className="ref-child-breadcrumb">
                  <span className="parent-crumb">Module {currentSection.num}: {currentSection.title}</span>
                  <span className="sep">›</span>
                  <span className="child-crumb">Topics ({currentSection.tabs[0].tabNum} – {currentSection.tabs[currentSection.tabs.length - 1].tabNum})</span>
                </div>
                <span className="ref-child-count">
                  {currentSection.tabs.length} {currentSection.tabs.length === 1 ? 'Topic' : 'Topics'}
                </span>
              </div>
              <div className="ref-subtab-list" role="tablist" aria-label="Subtopics">
                {currentSection.tabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`ref-subtab-pill${isActive ? ' active' : ''}`}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      <span className="subtab-num">{tab.tabNum}</span>
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="glass panel" style={{ padding: '32px 28px', textAlign: 'left', borderRadius: 20 }}>
              {/* Tab Header */}
              <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 18, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="citation-badge">
                    Module {currentSection.num}
                  </span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--em)' }}>
                    Section {currentTab.tabNum}
                  </span>
                </div>
                <h3 style={{ fontSize: 24, margin: 0, color: 'var(--cream)', fontWeight: 700 }}>
                  {currentTab.title}
                </h3>
              </div>

              {/* Intro Text */}
              {currentTab.intro && (
                <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--cream)', marginBottom: 20 }}>
                  {currentTab.intro}
                </div>
              )}

              {/* Additional Paragraphs */}
              {currentTab.paragraphs && currentTab.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--sub)', marginBottom: 14 }}>
                  {p}
                </p>
              ))}

              {/* Section 1.1 Highlights */}
              {currentTab.highlights && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '22px 0' }}>
                  {currentTab.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: 'rgba(25, 214, 138, 0.05)',
                        border: '1px solid rgba(25, 214, 138, 0.18)',
                      }}
                    >
                      <h5 style={{ color: 'var(--mint)', margin: '0 0 6px 0', fontSize: 15, fontWeight: 600 }}>
                        {h.title}
                      </h5>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--sub)', lineHeight: 1.5 }}>
                        {h.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Section 1.2 Callout */}
              {currentTab.callout && (
                <div
                  style={{
                    padding: '18px 22px',
                    borderRadius: 14,
                    background: 'rgba(255, 200, 58, 0.08)',
                    border: '1px solid rgba(255, 200, 58, 0.3)',
                    margin: '22px 0',
                  }}
                >
                  <span className="citation-badge" style={{ marginBottom: 8 }}>{currentTab.callout.badge}</span>
                  <h4 style={{ color: 'var(--cream)', margin: '4px 0 6px 0', fontSize: 16, fontWeight: 600 }}>
                    {currentTab.callout.title}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--sub)', fontSize: 14, lineHeight: 1.6 }}>
                    {currentTab.callout.text}
                  </p>
                </div>
              )}

              {/* General Rules List */}
              {currentTab.generalRules && (
                <div style={{ margin: '20px 0' }}>
                  <h4 style={{ fontSize: 15.5, color: 'var(--gold)', marginBottom: 12, fontWeight: 600 }}>
                    General Rules
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 10, color: 'var(--sub)', fontSize: 14, lineHeight: 1.6 }}>
                    {currentTab.generalRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rules List (Generic) */}
              {currentTab.rules && (
                <div style={{ margin: '20px 0' }}>
                  <h4 style={{ fontSize: 15.5, color: 'var(--gold)', marginBottom: 12, fontWeight: 600 }}>
                    Formatting Guidelines
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 10, color: 'var(--sub)', fontSize: 14, lineHeight: 1.6 }}>
                    {currentTab.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Criteria List (Section 3.1 Internet Sources) */}
              {currentTab.criteria && (
                <div style={{ display: 'grid', gap: 12, margin: '20px 0' }}>
                  <h4 style={{ fontSize: 15.5, color: 'var(--gold)', margin: '0 0 4px 0', fontWeight: 600 }}>
                    Evaluation Criteria for Web Sources
                  </h4>
                  {currentTab.criteria.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(2, 14, 9, 0.45)',
                        border: '1px solid rgba(120, 240, 190, 0.14)',
                        borderRadius: 10,
                      }}
                    >
                      <b style={{ color: 'var(--mint)', display: 'inline-block', minWidth: 100 }}>{c.label}:</b>{' '}
                      <span style={{ color: 'var(--sub)', fontSize: 13.5 }}>{c.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Section 1.3 Subsections (Direct Quotes & Paraphrasing) */}
              {currentTab.sections && (
                <div style={{ display: 'grid', gap: 24, marginTop: 24 }}>
                  {currentTab.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(2, 14, 9, 0.4)',
                        border: '1px solid rgba(120, 240, 190, 0.15)',
                        borderRadius: 14,
                        padding: '20px 22px',
                      }}
                    >
                      <h4 style={{ fontSize: 17, color: 'var(--cream)', margin: '0 0 8px 0', fontWeight: 600 }}>
                        {sec.heading}
                      </h4>
                      <p style={{ color: 'var(--sub)', fontSize: 14, margin: '0 0 14px 0', lineHeight: 1.6 }}>
                        {sec.desc}
                      </p>

                      {sec.formats && (
                        <div style={{ marginBottom: 14 }}>
                          <span style={{ fontSize: 12, fontFamily: 'var(--f-mono)', color: 'var(--mint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Standard Formats:
                          </span>
                          <div style={{ marginTop: 6, display: 'grid', gap: 6 }}>
                            {sec.formats.map((fmt, fIdx) => (
                              <div
                                key={fIdx}
                                style={{
                                  background: 'rgba(0, 0, 0, 0.35)',
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                  padding: '8px 12px',
                                  borderRadius: 8,
                                  fontSize: 13.5,
                                  color: 'var(--cream)',
                                  fontFamily: 'var(--f-mono)',
                                }}
                              >
                                {fmt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.examples && (
                        <div>
                          <span style={{ fontSize: 12, fontFamily: 'var(--f-mono)', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Examples:
                          </span>
                          <div style={{ marginTop: 6, display: 'grid', gap: 10 }}>
                            {sec.examples.map((ex, eIdx) => (
                              <div key={eIdx} className="citation-box citation-box-em" style={{ margin: 0 }}>
                                <div className="citation-box-header">
                                  <span className="citation-badge badge-em">{ex.type}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCitation(ex.text)}
                                    className="citation-copy-btn"
                                  >
                                    <Icon name={copiedText === ex.text ? 'check' : 'copy'} />
                                    {copiedText === ex.text ? 'Copied' : 'Copy'}
                                  </button>
                                </div>
                                <div className="citation-text">{ex.text}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.notes && (
                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                          {sec.notes.map((n, nIdx) => (
                            <p key={nIdx} style={{ fontSize: 13, color: 'var(--sub)', margin: '4px 0', fontStyle: 'italic' }}>
                              {n}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* In-Text Guidance Block (Direct quote & Paraphrase) */}
              {currentTab.inText && (
                <div style={{ margin: '22px 0' }}>
                  <h4 style={{ fontSize: 16, color: 'var(--em)', marginBottom: 12, fontWeight: 600 }}>
                    In-Text Citation Examples
                  </h4>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {currentTab.inText.directQuote && (
                      <div className="citation-box citation-box-em">
                        <div className="citation-box-header">
                          <span className="citation-badge badge-em">Direct Quotation</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCitation(currentTab.inText.directQuote)}
                            className="citation-copy-btn"
                          >
                            <Icon name={copiedText === currentTab.inText.directQuote ? 'check' : 'copy'} />
                            {copiedText === currentTab.inText.directQuote ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="citation-text">{currentTab.inText.directQuote}</div>
                        {currentTab.inText.directNote && (
                          <div className="citation-note">{currentTab.inText.directNote}</div>
                        )}
                      </div>
                    )}

                    {currentTab.inText.paraphrase && (
                      <div className="citation-box">
                        <div className="citation-box-header">
                          <span className="citation-badge">Paraphrasing / Summarising</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCitation(currentTab.inText.paraphrase)}
                            className="citation-copy-btn"
                          >
                            <Icon name={copiedText === currentTab.inText.paraphrase ? 'check' : 'copy'} />
                            {copiedText === currentTab.inText.paraphrase ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="citation-text" style={{ whiteSpace: 'pre-line' }}>
                          {currentTab.inText.paraphrase}
                        </div>
                        {currentTab.inText.paraphraseNote && (
                          <div className="citation-note">{currentTab.inText.paraphraseNote}</div>
                        )}
                      </div>
                    )}

                    {currentTab.inText.textMention && (
                      <div className="citation-box citation-box-em">
                        <div className="citation-box-header">
                          <span className="citation-badge badge-em">Within Text Mention</span>
                        </div>
                        <div className="citation-text" style={{ whiteSpace: 'pre-line' }}>
                          {currentTab.inText.textMention}
                        </div>
                        {currentTab.inText.note && (
                          <div className="citation-note">{currentTab.inText.note}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Single Reference Format Block */}
              {currentTab.refFormat && (
                <div style={{ margin: '20px 0' }}>
                  <h4 style={{ fontSize: 15.5, color: 'var(--gold)', marginBottom: 8, fontWeight: 600 }}>
                    Reference List Format
                  </h4>
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 200, 58, 0.25)',
                      padding: '12px 16px',
                      borderRadius: 10,
                      color: 'var(--gold)',
                      fontFamily: 'var(--f-mono)',
                      fontSize: 13.5,
                      lineHeight: 1.5,
                    }}
                  >
                    {currentTab.refFormat}
                  </div>
                  {currentTab.note && (
                    <p style={{ fontSize: 13, color: 'var(--sub)', marginTop: 8, fontStyle: 'italic' }}>
                      {currentTab.note}
                    </p>
                  )}
                </div>
              )}

              {/* Formats Array (with examples and sub-notes) */}
              {currentTab.formats && (
                <div style={{ display: 'grid', gap: 16, margin: '22px 0' }}>
                  <h4 style={{ fontSize: 16, color: 'var(--gold)', margin: 0, fontWeight: 600 }}>
                    Reference List Formats & Examples
                  </h4>
                  {currentTab.formats.map((fmt, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(2, 14, 9, 0.45)',
                        border: '1px solid rgba(120, 240, 190, 0.15)',
                        borderRadius: 14,
                        padding: '18px 20px',
                      }}
                    >
                      <div style={{ color: 'var(--cream)', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                        {fmt.label}
                      </div>

                      {fmt.format && (
                        <div
                          style={{
                            background: 'rgba(0, 0, 0, 0.35)',
                            border: '1px solid rgba(255, 200, 58, 0.2)',
                            padding: '10px 14px',
                            borderRadius: 8,
                            color: 'var(--gold)',
                            fontFamily: 'var(--f-mono)',
                            fontSize: 13,
                            marginBottom: 10,
                          }}
                        >
                          {fmt.format}
                        </div>
                      )}

                      {fmt.citation && (
                        <div className="citation-box" style={{ margin: '8px 0 0 0' }}>
                          <div className="citation-box-header">
                            <span className="citation-badge">Verified Entry</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCitation(fmt.citation)}
                              className="citation-copy-btn"
                            >
                              <Icon name={copiedText === fmt.citation ? 'check' : 'copy'} />
                              {copiedText === fmt.citation ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="citation-text">{fmt.citation}</div>
                        </div>
                      )}

                      {fmt.example && (
                        <div className="citation-box" style={{ margin: '8px 0 0 0' }}>
                          <div className="citation-box-header">
                            <span className="citation-badge">Example</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCitation(fmt.example)}
                              className="citation-copy-btn"
                            >
                              <Icon name={copiedText === fmt.example ? 'check' : 'copy'} />
                              {copiedText === fmt.example ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="citation-text">{fmt.example}</div>
                        </div>
                      )}

                      {fmt.examples && fmt.examples.map((ex, eIdx) => (
                        <div key={eIdx} className="citation-box" style={{ margin: '8px 0 0 0' }}>
                          <div className="citation-box-header">
                            <span className="citation-badge">Example {eIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCitation(ex.citation)}
                              className="citation-copy-btn"
                            >
                              <Icon name={copiedText === ex.citation ? 'check' : 'copy'} />
                              {copiedText === ex.citation ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="citation-text">{ex.citation}</div>
                        </div>
                      ))}

                      {fmt.note && (
                        <p style={{ fontSize: 13, color: 'var(--sub)', margin: '10px 0 0 0', fontStyle: 'italic' }}>
                          {fmt.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Generic Examples Array */}
              {currentTab.examples && (
                <div style={{ margin: '22px 0' }}>
                  <h4 style={{ fontSize: 16, color: 'var(--gold)', marginBottom: 12, fontWeight: 600 }}>
                    Reference List Examples
                  </h4>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {currentTab.examples.map((ex, idx) => (
                      <div key={idx} className="citation-box" style={{ margin: 0 }}>
                        <div className="citation-box-header">
                          <span className="citation-badge">
                            {ex.label || ex.type || `Example ${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCitation(ex.citation || ex.text)}
                            className="citation-copy-btn"
                          >
                            <Icon name={copiedText === (ex.citation || ex.text) ? 'check' : 'copy'} />
                            {copiedText === (ex.citation || ex.text) ? 'Copied' : 'Copy'}
                          </button>
                        </div>

                        {ex.format && (
                          <div
                            style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              padding: '6px 10px',
                              borderRadius: 6,
                              fontSize: 12.5,
                              color: 'var(--gold)',
                              fontFamily: 'var(--f-mono)',
                              marginBottom: 8,
                            }}
                          >
                            {ex.format}
                          </div>
                        )}

                        <div className="citation-text" style={{ whiteSpace: 'pre-line' }}>
                          {ex.citation || ex.text}
                        </div>

                        {ex.note && <div className="citation-note">{ex.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Example Block (e.g. Lists) */}
              {currentTab.example && (
                <div className="citation-box citation-box-em" style={{ margin: '16px 0' }}>
                  <div className="citation-box-header">
                    <span className="citation-badge badge-em">Application Example</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(currentTab.example)}
                      className="citation-copy-btn"
                    >
                      <Icon name={copiedText === currentTab.example ? 'check' : 'copy'} />
                      {copiedText === currentTab.example ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="citation-text" style={{ whiteSpace: 'pre-line' }}>
                    {currentTab.example}
                  </div>
                </div>
              )}

              {/* Section 6.1 Figure Subsections */}
              {currentTab.subsections && (
                <div style={{ display: 'grid', gap: 24, margin: '22px 0' }}>
                  {currentTab.subsections.map((sub, idx) => (
                    <div key={idx} className="ref-figure-card">
                      <h4 style={{ color: 'var(--cream)', fontSize: 16.5, margin: '0 0 10px 0', fontWeight: 600 }}>
                        {sub.title}
                      </h4>

                      {sub.format && (
                        <div
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 200, 58, 0.2)',
                            padding: '10px 14px',
                            borderRadius: 8,
                            color: 'var(--gold)',
                            fontFamily: 'var(--f-mono)',
                            fontSize: 13,
                            marginBottom: 14,
                          }}
                        >
                          {sub.format}
                        </div>
                      )}

                      {sub.imageUrl && (
                        <div className="ref-figure-img-wrap">
                          <img src={sub.imageUrl} alt={sub.imageAlt || 'Referencing Figure'} loading="lazy" />
                        </div>
                      )}

                      {sub.caption && (
                        <div className="ref-figure-caption" style={{ marginBottom: 12 }}>
                          {sub.caption}
                        </div>
                      )}

                      {sub.refEntry && (
                        <div className="citation-box" style={{ margin: '8px 0 0 0' }}>
                          <div className="citation-box-header">
                            <span className="citation-badge">Reference List Entry</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCitation(sub.refEntry)}
                              className="citation-copy-btn"
                            >
                              <Icon name={copiedText === sub.refEntry ? 'check' : 'copy'} />
                              {copiedText === sub.refEntry ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="citation-text">{sub.refEntry}</div>
                        </div>
                      )}

                      {sub.refEntries && (
                        <div style={{ marginTop: 12 }}>
                          <span style={{ fontSize: 12, fontFamily: 'var(--f-mono)', color: 'var(--gold)', textTransform: 'uppercase' }}>
                            Reference List Entries:
                          </span>
                          <div style={{ display: 'grid', gap: 8, marginTop: 6 }}>
                            {sub.refEntries.map((refE, rIdx) => (
                              <div key={rIdx} className="citation-box" style={{ margin: 0 }}>
                                <div className="citation-box-header">
                                  <span className="citation-badge">Source {rIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCitation(refE)}
                                    className="citation-copy-btn"
                                  >
                                    <Icon name={copiedText === refE ? 'check' : 'copy'} />
                                    {copiedText === refE ? 'Copied' : 'Copy'}
                                  </button>
                                </div>
                                <div className="citation-text">{refE}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Section 6.2 Data Tables */}
              {currentTab.table1 && (
                <div style={{ margin: '22px 0' }}>
                  <h4 style={{ fontSize: 16.5, color: 'var(--cream)', marginBottom: 4, fontWeight: 600 }}>
                    {currentTab.table1.number}. <i>{currentTab.table1.title}</i>
                  </h4>
                  <div className="ref-table-wrap">
                    <table className="ref-table">
                      <thead>
                        <tr>
                          {currentTab.table1.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentTab.table1.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ whiteSpace: 'pre-line' }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', fontStyle: 'italic', margin: '6px 0 14px 0' }}>
                    <b>Note:</b> {currentTab.table1.note}
                  </p>
                  {currentTab.table1.refEntry && (
                    <div className="citation-box">
                      <div className="citation-box-header">
                        <span className="citation-badge">Reference List Entry for Table 1</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(currentTab.table1.refEntry)}
                          className="citation-copy-btn"
                        >
                          <Icon name={copiedText === currentTab.table1.refEntry ? 'check' : 'copy'} />
                          {copiedText === currentTab.table1.refEntry ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="citation-text">{currentTab.table1.refEntry}</div>
                    </div>
                  )}
                </div>
              )}

              {currentTab.table2 && (
                <div style={{ margin: '30px 0 20px 0' }}>
                  <h4 style={{ fontSize: 16.5, color: 'var(--cream)', marginBottom: 4, fontWeight: 600 }}>
                    {currentTab.table2.number}. <i>{currentTab.table2.title}</i>
                  </h4>
                  <div className="ref-table-wrap">
                    <table className="ref-table">
                      <thead>
                        <tr>
                          {currentTab.table2.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentTab.table2.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', fontStyle: 'italic', margin: '6px 0 0 0' }}>
                    <b>Note:</b> {currentTab.table2.note}
                  </p>
                </div>
              )}

              {/* Section 6.3 Images Array */}
              {currentTab.items && (
                <div style={{ display: 'grid', gap: 20, margin: '22px 0' }}>
                  {currentTab.items.map((imgItem, idx) => (
                    <div key={idx} className="ref-figure-card">
                      <h4 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px 0', fontWeight: 600 }}>
                        {imgItem.title}
                      </h4>
                      {imgItem.format && (
                        <div
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 200, 58, 0.2)',
                            padding: '8px 12px',
                            borderRadius: 8,
                            color: 'var(--gold)',
                            fontFamily: 'var(--f-mono)',
                            fontSize: 13,
                            marginBottom: 12,
                          }}
                        >
                          {imgItem.format}
                        </div>
                      )}
                      {imgItem.imageUrl && (
                        <div className="ref-figure-img-wrap">
                          <img src={imgItem.imageUrl} alt={imgItem.imageAlt || 'Referencing Image'} loading="lazy" />
                        </div>
                      )}
                      <div className="ref-figure-caption" style={{ marginBottom: 10 }}>
                        {imgItem.caption}
                      </div>
                      {imgItem.refEntry && (
                        <div className="citation-box" style={{ margin: '8px 0 0 0' }}>
                          <div className="citation-box-header">
                            <span className="citation-badge">Reference List Entry</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCitation(imgItem.refEntry)}
                              className="citation-copy-btn"
                            >
                              <Icon name={copiedText === imgItem.refEntry ? 'check' : 'copy'} />
                              {copiedText === imgItem.refEntry ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="citation-text">{imgItem.refEntry}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Section 7.1 Author Count Summary Table */}
              {currentTab.table && (
                <div className="ref-table-wrap" style={{ margin: '22px 0' }}>
                  <table className="ref-table">
                    <thead>
                      <tr>
                        <th style={{ width: '22%' }}>Author Count</th>
                        <th style={{ width: '38%' }}>In-Text Citation</th>
                        <th style={{ width: '40%' }}>Reference List Format</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTab.table.map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <b style={{ color: 'var(--gold)', fontSize: 14 }}>{row.count}</b>
                            <p style={{ margin: '6px 0 0 0', fontSize: 12.5, color: 'var(--sub)' }}>{row.desc}</p>
                          </td>
                          <td style={{ whiteSpace: 'pre-line', fontSize: 13 }}>
                            {row.inText}
                          </td>
                          <td style={{ whiteSpace: 'pre-line', fontSize: 13 }}>
                            {row.refList}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Final Note */}
              {currentTab.note && !currentTab.refFormat && !currentTab.subsections && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 12,
                    background: 'rgba(25, 214, 138, 0.06)',
                    border: '1px solid rgba(25, 214, 138, 0.2)',
                    fontSize: 13.5,
                    color: 'var(--sub)',
                    marginTop: 20,
                  }}
                >
                  <strong style={{ color: 'var(--mint)' }}>Note: </strong>
                  {currentTab.note}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
