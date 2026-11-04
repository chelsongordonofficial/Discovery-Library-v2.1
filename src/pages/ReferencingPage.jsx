import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import CiteRow from '../components/sections/CiteRow';
import { QUICK } from '../data';

const CITATION_CATEGORIES = [
  ...QUICK,
  {
    k: 'AI-Generated Text',
    ref: 'OpenAI. (2026). ChatGPT (Mar 14 version) [Large language model]. https://chat.openai.com',
    it: '(OpenAI, 2026)',
    n: 'Credit the developer as author, date the interaction or model version, provide descriptor in brackets, and detail prompt in text or appendix.',
  },
  {
    k: 'Government / ASQA Report',
    ref: 'Australian Skills Quality Authority. (2025). Standards for RTOs compliance overview (Report No. ASQA-2025-11). AGPS. https://asqa.gov.au/standards',
    it: '(ASQA, 2025)',
    n: 'Use organizational author for official bodies. If abbreviating, spell out the full name in the first in-text mention.',
  },
  {
    k: 'Training Video',
    ref: 'Discovery Library. (2026, February 10). Responsible use of AI in vocational education [Video]. YouTube. https://www.youtube.com/watch?v=dl-ai-vet-2026',
    it: '(Discovery Library, 2026)',
    n: 'Include [Video] after the title in brackets, followed by the hosting platform and URL.',
  },
];

export default function ReferencingPage({ onCopy, onNotify }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Citation Generator State
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('2026');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [url, setUrl] = useState('');
  const [genType, setGenType] = useState('website');

  const curr = CITATION_CATEGORIES[selectedIdx];

  const formattedRef = () => {
    const a = author.trim() || 'Author, A. A.';
    const y = year.trim() || 'n.d.';
    const t = title.trim() || 'Title of document or webpage';
    const s = source.trim() || 'Publisher / Site Name';
    const u = url.trim() ? ` ${url.trim()}` : '';

    if (genType === 'book') {
      return `${a} (${y}). ${t}. ${s}.${u}`;
    }
    if (genType === 'journal') {
      return `${a} (${y}). ${t}. ${s}, 15(2), 101–118.${u}`;
    }
    return `${a} (${y}). ${t}. ${s}.${u}`;
  };

  const formattedInText = () => {
    const a = author.trim() ? author.split(',')[0].trim() : 'Author';
    const y = year.trim() || 'n.d.';
    return `(${a}, ${y})`;
  };

  const handleCopyGenerator = () => {
    const full = formattedRef();
    if (onCopy) onCopy(full);
    else if (onNotify) onNotify('Citation copied to clipboard');
  };

  return (
    <div className="page page-referencing" style={{ paddingTop: 36, paddingBottom: 100 }}>
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
            APA 7th <span className="hl-word hl-gold">Referencing</span> Guide
          </h2>
          <p>
            Standard rules, citation examples, and an interactive generator for Australian vocational students and trainers.
          </p>
        </Reveal>

        {/* Interactive Citation Generator */}
        <Reveal className="glass panel" style={{ marginBottom: 44, padding: '28px 30px', textAlign: 'left' }}>
          <h3 style={{ fontSize: 20, marginBottom: 6, color: 'var(--cream)', fontWeight: 600 }}>
            Quick APA 7th Citation Generator
          </h3>
          <p style={{ color: 'var(--sub)', fontSize: 14, marginBottom: 20 }}>
            Enter your source details to generate formatted Reference List and In-Text citations ready to copy into your report.
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { id: 'website', label: 'Webpage / Online Document' },
              { id: 'journal', label: 'Journal Article' },
              { id: 'book', label: 'Book / eBook' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tab${genType === t.id ? ' on' : ''}`}
                onClick={() => setGenType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--sub)', display: 'block', marginBottom: 4 }}>Author(s)</label>
              <div className="sbox" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="e.g. Smith, J."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--sub)', display: 'block', marginBottom: 4 }}>Year</label>
              <div className="sbox" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--sub)', display: 'block', marginBottom: 4 }}>Title of Work</label>
              <div className="sbox" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="e.g. Principles of VET Assessment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--sub)', display: 'block', marginBottom: 4 }}>Site / Publisher</label>
              <div className="sbox" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="e.g. Discovery Learning Insights"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, color: 'var(--sub)', display: 'block', marginBottom: 4 }}>URL / DOI (Optional)</label>
              <div className="sbox" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="https://doi.org/... or https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Output Preview Box */}
          <div style={{ background: 'rgba(2, 14, 9, 0.55)', border: '1px solid var(--line)', borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Reference List Entry:
              </span>
              <code style={{ display: 'block', background: 'transparent', padding: 0, fontSize: 14, color: 'var(--cream)', lineHeight: 1.5 }}>
                {formattedRef()}
              </code>
            </div>

            <div>
              <span style={{ fontSize: 12, color: 'var(--em)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                In-Text Citation:
              </span>
              <code style={{ display: 'block', background: 'transparent', padding: 0, fontSize: 13.5, color: 'var(--cream)' }}>
                {formattedInText()}
              </code>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SpecularButton
              as="button"
              type="button"
              onClick={handleCopyGenerator}
              className="btn btn-gold btn-sm"
              radius={10}
            >
              <Icon name="copy" /> Copy Reference Entry
            </SpecularButton>
          </div>
        </Reveal>

        {/* Standard APA 7th Examples */}
        <Reveal className="sh" style={{ marginBottom: 20 }}>
          <h2>
            Standard <span className="hl-word hl-em">Examples</span> by Format
          </h2>
          <p>Click on any entry to see formatting rules and copy verified citations.</p>
        </Reveal>

        <div style={{ display: 'grid', gap: 12 }}>
          {CITATION_CATEGORIES.map((item, idx) => (
            <CiteRow
              key={item.k}
              item={item}
              active={idx === selectedIdx}
              onClick={() => setSelectedIdx(idx)}
              onCopy={onCopy}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
