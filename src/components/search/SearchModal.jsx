import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import Link from '../ui/Link';
import { SESSIONS as FALLBACK_SESSIONS, SEARCH_VIDEOS as FALLBACK_VIDEOS, SITE_URLS } from '../../data';
import { useWpData } from '../../context/WpContext';

function SearchModal({ open, onClose }) {
  const { searchVideos, sessions } = useWpData();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setTimeout(() => { setQ(''); inputRef.current && inputRef.current.focus(); }, 30); }
  }, [open]);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    const out = [];
    const videoList = searchVideos && searchVideos.length > 0 ? searchVideos : FALLBACK_VIDEOS;
    videoList.forEach(([t, d]) => {
      if (!term || t.toLowerCase().includes(term) || (d && d.toLowerCase().includes(term))) {
        out.push({ type: 'Video', icon: 'play', title: t, desc: d, to: SITE_URLS.videos });
      }
    });
    const sessionList = sessions && sessions.length > 0 ? sessions : FALLBACK_SESSIONS;
    sessionList.forEach((s) => {
      if (!term || s.title.toLowerCase().includes(term)) {
        out.push({ type: `Session: ${s.type}`, icon: 'calendar', title: s.title, desc: `${s.wd} ${s.d} ${s.mon} · ${s.time}`, to: SITE_URLS.sessions });
      }
    });
    return out.slice(0, 8);
  }, [q, searchVideos, sessions]);

  return (
    <div className={`backdrop${open ? ' show' : ''}`} role="dialog" aria-modal="true" aria-labelledby="stitle" aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 id="stitle" style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, marginTop: 0 }}>
            <Icon name="search" className="gold" />Quick Search Library
          </h3>
          <button type="button" onClick={onClose} style={{ color: 'var(--sub)', fontSize: 13.5, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--line)' }}>Esc</button>
        </div>
        <div className="sbox" style={{ marginBottom: 18 }}>
          <Icon name="search" />
          <input ref={inputRef} type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos, sessions, guides..." aria-label="Global search" />
        </div>
        <div style={{ display: 'grid', gap: 8, maxHeight: '50vh', overflowY: 'auto', paddingRight: 4 }}>
          {results.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>No matching library items found for "{q}".</div>
          )}
          {results.map((r, i) => (
            <Link key={i} to={r.to} className="linkrow" onClick={onClose} style={{ background: 'rgba(2,14,9,.4)', borderColor: 'var(--line)', marginBottom: 2 }}>
              <span className="lico" style={{ width: 32, height: 32 }}><Icon name={r.icon} /></span>
              <span className="ltext">
                <h4 style={{ fontSize: 14 }}>{r.title}</h4>
                <p style={{ fontSize: 12.5, color: 'var(--sub)', marginTop: 2 }}>{r.desc}</p>
              </span>
              <span className="ltag" style={{ fontSize: 10 }}>{r.type}</span>
              <span className="lgo"><Icon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;