import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { WpProvider } from './context/WpContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import Icon from './components/ui/Icon';
import Backdrop from './components/layout/Backdrop';
import AmbientScene from './components/three/AmbientScene';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SearchModal from './components/search/SearchModal';

import Homepage from './pages/Homepage';
import SessionsPage from './pages/SessionsPage';
import VideosPage from './pages/VideosPage';
import ResourcesPage from './pages/ResourcesPage';
import UsefulLinksPage from './pages/UsefulLinksPage';
import ReferencingPage from './pages/ReferencingPage';
import NewsletterPage from './pages/NewsletterPage';
import ContactPage from './pages/ContactPage';
import RecordingsPage from './pages/RecordingsPage';
import LlndPage from './pages/LlndPage';

function AppLayout() {
  const { currentRoute } = useRouter();
  const progressRef = useRef(null);
  const mainRef = useRef(null);
  const footRef = useRef(null);
  const toastTimer = useRef(0);

  const [scrolled, setScrolled] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const notify = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }, []);

  const copyText = useCallback((txt) => {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(fallback);
    else fallback();
    notify('Citation copied to clipboard');
  }, [notify]);

  // Document Title update on route change
  useEffect(() => {
    const clean = currentRoute.replace(/^[#/]+/, '').toLowerCase();
    const titles = {
      '': 'Discovery Library — Comprehensive Digital Library & Learning Support',
      'home': 'Discovery Library — Comprehensive Digital Library & Learning Support',
      'resources': 'Library Resources & Directory — Discovery Library',
      'useful-links': 'Useful Links & Videos Directory — Discovery Library',
      'links': 'Useful Links & Videos Directory — Discovery Library',
      'videos': 'Training Videos & Masterclasses — Discovery Library',
      'sessions': 'Workshops & Upcoming Sessions — Discovery Library',
      'recordings': 'Previous Recorded Sessions Archive — Discovery Library',
      'referencing': 'APA 7th Referencing Guide & Citation Generator — Discovery Library',
      'newsletter': 'The Discovery Herald Newsletters — Discovery Library',
      'contact': 'Contact Us & Campus Library Hubs — Discovery Library',
      'llnd': 'My LLND Learning Support Portal — Discovery Library',
    };
    document.title = titles[clean] || 'Discovery Library — Comprehensive Digital Library & Learning Support';
  }, [currentRoute]);

  // Scroll Progress
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const pct = max > 0 ? (y / max) * 100 : 0;
          if (progressRef.current) progressRef.current.style.width = `${pct}%`;
          setScrolled(y > 20);
          setCueHidden(y > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search modal
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Modal / drawer scroll lock
  useEffect(() => {
    const blocked = menuOpen || searchOpen;
    document.body.style.overflow = blocked ? 'hidden' : '';
    [mainRef.current, footRef.current].forEach((el) => {
      if (!el) return;
      if (blocked) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Route View Resolver
  const activePageComponent = useMemo(() => {
    const clean = currentRoute.replace(/^[#/]+/, '').toLowerCase();
    if (!clean || clean === 'home') {
      return <Homepage cueHidden={cueHidden} onCopy={copyText} />;
    }
    if (clean.includes('link') || clean.startsWith('useful-link')) {
      return <UsefulLinksPage onNotify={notify} />;
    }
    if (clean.startsWith('resource')) {
      return <ResourcesPage onNotify={notify} />;
    }
    if (clean.startsWith('video')) {
      return <VideosPage onNotify={notify} />;
    }
    if (clean.startsWith('session')) {
      return <SessionsPage scrollTo="upcoming" onNotify={notify} />;
    }
    if (clean.startsWith('record')) {
      return <SessionsPage scrollTo="recordings" onNotify={notify} />;
    }
    if (clean.startsWith('referenc')) {
      return <ReferencingPage onCopy={copyText} onNotify={notify} />;
    }
    if (clean.startsWith('newsletter')) {
      return <NewsletterPage onNotify={notify} />;
    }
    if (clean.startsWith('contact') || clean.startsWith('consult')) {
      return <ContactPage onNotify={notify} />;
    }
    if (clean.startsWith('llnd')) {
      return <LlndPage onNotify={notify} />;
    }

    return <Homepage cueHidden={cueHidden} onCopy={copyText} />;
  }, [currentRoute, cueHidden, copyText, notify]);

  return (
    <div className="dl-app">
      <div id="scrollProgress" ref={progressRef} />
      {/* Background stays active and smoothly animated across all page navigations */}
      <Backdrop />
      <AmbientScene />

      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onSearch={() => setSearchOpen(true)}
        currentRoute={currentRoute}
      />

      <main id="view" ref={mainRef} tabIndex={-1}>
        {activePageComponent}
      </main>

      <div ref={footRef}>
        <Footer />
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className={`toast${toast.show ? ' show' : ''}`} role="status" aria-live="polite">
        <Icon name="check" />
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WpProvider>
      <RouterProvider>
        <AppLayout />
      </RouterProvider>
    </WpProvider>
  );
}