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

  useEffect(() => {
    const loadFeed = async () => {
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

    loadFeed();
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
    />
  );
}
