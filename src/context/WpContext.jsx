import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  fetchUpcomingSessions,
  fetchTrainingVideos,
  fetchUsefulLinks,
  fetchNewsletters,
  partitionSessions,
  getMergedUpcomingSessions,
  getMergedPreviousSessions,
  getNextUpcomingSession,
  getMergedSearchVideos,
  getStoredWpCache,
  setStoredWpCache,
} from '../services/wpApi';
import {
  FALLBACK_UPCOMING_SESSIONS,
  FALLBACK_PREVIOUS_SESSIONS,
  SEARCH_VIDEOS,
} from '../data/index.js';

const WpContext = createContext({
  loading: true,
  isInitialLoading: true,
  isLiveConnected: false,
  hasLiveUpcomingSessions: false,
  wpSessions: [],
  wpUpcomingSessions: [],
  wpPreviousSessions: [],
  upcomingSessions: [],
  previousSessions: FALLBACK_PREVIOUS_SESSIONS,
  sessions: [],
  nextSession: null,
  wpVideos: [],
  searchVideos: SEARCH_VIDEOS,
  usefulLinks: [],
  newsletters: [],
  refetch: () => {},
});

export function WpProvider({ children }) {
  // Read instant cache synchronously to prevent 1-2s fallback data flash
  const cached = useMemo(() => getStoredWpCache(), []);

  const [loading, setLoading] = useState(!cached);
  const [isLiveConnected, setIsLiveConnected] = useState(!!cached);
  const [wpSessions, setWpSessions] = useState(cached?.sessions || []);
  const [wpVideos, setWpVideos] = useState(cached?.videos || []);
  const [usefulLinks, setUsefulLinks] = useState(cached?.links || []);
  const [newsletters, setNewsletters] = useState(cached?.newsletters || []);

  const loadData = useCallback(async () => {
    try {
      const [sessionsRes, videosRes, linksRes, newsRes] = await Promise.allSettled([
        fetchUpcomingSessions(),
        fetchTrainingVideos(),
        fetchUsefulLinks(),
        fetchNewsletters(),
      ]);

      const liveSessions = sessionsRes.status === 'fulfilled' && sessionsRes.value !== null ? sessionsRes.value : null;
      const liveVideos = videosRes.status === 'fulfilled' && videosRes.value !== null ? videosRes.value : null;
      const liveLinks = linksRes.status === 'fulfilled' && linksRes.value !== null ? linksRes.value : null;
      const liveNews = newsRes.status === 'fulfilled' && newsRes.value !== null ? newsRes.value : null;

      if (liveSessions !== null) {
        setWpSessions(liveSessions);
      }
      if (liveVideos !== null) {
        setWpVideos(liveVideos);
      }
      if (liveLinks !== null) {
        setUsefulLinks(liveLinks);
      }
      if (liveNews !== null) {
        setNewsletters(liveNews);
      }

      const connected =
        (liveSessions !== null && liveSessions.length > 0) ||
        (liveVideos !== null && liveVideos.length > 0) ||
        (liveLinks !== null && liveLinks.length > 0) ||
        (liveNews !== null && liveNews.length > 0);

      if (connected) {
        setIsLiveConnected(true);
      }

      // Save to localStorage cache for instant 0ms subsequent renders
      if (liveSessions !== null) {
        setStoredWpCache({
          sessions: liveSessions,
          videos: liveVideos || [],
          links: liveLinks || [],
          newsletters: liveNews || [],
        });
      }
    } catch (err) {
      console.warn('[WpProvider] Error loading WP content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Partition WP sessions into upcoming and previous
  const { upcoming: wpUpcomingSessions, previous: wpPreviousSessions } = useMemo(
    () => partitionSessions(wpSessions),
    [wpSessions]
  );

  const hasLiveUpcomingSessions = wpUpcomingSessions.length > 0;

  // Merged lists
  const upcomingSessions = useMemo(
    () => getMergedUpcomingSessions(wpSessions, isLiveConnected),
    [wpSessions, isLiveConnected]
  );

  const previousSessions = useMemo(
    () => getMergedPreviousSessions(wpSessions, isLiveConnected),
    [wpSessions, isLiveConnected]
  );

  const currentNextSession = useMemo(
    () => (hasLiveUpcomingSessions ? wpUpcomingSessions[0] : null),
    [hasLiveUpcomingSessions, wpUpcomingSessions]
  );

  const searchVideos = useMemo(
    () => getMergedSearchVideos(wpVideos),
    [wpVideos]
  );

  const value = useMemo(
    () => ({
      loading,
      isInitialLoading: loading && !cached,
      isLiveConnected,
      hasLiveUpcomingSessions,
      wpSessions,
      wpUpcomingSessions,
      wpPreviousSessions,
      upcomingSessions,
      previousSessions,
      sessions: upcomingSessions,
      nextSession: currentNextSession,
      wpVideos,
      searchVideos,
      usefulLinks,
      newsletters,
      refetch: loadData,
    }),
    [
      loading,
      cached,
      isLiveConnected,
      hasLiveUpcomingSessions,
      wpSessions,
      wpUpcomingSessions,
      wpPreviousSessions,
      upcomingSessions,
      previousSessions,
      currentNextSession,
      wpVideos,
      searchVideos,
      usefulLinks,
      newsletters,
      loadData,
    ]
  );

  return <WpContext.Provider value={value}>{children}</WpContext.Provider>;
}

export function useWpData() {
  return useContext(WpContext);
}

export default WpContext;
