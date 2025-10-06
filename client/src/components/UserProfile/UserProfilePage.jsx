import { useState } from "react";
import { movies } from "@/data/movies";
import UserProfileView from "./UserProfileView.jsx";

/** @typedef {import("./types/pagesProps/UserProfilePageProps").UserProfilePageProps} UserProfilePageProps */

/** @param {UserProfilePageProps} props */
export default function UserProfilePage(props) {
  const {
    user,
    onBack,
    favoriteMovies,
    onClearAllFavorites,
    movieRatings,
    onClearAllRatings,
    watchlistMovies,
    onClearAllWatchlist,
    onRemoveFromWatchlist,
  } = props;

  const [sortBy, setSortBy] = useState("added-desc");
  const [filterGenre, setFilterGenre] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [ratedSortBy, setRatedSortBy] = useState("rated-desc");
  const [filterRating, setFilterRating] = useState("all");
  const [ratedViewMode, setRatedViewMode] = useState("grid");
  const [showRatedDeleteDialog, setShowRatedDeleteDialog] = useState(false);

  // Favorites (εμπλουτισμένα)
  const favoriteMoviesList = favoriteMovies
    .map((favorite) => {
      const movie = movies.find((m) => String(m.id) === String(favorite.movieId));
      if (!movie) return null;
      return {
        id: movie.id,
        title: movie.title,
        year: new Date(movie.releaseDate).getFullYear(),
        poster: movie.posterUrl,
        genre: [movie.genre],
        rating: movie.rating,
        runtime: 120,
        director: "Director Name",
        cast: ["Actor 1", "Actor 2"],
        addedDate: favorite.addedAt.split("T")[0],
      };
    })
    .filter(Boolean);

  // Rated
  const ratedMovies = movieRatings
    .map((rating) => {
      const movie = movies.find((m) => String(m.id) === String(rating.movieId));
      if (!movie) return null;
      return {
        id: movie.id,
        title: movie.title,
        year: new Date(movie.releaseDate).getFullYear(),
        poster: movie.posterUrl,
        genre: [movie.genre],
        tmdbRating: movie.rating,
        runtime: 120,
        director: "Director Name",
        cast: ["Actor 1", "Actor 2"],
        userRating: rating.rating,
        ratedDate: rating.ratedAt.split("T")[0],
      };
    })
    .filter(Boolean);

  // Watchlist
  const watchlistMoviesWithDetails = watchlistMovies
    .map((item) => {
      const movie = movies.find((m) => String(m.id) === String(item.movieId));
      return movie ? { ...movie, addedAt: item.addedAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      const ta = a?.addedAt ? new Date(a.addedAt).getTime() : 0;
      const tb = b?.addedAt ? new Date(b.addedAt).getTime() : 0;
      return tb - ta;
    });

  const userStats = {
    moviesRated: ratedMovies.length,
    favorites: favoriteMoviesList.length,
    watchlistItems: watchlistMoviesWithDetails.length,
    memberSince: "January 2024",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleClearAllFavorites = () => {
    onClearAllFavorites();
    setShowDeleteDialog(false);
  };
  const handleDeleteClick = () => setShowDeleteDialog(true);

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    if (rating >= 4) return "text-orange-600";
    return "text-red-600";
  };
  const getRatingBadgeVariant = (rating) => {
    if (rating >= 8) return "default";
    if (rating >= 6) return "secondary";
    return "outline";
  };

  const handleClearAllRatings = () => {
    onClearAllRatings();
    setShowRatedDeleteDialog(false);
  };
  const handleRatedDeleteClick = () => setShowRatedDeleteDialog(true);

  const handleRemoveFromWatchlist = (movieId) => {
    onRemoveFromWatchlist(movieId);
  };

  const allGenres = Array.from(
    new Set((favoriteMoviesList || []).flatMap((m) => m.genre || []))
  );

  // Filter/sort favorites
  let filteredMovies = favoriteMoviesList;
  if (filterGenre !== "all") {
    filteredMovies = filteredMovies.filter((m) =>
      (m.genre || []).some((g) => g.toLowerCase() === filterGenre.toLowerCase())
    );
  }
  filteredMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "added-desc":
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      case "added-asc":
        return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
      case "rating-desc":
        return b.rating - a.rating;
      case "rating-asc":
        return a.rating - b.rating;
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "year-desc":
        return b.year - a.year;
      case "year-asc":
        return a.year - b.year;
      default:
        return 0;
    }
  });

  // Filter/sort rated
  let filteredRatedMovies = [...ratedMovies];
  if (filterRating !== "all") {
    const minRating = parseInt(filterRating, 10);
    filteredRatedMovies = filteredRatedMovies.filter(
      (m) => m.userRating >= minRating && m.userRating < minRating + 2
    );
  }
  filteredRatedMovies = [...filteredRatedMovies].sort((a, b) => {
    switch (ratedSortBy) {
      case "rated-desc":
        return new Date(b.ratedDate).getTime() - new Date(a.ratedDate).getTime();
      case "rated-asc":
        return new Date(a.ratedDate).getTime() - new Date(b.ratedDate).getTime();
      case "user-rating-desc":
        return b.userRating - a.userRating;
      case "user-rating-asc":
        return a.userRating - b.userRating;
      case "tmdb-rating-desc":
        return b.tmdbRating - a.tmdbRating;
      case "tmdb-rating-asc":
        return a.tmdbRating - b.tmdbRating;
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "year-desc":
        return b.year - a.year;
      case "year-asc":
        return a.year - b.year;
      default:
        return 0;
    }
  });

  const ratingDistribution = Array.from({ length: 10 }, (_, i) => i + 1).map(
    (rating) => ({
      rating,
      count: ratedMovies.filter((m) => m.userRating === rating).length,
    })
  );

  return (
    <UserProfileView
      user={user}
      onBack={onBack}
      userStats={userStats}
      // favorites
      allGenres={allGenres}
      filteredMovies={filteredMovies}
      viewMode={viewMode}
      setViewMode={setViewMode}
      sortBy={sortBy}
      setSortBy={setSortBy}
      filterGenre={filterGenre}
      setFilterGenre={setFilterGenre}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
      handleDeleteClick={handleDeleteClick}
      handleClearAllFavorites={handleClearAllFavorites}
      // rated
      filteredRatedMovies={filteredRatedMovies}
      ratedViewMode={ratedViewMode}
      setRatedViewMode={setRatedViewMode}
      ratedSortBy={ratedSortBy}
      setRatedSortBy={setRatedSortBy}
      filterRating={filterRating}
      setFilterRating={setFilterRating}
      showRatedDeleteDialog={showRatedDeleteDialog}
      setShowRatedDeleteDialog={setShowRatedDeleteDialog}
      handleRatedDeleteClick={handleRatedDeleteClick}
      handleClearAllRatings={handleClearAllRatings}
      ratingDistribution={ratingDistribution}
      getRatingBadgeVariant={getRatingBadgeVariant}
      getRatingColor={getRatingColor}
      // watchlist
      watchlistMoviesWithDetails={watchlistMoviesWithDetails}
      handleRemoveFromWatchlist={handleRemoveFromWatchlist}
      onClearAllWatchlist={onClearAllWatchlist}
      // utils
      formatDate={formatDate}
      formatRuntime={formatRuntime}
    />
  );
}
