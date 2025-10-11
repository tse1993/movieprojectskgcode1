import { useState, useEffect } from "react";
import FeedView from "./FeedView.jsx";
import MovieDetailsPage from "../MovieDetails/MovieDetailsPage.jsx";
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
    onRateMovie,
    getUserRatingForMovie,
    onToggleFavorite,
    isMovieFavorite,
    onMoviePopupChange,
    movieComments,
    onLoadComments,
    onAddComment,
    onToggleWatchlist,
    isMovieInWatchlist,
    createMovieHandlers,
  } = props;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const loadFeed = async () => {
      console.log('[FeedPage] loadFeed called - initial load');
      try {
        setLoading(true);
        const data = await api.getFeed(1, 20);
        console.log('[FeedPage] Feed loaded successfully:', { itemsCount: data.items?.length });

        // Get unique movie IDs to avoid duplicate API calls
        const uniqueMovieIds = [...new Set(data.items.map(item => item.tmdbId))];
        console.log('[FeedPage] Fetching details for unique movies:', {
          totalComments: data.items?.length,
          uniqueMovies: uniqueMovieIds.length
        });

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
              console.error('[FeedPage] Failed to load movie details for tmdbId:', tmdbId, error);
              movieDetailsMap[tmdbId] = {
                title: `Movie #${tmdbId}`,
                posterUrl: null,
                releaseYear: null
              };
            }
          })
        );

        console.log('[FeedPage] Movie details fetched for', Object.keys(movieDetailsMap).length, 'unique movies');

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

        console.log('[FeedPage] Feed enriched with movie details:', {
          count: enrichedActivities.length,
          firstActivity: enrichedActivities[0],
          postersWithValues: enrichedActivities.filter(a => a.moviePoster).length
        });
        setActivities(enrichedActivities);

        // Check if more pages exist
        setHasMore(enrichedActivities.length === 20);
        setCurrentPage(1);
      } catch (error) {
        console.error('[FeedPage] Failed to load feed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  const handleLoadMore = async () => {
    console.log('[FeedPage] handleLoadMore called:', { currentPage, hasMore });
    if (!hasMore || loadingMore) {
      console.log('[FeedPage] Skipping load more:', { hasMore, loadingMore });
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      console.log('[FeedPage] Fetching page:', nextPage);

      const data = await api.getFeed(nextPage, 20);
      console.log('[FeedPage] Next page loaded:', { itemsCount: data.items?.length, page: nextPage });

      // Get unique movie IDs to avoid duplicate API calls
      const uniqueMovieIds = [...new Set(data.items.map(item => item.tmdbId))];
      console.log('[FeedPage] Fetching details for unique movies on page', nextPage, ':', {
        totalComments: data.items?.length,
        uniqueMovies: uniqueMovieIds.length
      });

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
            console.error('[FeedPage] Failed to load movie details for tmdbId:', tmdbId, error);
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

      console.log('[FeedPage] Appending', enrichedActivities.length, 'new activities');

      // Append to existing activities
      setActivities(prev => [...prev, ...enrichedActivities]);

      // Check if more pages exist
      setHasMore(enrichedActivities.length === 20);
      setCurrentPage(nextPage);

      console.log('[FeedPage] Load more complete:', {
        totalActivities: activities.length + enrichedActivities.length,
        hasMore: enrichedActivities.length === 20
      });
    } catch (error) {
      console.error('[FeedPage] Failed to load more feed items:', error);
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

  const handleMovieClick = async (tmdbId, movieTitle) => {
    console.log('[FeedPage] handleMovieClick called:', { tmdbId, movieTitle });

    // Set basic movie data immediately so modal can render
    setSelectedMovie({ id: tmdbId, title: movieTitle });
    setIsDetailsOpen(true);
    setIsLoadingDetails(true);
    onMoviePopupChange?.(true);

    try {
      // Fetch full movie details and load comments in parallel
      console.log('[FeedPage] Fetching full movie details and loading comments for:', movieTitle);
      const [fullDetails] = await Promise.all([
        api.getMovieDetails(tmdbId),
        onLoadComments?.(tmdbId)
      ]);

      console.log('[FeedPage] Movie details loaded successfully:', {
        title: fullDetails.title,
        hasTrailer: !!fullDetails.trailerUrl
      });
      setSelectedMovie(fullDetails);
    } catch (error) {
      console.error('[FeedPage] Failed to load movie details:', { tmdbId, movieTitle, error });
      // Keep using basic movie data (already set above)
      console.log('[FeedPage] Using fallback basic movie data');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    console.log('[FeedPage] handleCloseDetails called');
    setIsDetailsOpen(false);
    setSelectedMovie(null);
    onMoviePopupChange?.(false);
  };

  // Get the wrapped handlers from the factory function
  const movieHandlers = createMovieHandlers([selectedMovie, setSelectedMovie]);

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

  const currentUserName =
    user?.name || user?.email?.split("@")[0] || "Anonymous";

  // Extract comments for the selected movie
  const selectedMovieComments = selectedMovie
    ? (movieComments[selectedMovie.id] || [])
    : [];

  return (
    <>
      <FeedView
        user={user}
        onBack={onBack}
        activities={activities}
        formatDate={formatDate}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onMovieClick={handleMovieClick}
      />

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsPage
          movie={selectedMovie}
          isOpen={isDetailsOpen}
          isLoadingDetails={isLoadingDetails}
          onClose={handleCloseDetails}
          onRateMovie={movieHandlers.handleRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={movieHandlers.handleToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          movieComments={selectedMovieComments}
          onAddComment={onAddComment}
          currentUserName={currentUserName}
          onToggleWatchlist={movieHandlers.handleToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      )}
    </>
  );
}
