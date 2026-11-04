import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const RouterContext = createContext({
  currentRoute: '/',
  navigate: () => {},
});

function getRouteFromLocation() {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash;
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '/');
    if (cleanHash && cleanHash !== '/') return cleanHash;
  }
  const path = window.location.pathname;
  if (path && path !== '/') {
    return path;
  }
  return '/';
}

export function RouterProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromLocation);

  const navigate = useCallback((to) => {
    if (!to) return;
    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('tel:')) {
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }

    let clean = to;
    if (clean.startsWith('#')) clean = clean.replace(/^#\/?/, '/');
    if (!clean.startsWith('/')) clean = '/' + clean;

    setCurrentRoute(clean);
    if (window.location.hash !== `#${clean}`) {
      window.location.hash = `#${clean}`;
    }
    if (!clean.includes('#')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const r = getRouteFromLocation();
      setCurrentRoute(r);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export default RouterContext;
