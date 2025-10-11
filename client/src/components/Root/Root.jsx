import { useState, useEffect } from "react";
import RootView from "./RootView.jsx";
import { AuthProvider, useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";

/**
 * @typedef {"main"|"settings"|"profile"|"feed"|"popular"|"top_rated"|"new_releases"} RootViewName
 */

/** @typedef {import("./components/types/userProfile/user.js").User} User */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").MovieRating} MovieRating */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").FavoriteMovie} FavoriteMovie */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").WatchlistMovie} WatchlistMovie */

function RootContent() {
  const { user, logout: authLogout, updateUser } = useAuth();
  /** @type {[RootViewName, Function]} */
  const [currentView, setCurrentView] = useState("main");
  /** @type {[MovieRating[], Function]} */
  const [movieRatings, setMovieRatings] = useState([]);
  /** @type {[FavoriteMovie[], Function]} */
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  /** @type {[WatchlistMovie[], Function]} */
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [movieComments, setMovieComments] = useState({});
  const [isMoviePopupOpen, setIsMoviePopupOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setMovieRatings([]);
      setFavoriteMovies([]);
      setWatchlistMovies([]);
    }
  }, [user]);

  const loadUserData = async () => {
    console.log('[Root] loadUserData called for user:', user?.email);
    try {
      console.log('[Root] Fetching user data (ratings, favorites, watchlist) in parallel...');
      const [ratingsData, favoritesData, watchlistData] = await Promise.all([
        api.getRatings(),
        api.getFavorites(),
        api.getWatchlist()
      ]);

      console.log('[Root] User data loaded successfully:', {
        ratingsCount: ratingsData?.length,
        favoritesCount: favoritesData?.length,
        watchlistCount: watchlistData?.length
      });

      // Store ALL rating data from API (includes user rating + enriched movie details)
      setMovieRatings(ratingsData.map(r => ({
        ...r,  // Preserve all fields including the nested 'movie' object
        movieId: r.tmdbId.toString(),
        rating: r.rating,
        ratedAt: r.ratedAt
      })));

      // Store ALL movie data from API (enriched with TMDB details)
      setFavoriteMovies(favoritesData.map(f => ({
        ...f,  // Preserve all movie fields (id, title, posterUrl, rating, etc.)
        movieId: f.id.toString(),
        addedAt: f.addedAt || new Date().toISOString()
      })));

      // Store ALL movie data from API (enriched with TMDB details)
      setWatchlistMovies(watchlistData.map(w => ({
        ...w,  // Preserve all movie fields (id, title, posterUrl, rating, etc.)
        movieId: w.id.toString(),
        addedAt: w.addedAt || new Date().toISOString()
      })));
    } catch (error) {
      console.error('[Root] Failed to load user data:', error);
      throw error;
    }
  };

  // Auth
  const handleLogin = (userData) => {
    // User is set via AuthContext
  };

  const handleLogout = () => {
    authLogout();
    setCurrentView("main");
  };

  // Navigation
  const handleNavigateToSettings = () => setCurrentView("settings");
  const handleNavigateToProfile = () => setCurrentView("profile");
  const handleNavigateToFeed = () => setCurrentView("feed");
  const handleNavigateToPopular = () => setCurrentView("popular");
  const handleNavigateToTopRated = () => setCurrentView("top_rated");
  const handleNavigateToNewReleases = () => setCurrentView("new_releases");
  const handleNavigateToMain = () => setCurrentView("main");

  // User updates
  const handleUpdateUser = (updatedUser) => {
    console.log('[Root] handleUpdateUser called:', { updatedUser });
    updateUser(updatedUser);
  };

  // Ratings
  const handleRateMovie = async (movieId, rating) => {
    console.log('[Root] handleRateMovie called:', { movieId, rating, user: user?.email });
    if (!user) {
      console.warn('[Root] handleRateMovie - No user logged in');
      return;
    }

    try {
      await api.rateMovie(parseInt(movieId), rating);
      const newRating = { movieId, rating, ratedAt: new Date().toISOString() };
      console.log('[Root] Movie rated successfully, updating local state:', newRating);
      setMovieRatings((prev) => {
        const idx = prev.findIndex((r) => r.movieId === movieId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = newRating;
          return next;
        }
        return [...prev, newRating];
      });
    } catch (error) {
      console.error('[Root] Failed to rate movie:', { movieId, rating, error });
      throw error;
    }
  };

  const getUserRatingForMovie = (movieId) => {
    const rating = movieRatings.find((r) => r.movieId === movieId);
    return rating ? rating.rating : 0;
  };

  const handleClearAllRatings = async () => {
    console.log('[Root] handleClearAllRatings called, user:', user?.email);
    if (!user) {
      console.warn('[Root] handleClearAllRatings - No user logged in');
      return;
    }

    try {
      await api.clearAllRatings();
      console.log('[Root] All ratings cleared successfully');
      setMovieRatings([]);
    } catch (error) {
      console.error('[Root] Failed to clear ratings:', error);
      throw error;
    }
  };

  // Favorites
  const handleToggleFavorite = async (movieId) => {
    console.log('[Root] handleToggleFavorite called:', { movieId, user: user?.email });
    if (!user) {
      console.warn('[Root] handleToggleFavorite - No user logged in');
      return;
    }

    try {
      await api.toggleFavorite(parseInt(movieId));
      setFavoriteMovies((prev) => {
        const isFavorite = prev.some((f) => f.movieId === movieId);
        console.log('[Root] Toggle favorite successful, updating local state:', { movieId, wasFavorite: isFavorite, nowFavorite: !isFavorite });
        return isFavorite
          ? prev.filter((f) => f.movieId !== movieId)
          : [...prev, { movieId, addedAt: new Date().toISOString() }];
      });
    } catch (error) {
      console.error('[Root] Failed to toggle favorite:', { movieId, error });
      throw error;
    }
  };

  const isMovieFavorite = (movieId) =>
    favoriteMovies.some((f) => f.movieId === movieId);

  const handleClearAllFavorites = async () => {
    console.log('[Root] handleClearAllFavorites called, user:', user?.email);
    if (!user) {
      console.warn('[Root] handleClearAllFavorites - No user logged in');
      return;
    }

    try {
      await api.clearAllFavorites();
      console.log('[Root] All favorites cleared successfully');
      setFavoriteMovies([]);
    } catch (error) {
      console.error('[Root] Failed to clear favorites:', error);
      throw error;
    }
  };

  // Watchlist
  const handleToggleWatchlist = async (movieId) => {
    console.log('[Root] handleToggleWatchlist called:', { movieId, user: user?.email });
    if (!user) {
      console.warn('[Root] handleToggleWatchlist - No user logged in');
      return;
    }

    try {
      await api.toggleWatchlist(parseInt(movieId));
      const isInWatchlist = watchlistMovies.some((w) => w.movieId === movieId);
      console.log('[Root] Toggle watchlist successful, updating local state:', { movieId, wasInWatchlist: isInWatchlist, nowInWatchlist: !isInWatchlist });
      if (isInWatchlist) {
        setWatchlistMovies(watchlistMovies.filter((w) => w.movieId !== movieId));
      } else {
        const newItem = { movieId, addedAt: new Date().toISOString() };
        setWatchlistMovies([...watchlistMovies, newItem]);
      }
    } catch (error) {
      console.error('[Root] Failed to toggle watchlist:', { movieId, error });
      throw error;
    }
  };

  const isMovieInWatchlist = (movieId) =>
    watchlistMovies.some((w) => w.movieId === movieId);

  const handleClearAllWatchlist = async () => {
    console.log('[Root] handleClearAllWatchlist called, user:', user?.email);
    if (!user) {
      console.warn('[Root] handleClearAllWatchlist - No user logged in');
      return;
    }

    try {
      await api.clearAllWatchlist();
      console.log('[Root] All watchlist items cleared successfully');
      setWatchlistMovies([]);
    } catch (error) {
      console.error('[Root] Failed to clear watchlist:', error);
      throw error;
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    console.log('[Root] handleRemoveFromWatchlist called:', { movieId, user: user?.email });
    if (!user) {
      console.warn('[Root] handleRemoveFromWatchlist - No user logged in');
      return;
    }

    try {
      await api.toggleWatchlist(parseInt(movieId));
      console.log('[Root] Movie removed from watchlist successfully:', movieId);
      setWatchlistMovies((prev) => prev.filter((w) => w.movieId !== movieId));
    } catch (error) {
      console.error('[Root] Failed to remove from watchlist:', { movieId, error });
      throw error;
    }
  };

  // Comments
  const handleLoadComments = async (movieId) => {
    console.log('[Root] handleLoadComments called:', { movieId });
    try {
      const comments = await api.getComments(parseInt(movieId));
      console.log('[Root] Comments loaded:', { movieId, count: comments?.length });

      // Map comments to expected format
      const formattedComments = comments.map(comment => ({
        id: comment._id,
        movieId: comment.tmdbId.toString(),
        userId: comment.userId,
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt,
      }));

      setMovieComments((prev) => ({
        ...prev,
        [movieId]: formattedComments
      }));

      return formattedComments;
    } catch (error) {
      console.error('[Root] Failed to load comments:', { movieId, error });
      throw error;
    }
  };

  const handleAddComment = async (movieId, content) => {
    console.log('[Root] handleAddComment called:', { movieId, contentLength: content?.length, user: user?.email });
    if (!user) {
      console.warn('[Root] handleAddComment - No user logged in');
      return;
    }

    try {
      await api.addComment(parseInt(movieId), content);
      console.log('[Root] Comment added successfully, fetching updated comments for movie:', movieId);

      // Fetch latest comments from backend after successful post
      const latestComments = await api.getComments(parseInt(movieId));
      console.log('[Root] Latest comments fetched:', { movieId, count: latestComments?.length });

      // Map comments to expected format
      const formattedComments = latestComments.map(comment => ({
        id: comment._id,
        movieId: comment.tmdbId.toString(),
        userId: comment.userId,
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt,
      }));

      setMovieComments((prev) => ({
        ...prev,
        [movieId]: formattedComments
      }));
    } catch (error) {
      console.error('[Root] Failed to add comment:', { movieId, error });
      throw error;
    }
  };

  // Factory function that returns handlers with movie state update callback
  const createMovieHandlers = (selectedMovieState) => {
    const [selectedMovie, setSelectedMovie] = selectedMovieState;

    return {
      handleRateMovie: async (movieId, rating) => {
        await handleRateMovie(movieId, rating);
        // Update selected movie's userRating field if this is the selected movie
        if (selectedMovie && selectedMovie.id == movieId) {
          setSelectedMovie(prev => ({
            ...prev,
            userRating: rating
          }));
        }
      },

      handleToggleFavorite: async (movieId) => {
        await handleToggleFavorite(movieId);
        // Update selected movie's isFavorite field if this is the selected movie
        if (selectedMovie && selectedMovie.id == movieId) {
          setSelectedMovie(prev => ({
            ...prev,
            isFavorite: !prev.isFavorite
          }));
        }
      },

      handleToggleWatchlist: async (movieId) => {
        await handleToggleWatchlist(movieId);
        // Update selected movie's isInWatchlist field if this is the selected movie
        if (selectedMovie && selectedMovie.id == movieId) {
          setSelectedMovie(prev => ({
            ...prev,
            isInWatchlist: !prev.isInWatchlist
          }));
        }
      }
    };
  };

  return (
    <RootView
      // auth
      user={user}
      onLogin={handleLogin}
      onLogout={handleLogout}
      // nav
      currentView={currentView}
      onNavigateToSettings={handleNavigateToSettings}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToFeed={handleNavigateToFeed}
      onNavigateToPopular={handleNavigateToPopular}
      onNavigateToTopRated={handleNavigateToTopRated}
      onNavigateToNewReleases={handleNavigateToNewReleases}
      onNavigateToMain={handleNavigateToMain}
      // user update
      onUpdateUser={handleUpdateUser}
      // ratings/favorites/watchlist/comments
      movieRatings={movieRatings}
      favoriteMovies={favoriteMovies}
      watchlistMovies={watchlistMovies}
      onClearAllFavorites={handleClearAllFavorites}
      onClearAllRatings={handleClearAllRatings}
      onClearAllWatchlist={handleClearAllWatchlist}
      onRemoveFromWatchlist={handleRemoveFromWatchlist}
      onRateMovie={handleRateMovie}
      getUserRatingForMovie={getUserRatingForMovie}
      onToggleFavorite={handleToggleFavorite}
      isMovieFavorite={isMovieFavorite}
      onToggleWatchlist={handleToggleWatchlist}
      isMovieInWatchlist={isMovieInWatchlist}
      movieComments={movieComments}
      onLoadComments={handleLoadComments}
      onAddComment={handleAddComment}
      // cookie/modal
      isMoviePopupOpen={isMoviePopupOpen}
      onMoviePopupChange={setIsMoviePopupOpen}
      // factory function for creating modal handlers
      createMovieHandlers={createMovieHandlers}
    />
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}
