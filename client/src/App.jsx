import { useState } from "react";
import LoginPage from "./components/Login/LoginPage.jsx";
import MainApp from "./components/Main/MainApp.jsx";
import UserProfilePage from "./components/UserProfile/UserProfilePage.jsx";
import FeedPage from "./components/FeedPage/FeedPage.jsx";
import PopularMoviesPage from "./components/PopularMovies/PopularMoviesPage.jsx";
import TopRatedPage from "./components/TopRated/TopRatedPage.jsx";
import NewReleasesPage from "./components/NewReleases/NewReleasesPage.jsx";
import CookieNotificationPage from "./components/CookieNotification/CookieNotificationPage.jsx";
import SettingsPage from "./components/Settings/SettingsPage.jsx";

/**
 * @typedef {"main"|"settings"|"profile"|"feed"|"popular"|"top_rated"|"new_releases"} AppView
 */

/** @typedef {import("./components/types/userProfile/user").User} User */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").MovieRating} MovieRating */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").FavoriteMovie} FavoriteMovie */
/** @typedef {import("./components/types/movieDisplays/movieIndicators.js").WatchlistMovie} WatchlistMovie */

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("main");
  const [movieRatings, setMovieRatings] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [movieComments, setMovieComments] = useState([
    {
      id: "1",
      movieId: "1",
      userId: "demo@example.com",
      userName: "MovieLover",
      content:
        "Absolutely brilliant movie! The cinematography was stunning and the story kept me on the edge of my seat throughout. Highly recommend this to anyone who enjoys action-packed thrillers.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      movieId: "1",
      userId: "cinephile@example.com",
      userName: "CinemaFan",
      content:
        "Great performances from the entire cast. The plot twists were unexpected and well-executed.",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    },
    {
      id: "3",
      movieId: "2",
      userId: "reviewer@example.com",
      userName: "FilmCritic",
      content:
        "One of the best sci-fi movies I've seen in years. The special effects were mind-blowing and the soundtrack perfectly complemented each scene.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
  ]);
  const [isMoviePopupOpen, setIsMoviePopupOpen] = useState(false);

  const handleLogin = (email) => {
    // In a real app, this would validate credentials
    // For demo purposes, we'll just set the user
    setUser({ email, name: email.split("@")[0] });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("main");
  };

  const handleNavigateToSettings = () => {
    setCurrentView("settings");
  };

  const handleNavigateToProfile = () => {
    setCurrentView("profile");
  };

  const handleNavigateToFeed = () => {
    setCurrentView("feed");
  };

  const handleNavigateToPopular = () => {
    setCurrentView("popular");
  };

  const handleNavigateToTopRated = () => {
    setCurrentView("top_rated");
  };

  const handleNavigateToNewReleases = () => {
    setCurrentView("new_releases");
  };

  const handleNavigateToMain = () => {
    setCurrentView("main");
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  /** @param {string} movieId */
  /** @param {number} rating */
  const handleRateMovie = (movieId, rating) => {
    const newRating = {
      movieId,
      rating,
      ratedAt: new Date().toISOString(),
    };

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

  const handleToggleFavorite = (movieId) => {
    setFavoriteMovies((prev) => {
      const isFavorite = prev.some((f) => f.movieId === movieId);
      return isFavorite
        ? prev.filter((f) => f.movieId !== movieId)
        : [...prev, { movieId, addedAt: new Date().toISOString() }];
    });
  };

  const isMovieFavorite = (movieId) => {
    return favoriteMovies.some((f) => f.movieId === movieId);
  };

  const handleToggleWatchlist = (movieId) => {
    const isInWatchlist = watchlistMovies.some((w) => w.movieId === movieId);

    if (isInWatchlist) {
      // Remove from watchlist
      setWatchlistMovies(watchlistMovies.filter((w) => w.movieId !== movieId));
    } else {
      // Add to watchlist
      const newWatchlistItem = {
        movieId,
        addedAt: new Date().toISOString(),
      };
      setWatchlistMovies([...watchlistMovies, newWatchlistItem]);
    }
  };

  const isMovieInWatchlist = (movieId) =>
    watchlistMovies.some((w) => w.movieId === movieId);

  const handleAddComment = (movieId, content) => {
    const base = {
      id: Date.now().toString(),
      movieId,
      userId: user?.email || "",
      userName:
        user?.name || (user?.email ? user.email.split("@")[0] : "Anonymous"),
      content,
      createdAt: new Date().toISOString(),
    };
    setMovieComments((prev) => [...prev, base]);
  };

  //Αν ο χρήστης δεν έχει μπει
  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <CookieNotificationPage isMoviePopupOpen={isMoviePopupOpen} />
      </>
    );
  }

  //Σε περίπτωση που ο χρήστης κάνει login
  function renderView() {
    switch (currentView) {
      case "main":
        return (
          <MainApp
            user={user}
            onLogout={handleLogout}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToFeed={handleNavigateToFeed}
            onNavigateToPopular={handleNavigateToPopular}
            onNavigateToTopRated={handleNavigateToTopRated}
            onNavigateToNewReleases={handleNavigateToNewReleases}
            onRateMovie={handleRateMovie}
            getUserRatingForMovie={getUserRatingForMovie}
            onToggleFavorite={handleToggleFavorite}
            isMovieFavorite={isMovieFavorite}
            onMoviePopupChange={setIsMoviePopupOpen}
            movieComments={movieComments}
            onAddComment={handleAddComment}
            onToggleWatchlist={handleToggleWatchlist}
            isMovieInWatchlist={isMovieInWatchlist}
          />
        );
      case "settings":
        return (
          <SettingsPage
            user={user}
            onUpdateUser={handleUpdateUser}
            onBack={handleNavigateToMain}
          />
        );
      case "profile":
        return (
          <UserProfilePage
            user={user}
            onBack={handleNavigateToMain}
            favoriteMovies={favoriteMovies}
            onClearAllFavorites={() => setFavoriteMovies([])}
            movieRatings={movieRatings}
            onClearAllRatings={() => setMovieRatings([])}
            watchlistMovies={watchlistMovies}
            onClearAllWatchlist={() => setWatchlistMovies([])}
            onRemoveFromWatchlist={(movieId) =>
              setWatchlistMovies((prev) =>
                prev.filter((w) => w.movieId !== movieId)
              )
            }
          />
        );
      case "feed":
        return <FeedPage user={user} onBack={handleNavigateToMain} />;
      case "popular":
        return (
          <PopularMoviesPage
            user={user}
            onBack={handleNavigateToMain}
            onRateMovie={handleRateMovie}
            getUserRatingForMovie={getUserRatingForMovie}
            onToggleFavorite={handleToggleFavorite}
            isMovieFavorite={isMovieFavorite}
            onMoviePopupChange={setIsMoviePopupOpen}
            movieComments={movieComments}
            onAddComment={handleAddComment}
            onToggleWatchlist={handleToggleWatchlist}
            isMovieInWatchlist={isMovieInWatchlist}
          />
        );
      case "top_rated":
        return (
          <TopRatedPage
            user={user}
            onBack={handleNavigateToMain}
            onRateMovie={handleRateMovie}
            getUserRatingForMovie={getUserRatingForMovie}
            onToggleFavorite={handleToggleFavorite}
            isMovieFavorite={isMovieFavorite}
            onMoviePopupChange={setIsMoviePopupOpen}
            movieComments={movieComments}
            onAddComment={handleAddComment}
            onToggleWatchlist={handleToggleWatchlist}
            isMovieInWatchlist={isMovieInWatchlist}
          />
        );
      case "new_releases":
      default:
        return (
          <NewReleasesPage
            user={user}
            onBack={handleNavigateToMain}
            onRateMovie={handleRateMovie}
            getUserRatingForMovie={getUserRatingForMovie}
            onToggleFavorite={handleToggleFavorite}
            isMovieFavorite={isMovieFavorite}
            onMoviePopupChange={setIsMoviePopupOpen}
            movieComments={movieComments}
            onAddComment={handleAddComment}
            onToggleWatchlist={handleToggleWatchlist}
            isMovieInWatchlist={isMovieInWatchlist}
          />
        );
    }
  }

  return (
    <>
      {renderView()}
      <CookieNotificationPage isMoviePopupOpen={isMoviePopupOpen} />
    </>
  );
}

export default App;
