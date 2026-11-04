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
  upcomingSessions: FALLBACK_UPCOMING_SESSIONS,
  previousSessions: FALLBACK_PREVIOUS_SESSIONS,
  sessions: FALLBACK_UPCOMING_SESSIONS,
  nextSession: FALLBACK_UPCOMING_SESSIONS[0],
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

      const liveSessions = sessionsRes.status === 'fulfilled' ? sessionsRes.value : [];
      const liveVideos = videosRes.status === 'fulfilled' ? videosRes.value : [];
      const liveLinks = linksRes.status === 'fulfilled' ? linksRes.value : [];
      const liveNews = newsRes.status === 'fulfilled' ? newsRes.value : [];

      setWpSessions(liveSessions);
      setWpVideos(liveVideos);
      setUsefulLinks(liveLinks);
      setNewsletters(liveNews);

      const connected =
        liveSessions.length > 0 ||
        liveVideos.length > 0 ||
        liveLinks.length > 0 ||
        liveNews.length > 0;

      setIsLiveConnected(connected);

      // Save to localStorage cache for instant 0ms subsequent renders
      setStoredWpCache({
        sessions: liveSessions,
        videos: liveVideos,
        links: liveLinks,
        newsletters: liveNews,
      });
    } catch (err) {
      console.warn('[WpProvider] Error loading WP content, using fallbacks:', err);
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
    () => getMergedUpcomingSessions(wpSessions),
    [wpSessions]
  );

  const previousSessions = useMemo(
    () => getMergedPreviousSessions(wpSessions),
    [wpSessions]
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
