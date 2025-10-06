import LoginPage from "../Login/LoginPage.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import UserProfilePage from "../UserProfile/UserProfilePage.jsx";
import FeedPage from "../FeedPage/FeedPage.jsx";
import PopularMoviesPage from "../PopularMovies/PopularMoviesPage.jsx";
import TopRatedPage from "../TopRated/TopRatedPage.jsx";
import NewReleasesPage from "../NewReleases/NewReleasesPage.jsx";
import CookieNotificationPage from "../CookieNotification/CookieNotificationPage.jsx";
import SettingsPage from "../Settings/SettingsPage.jsx";

/** @typedef {import("../../assets/types/pagesProps/rootViewProps").RootViewProps} RootViewProps */

/** @param {RootViewProps} props */
export default function AppView(props) {
  const {
    user,
    onLogin,
    onLogout,
    currentView,
    onNavigateToSettings,
    onNavigateToProfile,
    onNavigateToFeed,
    onNavigateToPopular,
    onNavigateToTopRated,
    onNavigateToNewReleases,
    onNavigateToMain,
    onUpdateUser,

    movieRatings,
    favoriteMovies,
    watchlistMovies,
    onClearAllFavorites,
    onClearAllRatings,
    onClearAllWatchlist,
    onRemoveFromWatchlist,

    onRateMovie,
    getUserRatingForMovie,
    onToggleFavorite,
    isMovieFavorite,
    onToggleWatchlist,
    isMovieInWatchlist,

    movieComments,
    onAddComment,

    isMoviePopupOpen,
    onMoviePopupChange,
  } = props;

  // Αν ο χρήστης δεν έχει μπει
  if (!user) {
    return (
      <>
        <LoginPage onLogin={onLogin} />
        <CookieNotificationPage isMoviePopupOpen={isMoviePopupOpen} />
      </>
    );
  }

  // Router-like rendering
  let view = null;
  switch (currentView) {
    case "main":
      view = (
        <Dashboard
          user={user}
          onLogout={onLogout}
          onNavigateToSettings={onNavigateToSettings}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToFeed={onNavigateToFeed}
          onNavigateToPopular={onNavigateToPopular}
          onNavigateToTopRated={onNavigateToTopRated}
          onNavigateToNewReleases={onNavigateToNewReleases}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          onMoviePopupChange={onMoviePopupChange}
          movieComments={movieComments}
          onAddComment={onAddComment}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      );
      break;

    case "settings":
      view = (
        <SettingsPage
          user={user}
          onUpdateUser={onUpdateUser}
          onBack={onNavigateToMain}
        />
      );
      break;

    case "profile":
      view = (
        <UserProfilePage
          user={user}
          onBack={onNavigateToMain}
          favoriteMovies={favoriteMovies}
          onClearAllFavorites={onClearAllFavorites}
          movieRatings={movieRatings}
          onClearAllRatings={onClearAllRatings}
          watchlistMovies={watchlistMovies}
          onClearAllWatchlist={onClearAllWatchlist}
          onRemoveFromWatchlist={onRemoveFromWatchlist}
        />
      );
      break;

    case "feed":
      view = <FeedPage user={user} onBack={onNavigateToMain} />;
      break;

    case "popular":
      view = (
        <PopularMoviesPage
          user={user}
          onBack={onNavigateToMain}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          onMoviePopupChange={onMoviePopupChange}
          movieComments={movieComments}
          onAddComment={onAddComment}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      );
      break;

    case "top_rated":
      view = (
        <TopRatedPage
          user={user}
          onBack={onNavigateToMain}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          onMoviePopupChange={onMoviePopupChange}
          movieComments={movieComments}
          onAddComment={onAddComment}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      );
      break;

    case "new_releases":
    default:
      view = (
        <NewReleasesPage
          user={user}
          onBack={onNavigateToMain}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          onMoviePopupChange={onMoviePopupChange}
          movieComments={movieComments}
          onAddComment={onAddComment}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      );
      break;
  }

  return (
    <>
      {view}
      <CookieNotificationPage isMoviePopupOpen={isMoviePopupOpen} />
    </>
  );
}
