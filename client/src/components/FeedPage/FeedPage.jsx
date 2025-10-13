import { useState, useEffect } from "react";
import FeedView from "./FeedView.jsx";
import { api } from "../../services/api.js";

/** @typedef {import("../../assets/types/pagesProps/feedPageProps").FeedPageProps} FeedPageProps */

/**
 * Container: κρατάει το minimal logic (formatDate) και τα δεδομένα από το API
 * και τα περνάει στο view.
 * @param {FeedPageProps} props
 */
export default function FeedPage(props) {
  const {
    user,
    onBack,
  } = props;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newActivityCount, setNewActivityCount] = useState(0);

  // User profile modal state
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);

  // Extract feed loading logic to reusable function
  const loadFeedData = async () => {
    try {
      setLoading(true);
      const data = await api.getFeed(1, 20);

      // Get unique movie IDs to avoid duplicate API calls
      const uniqueMovieIds = [...new Set(data.items.map(item => item.tmdbId))];

      // Fetch movie details for unique movies only (in parallel)
      const movieDetailsMap = {};
      await Promise.all(
        uniqueMovieIds.map(async (tmdbId) => {
          try {
            const movieDetails = await api.getMovieDetails(tmdbId);
            movieDetailsMap[tmdbId] = {
              title: movieDetails.title || 'Unknown Movie',
              posterUrl: movieDetails.posterUrl || null,
              releaseYear: movieDetails.releaseDate
                ? new Date(movieDetails.releaseDate).getFullYear()
                : null
            };
          } catch (error) {
            console.error('[FeedPage] Load movie details failed:', error);
            movieDetailsMap[tmdbId] = {
              title: `Movie #${tmdbId}`,
              posterUrl: null,
              releaseYear: null
            };
          }
        })
      );

      // Enrich feed items using the cached movie details
      const enrichedActivities = data.items.map((item) => {
        const movieData = movieDetailsMap[item.tmdbId] || {
          title: 'Unknown Movie',
          posterUrl: null,
          releaseYear: null
        };

        return {
          ...item,
          movieTitle: movieData.title,
          moviePoster: movieData.posterUrl,
          movieYear: movieData.releaseYear
        };
      });

      setActivities(enrichedActivities);

      // Check if more pages exist
      setHasMore(enrichedActivities.length === 20);
      setCurrentPage(1);
    } catch (error) {
      console.error('[FeedPage] Load feed failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();

    // Set up SSE connection for live updates
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${API_BASE_URL}/feed?stream=true`);

    eventSource.onopen = () => {
      console.log('[FeedPage] SSE connection established');
    };

    eventSource.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'connected') {
          console.log('[FeedPage] SSE stream active');
        } else if (data.type === 'update' && data.items && data.items.length > 0) {
          console.log('[FeedPage] New activity detected:', data.count, 'items');

          // Fetch movie details for new comments
          const uniqueMovieIds = [...new Set(data.items.map(item => item.tmdbId))];
          const movieDetailsMap = {};

          await Promise.all(
            uniqueMovieIds.map(async (tmdbId) => {
              try {
                const movieDetails = await api.getMovieDetails(tmdbId);
                movieDetailsMap[tmdbId] = {
                  title: movieDetails.title || 'Unknown Movie',
                  posterUrl: movieDetails.posterUrl || null,
                  releaseYear: movieDetails.releaseDate
                    ? new Date(movieDetails.releaseDate).getFullYear()
                    : null
                };
              } catch (error) {
                console.error('[FeedPage] Load movie details failed:', error);
                movieDetailsMap[tmdbId] = {
                  title: `Movie #${tmdbId}`,
                  posterUrl: null,
                  releaseYear: null
                };
              }
            })
          );

          // Enrich new activities
          const enrichedNewActivities = data.items.map((item) => {
            const movieData = movieDetailsMap[item.tmdbId] || {
              title: 'Unknown Movie',
              posterUrl: null,
              releaseYear: null
            };

            return {
              ...item,
              movieTitle: movieData.title,
              moviePoster: movieData.posterUrl,
              movieYear: movieData.releaseYear
            };
          });

          // Add to top of activities list
          setActivities(prev => [...enrichedNewActivities, ...prev]);
          setNewActivityCount(prev => prev + data.count);
        }
      } catch (error) {
        console.error('[FeedPage] SSE message parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[FeedPage] SSE connection error:', error);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      console.log('[FeedPage] Closing SSE connection');
      eventSource.close();
    };
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const data = await api.getFeed(nextPage, 20);

      // Get unique movie IDs to avoid duplicate API calls
      const uniqueMovieIds = [...new Set(data.items.map(item => item.tmdbId))];

      // Fetch movie details for unique movies only (in parallel)
      const movieDetailsMap = {};
      await Promise.all(
        uniqueMovieIds.map(async (tmdbId) => {
          try {
            const movieDetails = await api.getMovieDetails(tmdbId);
            movieDetailsMap[tmdbId] = {
              title: movieDetails.title || 'Unknown Movie',
              posterUrl: movieDetails.posterUrl || null,
              releaseYear: movieDetails.releaseDate
                ? new Date(movieDetails.releaseDate).getFullYear()
                : null
            };
          } catch (error) {
            console.error('[FeedPage] Load movie details failed:', error);
            movieDetailsMap[tmdbId] = {
              title: `Movie #${tmdbId}`,
              posterUrl: null,
              releaseYear: null
            };
          }
        })
      );

      // Enrich feed items using the cached movie details
      const enrichedActivities = data.items.map((item) => {
        const movieData = movieDetailsMap[item.tmdbId] || {
          title: 'Unknown Movie',
          posterUrl: null,
          releaseYear: null
        };

        return {
          ...item,
          movieTitle: movieData.title,
          moviePoster: movieData.posterUrl,
          movieYear: movieData.releaseYear
        };
      });

      // Append to existing activities
      setActivities(prev => [...prev, ...enrichedActivities]);

      // Check if more pages exist
      setHasMore(enrichedActivities.length === 20);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('[FeedPage] Load more failed:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    await loadFeedData();
    setNewActivityCount(0); // Clear new activity indicator
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error('[FeedPage] Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Handle user profile click
  const handleUserClick = async (userId) => {
    if (!userId) return;

    setSelectedUserId(userId);
    setIsUserModalOpen(true);
    setIsLoadingUserProfile(true);
    setSelectedUserProfile(null);

    try {
      const profile = await api.getUserPublicProfile(userId);
      setSelectedUserProfile(profile);
    } catch (error) {
      console.error('[FeedPage] Load user profile failed:', error);
    } finally {
      setIsLoadingUserProfile(false);
    }
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserProfile(null);
    setIsLoadingUserProfile(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <FeedView
      user={user}
      onBack={onBack}
      activities={activities}
      formatDate={formatDate}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onRefresh={handleRefresh}
      loading={loading}
      newActivityCount={newActivityCount}
      onUserClick={handleUserClick}
      selectedUserProfile={selectedUserProfile}
      isUserModalOpen={isUserModalOpen}
      isLoadingUserProfile={isLoadingUserProfile}
      onCloseUserModal={handleCloseUserModal}
    />
  );
}
