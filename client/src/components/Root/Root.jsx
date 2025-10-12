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
    try {
      const [ratingsData, favoritesData, watchlistData] = await Promise.all([
        api.getRatings(),
        api.getFavorites(),
        api.getWatchlist()
      ]);

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
    updateUser(updatedUser);
  };

  // Ratings
  const handleRateMovie = async (movieId, rating) => {
    if (!user) return;

    try {
      await api.rateMovie(parseInt(movieId), rating);

      // Reload ratings from API to get enriched movie data
      const ratingsData = await api.getRatings();
      setMovieRatings(ratingsData.map(r => ({
        ...r,  // Preserve all fields including the nested 'movie' object
        movieId: r.tmdbId.toString(),
        rating: r.rating,
        ratedAt: r.ratedAt
      })));
    } catch (error) {
      console.error('[Root] Rate movie failed:', error);
      throw error;
    }
  };

  const getUserRatingForMovie = (movieId) => {
    const rating = movieRatings.find((r) => r.movieId === movieId);
    return rating ? rating.rating : 0;
  };

  const handleClearAllRatings = async () => {
    if (!user) return;

    try {
      await api.clearAllRatings();
      setMovieRatings([]);
    } catch (error) {
      console.error('[Root] Clear ratings failed:', error);
      throw error;
    }
  };

  // Favorites
  const handleToggleFavorite = async (movieId) => {
    if (!user) return;

    try {
      await api.toggleFavorite(parseInt(movieId));

      // Reload favorites from API to get enriched movie data
      const favoritesData = await api.getFavorites();
      setFavoriteMovies(favoritesData.map(f => ({
        ...f,  // Preserve all movie fields (id, title, posterUrl, rating, etc.)
        movieId: f.id.toString(),
        addedAt: f.addedAt || new Date().toISOString()
      })));
    } catch (error) {
      console.error('[Root] Toggle favorite failed:', error);
      throw error;
    }
  };

  const isMovieFavorite = (movieId) =>
    favoriteMovies.some((f) => f.movieId === movieId);

  const handleClearAllFavorites = async () => {
    if (!user) return;

    try {
      await api.clearAllFavorites();
      setFavoriteMovies([]);
    } catch (error) {
      console.error('[Root] Clear favorites failed:', error);
      throw error;
    }
  };

  // Watchlist
  const handleToggleWatchlist = async (movieId) => {
    if (!user) return;

    try {
      await api.toggleWatchlist(parseInt(movieId));

      // Reload watchlist from API to get enriched movie data
      const watchlistData = await api.getWatchlist();
      setWatchlistMovies(watchlistData.map(w => ({
        ...w,  // Preserve all movie fields (id, title, posterUrl, rating, etc.)
        movieId: w.id.toString(),
        addedAt: w.addedAt || new Date().toISOString()
      })));
    } catch (error) {
      console.error('[Root] Toggle watchlist failed:', error);
      throw error;
    }
  };

  const isMovieInWatchlist = (movieId) =>
    watchlistMovies.some((w) => w.movieId === movieId);

  const handleClearAllWatchlist = async () => {
    if (!user) return;

    try {
      await api.clearAllWatchlist();
      setWatchlistMovies([]);
    } catch (error) {
      console.error('[Root] Clear watchlist failed:', error);
      throw error;
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    if (!user) return;

    try {
      await api.toggleWatchlist(parseInt(movieId));
      setWatchlistMovies((prev) => prev.filter((w) => w.movieId !== movieId));
    } catch (error) {
      console.error('[Root] Remove from watchlist failed:', error);
      throw error;
    }
  };

  // Comments
  const handleLoadComments = async (movieId) => {
    try {
      const comments = await api.getComments(parseInt(movieId));

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
      console.error('[Root] Load comments failed:', error);
      throw error;
    }
  };

  const handleAddComment = async (movieId, content) => {
    if (!user) return;

    try {
      await api.addComment(parseInt(movieId), content);

      // Fetch latest comments from backend after successful post
      const latestComments = await api.getComments(parseInt(movieId));

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
      console.error('[Root] Add comment failed:', error);
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
