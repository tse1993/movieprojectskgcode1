import { useState } from "react";
import RootView from "./RootView.jsx";

/**
 * @typedef {"main"|"settings"|"profile"|"feed"|"popular"|"top_rated"|"new_releases"} RootViewName
 */

/** @typedef {import("./components/types/userProfile/user.js").User} User */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").MovieRating} MovieRating */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").FavoriteMovie} FavoriteMovie */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").WatchlistMovie} WatchlistMovie */

export default function Root() {
  /** @type {[User|null, Function]} */
  const [user, setUser] = useState(null);
  /** @type {[RootViewName, Function]} */
  const [currentView, setCurrentView] = useState("main");
  /** @type {[MovieRating[], Function]} */
  const [movieRatings, setMovieRatings] = useState([]);
  /** @type {[FavoriteMovie[], Function]} */
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  /** @type {[WatchlistMovie[], Function]} */
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [movieComments, setMovieComments] = useState([
    {
      id: "1",
      movieId: "1",
      userId: "demo@example.com",
      userName: "MovieLover",
      content:
        "Absolutely brilliant movie! The cinematography was stunning and the story kept me on the edge of my seat throughout. Highly recommend this to anyone who enjoys action-packed thrillers.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      movieId: "1",
      userId: "cinephile@example.com",
      userName: "CinemaFan",
      content:
        "Great performances from the entire cast. The plot twists were unexpected and well-executed.",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      movieId: "2",
      userId: "reviewer@example.com",
      userName: "FilmCritic",
      content:
        "One of the best sci-fi movies I've seen in years. The special effects were mind-blowing and the soundtrack perfectly complemented each scene.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]);
  const [isMoviePopupOpen, setIsMoviePopupOpen] = useState(false);

  // Auth
  const handleLogin = (email) => {
    setUser({ email, name: email.split("@")[0] });
  };
  const handleLogout = () => {
    setUser(null);
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
  const handleUpdateUser = (updatedUser) => setUser(updatedUser);

  // Ratings
  const handleRateMovie = (movieId, rating) => {
    const newRating = { movieId, rating, ratedAt: new Date().toISOString() };
    setMovieRatings((prev) => {
      const idx = prev.findIndex((r) => r.movieId === movieId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newRating;
        return next;
      }
      return [...prev, newRating];
    });
  };
  const getUserRatingForMovie = (movieId) => {
    const rating = movieRatings.find((r) => r.movieId === movieId);
    return rating ? rating.rating : 0;
  };
  const handleClearAllRatings = () => setMovieRatings([]);

  // Favorites
  const handleToggleFavorite = (movieId) => {
    setFavoriteMovies((prev) => {
      const isFavorite = prev.some((f) => f.movieId === movieId);
      return isFavorite
        ? prev.filter((f) => f.movieId !== movieId)
        : [...prev, { movieId, addedAt: new Date().toISOString() }];
    });
  };
  const isMovieFavorite = (movieId) =>
    favoriteMovies.some((f) => f.movieId === movieId);
  const handleClearAllFavorites = () => setFavoriteMovies([]);

  // Watchlist
  const handleToggleWatchlist = (movieId) => {
    const isInWatchlist = watchlistMovies.some((w) => w.movieId === movieId);
    if (isInWatchlist) {
      setWatchlistMovies(watchlistMovies.filter((w) => w.movieId !== movieId));
    } else {
      const newItem = { movieId, addedAt: new Date().toISOString() };
      setWatchlistMovies([...watchlistMovies, newItem]);
    }
  };
  const isMovieInWatchlist = (movieId) =>
    watchlistMovies.some((w) => w.movieId === movieId);
  const handleClearAllWatchlist = () => setWatchlistMovies([]);
  const handleRemoveFromWatchlist = (movieId) =>
    setWatchlistMovies((prev) => prev.filter((w) => w.movieId !== movieId));

  // Comments
  const handleAddComment = (movieId, content) => {
    const base = {
      id: Date.now().toString(),
      movieId,
      userId: user?.email || "",
      userName: user?.name || (user?.email ? user.email.split("@")[0] : "Anonymous"),
      content,
      createdAt: new Date().toISOString(),
    };
    setMovieComments((prev) => [...prev, base]);
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
      onAddComment={handleAddComment}
      // cookie/modal
      isMoviePopupOpen={isMoviePopupOpen}
      onMoviePopupChange={setIsMoviePopupOpen}
    />
  );
}
