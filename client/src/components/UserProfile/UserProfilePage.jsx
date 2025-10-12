import { useState } from "react";
import UserProfileView from "./UserProfileView.jsx";
import { api } from "../../services/api.js";

/** @typedef {import("../../assets/types/pagesProps/UserProfilePageProps").UserProfilePageProps} UserProfilePageProps */

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
    onRateMovie,
    getUserRatingForMovie,
    onToggleFavorite,
    isMovieFavorite,
    onToggleWatchlist,
    isMovieInWatchlist,
  } = props;

  const [sortBy, setSortBy] = useState("added-desc");
  const [filterGenre, setFilterGenre] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [ratedSortBy, setRatedSortBy] = useState("rated-desc");
  const [filterRating, setFilterRating] = useState("all");
  const [ratedViewMode, setRatedViewMode] = useState("grid");
  const [showRatedDeleteDialog, setShowRatedDeleteDialog] = useState(false);

  const [showWatchlistDeleteDialog, setShowWatchlistDeleteDialog] = useState(false);

  // Favorites (already enriched from API - using transformed TMDB data)
  const favoriteMoviesList = favoriteMovies.map((favorite) => {
    try {
      if (!favorite) {
        console.error('[UserProfilePage] Favorite is null');
        throw new Error('Favorite object is null or undefined');
      }

      // Use movieId (set by Root.jsx) or fallback to id from API
      const movieId = favorite.movieId || favorite.id;
      if (!movieId) {
        console.error('[UserProfilePage] Favorite missing id:', favorite);
        throw new Error('Favorite missing id field');
      }

      return {
        id: movieId,
        title: favorite.title || 'Unknown Title',
        year: favorite.releaseDate ? new Date(favorite.releaseDate).getFullYear() : 'N/A',
        poster: favorite.posterUrl || '/placeholder.jpg',
        genre: favorite.genre ? [favorite.genre] : [],
        rating: favorite.vote_average || favorite.rating || 0, // Use vote_average from TMDB API
        runtime: favorite.runtime || 120,
        director: favorite.crew ? favorite.crew.find(c => c.job === 'Director')?.name || "Unknown" : "Unknown",
        cast: favorite.cast ? favorite.cast.map(c => c.name) : [],
        addedDate: favorite.addedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        trailerUrl: favorite.trailerUrl, // Pass through trailer URL from API
      };
    } catch (error) {
      console.error('[UserProfilePage] Error processing favorite:', error);
      throw error;
    }
  });

  // Rated (already enriched from API - using transformed TMDB data)
  const ratedMovies = movieRatings.map((rating) => {
    try {
      if (!rating) {
        console.error('[UserProfilePage] Rating is null');
        throw new Error('Rating object is null or undefined');
      }

      if (!rating.tmdbId && !rating.movie?.id) {
        console.error('[UserProfilePage] Rating missing id:', rating);
        throw new Error('Rating missing id fields');
      }

      return {
        id: rating.movie?.id || rating.tmdbId,
        title: rating.movie?.title || 'Unknown Movie',
        year: rating.movie?.releaseDate ? new Date(rating.movie.releaseDate).getFullYear() : 'N/A',
        poster: rating.movie?.posterUrl || '/placeholder.jpg',
        genre: rating.movie?.genre ? [rating.movie.genre] : [],
        tmdbRating: rating.movie?.vote_average || rating.movie?.rating || 0, // Fix: use vote_average
        runtime: rating.movie?.runtime || 120,
        director: rating.movie?.crew ? rating.movie.crew.find(c => c.job === 'Director')?.name || "Unknown" : "Unknown",
        cast: rating.movie?.cast ? rating.movie.cast.map(c => c.name) : [],
        userRating: rating.rating,
        ratedDate: rating.ratedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        trailerUrl: rating.movie?.trailerUrl, // Pass through trailer URL
      };
    } catch (error) {
      console.error('[UserProfilePage] Error processing rating:', error);
      throw error;
    }
  });

  // Watchlist (already enriched from API - using transformed TMDB data)
  const watchlistMoviesWithDetails = watchlistMovies
    .map((item) => {
      try {
        if (!item) {
          console.error('[UserProfilePage] Watchlist item is null');
          throw new Error('Watchlist item is null or undefined');
        }

        // Use movieId (set by Root.jsx) or fallback to id from API
        const movieId = item.movieId || item.id;
        if (!movieId) {
          console.error('[UserProfilePage] Watchlist item missing id:', item);
          throw new Error('Watchlist item missing id field');
        }

        return {
          id: movieId,
          title: item.title || 'Unknown Title',
          posterUrl: item.posterUrl || (item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '/placeholder.jpg'), // Fix poster URL with proper fallback
          rating: item.vote_average || item.rating || 0, // Use vote_average from TMDB API
          releaseDate: item.releaseDate || item.release_date,
          genre: item.genre || 'Unknown',
          overview: item.overview || 'No overview available',
          addedAt: item.addedAt,
          trailerUrl: item.trailerUrl, // Pass through trailer URL
        };
      } catch (error) {
        console.error('[UserProfilePage] Error processing watchlist item:', error);
        throw error;
      }
    })
    .sort((a, b) => {
      try {
        const ta = a?.addedAt ? new Date(a.addedAt).getTime() : 0;
        const tb = b?.addedAt ? new Date(b.addedAt).getTime() : 0;
        return tb - ta;
      } catch (error) {
        console.error('[UserProfilePage] Error sorting watchlist:', error);
        return 0;
      }
    });

  // Format member since date from user.createdAt
  const formatMemberSince = () => {
    if (!user?.createdAt) return 'Unknown';

    try {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      console.error('[UserProfilePage] Error formatting date:', error);
      return 'Unknown';
    }
  };

  const userStats = {
    moviesRated: ratedMovies.length,
    favorites: favoriteMoviesList.length,
    watchlistItems: watchlistMoviesWithDetails.length,
    memberSince: formatMemberSince(),
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
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

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
  const handleRatedDeleteClick = () => {
    setShowRatedDeleteDialog(true);
  };

  const handleRemoveFromWatchlist = (movieId) => {
    onRemoveFromWatchlist(movieId);
  };

  const handleClearAllWatchlist = () => {
    onClearAllWatchlist();
    setShowWatchlistDeleteDialog(false);
  };

  const handleWatchlistDeleteClick = () => {
    setShowWatchlistDeleteDialog(true);
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
  let filteredRatedMovies = [];
  try {
    filteredRatedMovies = [...ratedMovies];

    if (filterRating !== "all") {
      const minRating = parseInt(filterRating, 10);

      if (isNaN(minRating)) {
        console.error('[UserProfilePage] Invalid filter rating:', filterRating);
        throw new Error(`Invalid filter rating: ${filterRating}`);
      }

      filteredRatedMovies = filteredRatedMovies.filter((m) => {
        return m.userRating >= minRating && m.userRating < minRating + 2;
      });
    }

    filteredRatedMovies = [...filteredRatedMovies].sort((a, b) => {
      try {
        switch (ratedSortBy) {
          case "rated-desc":
            return new Date(b.ratedDate).getTime() - new Date(a.ratedDate).getTime();
          case "rated-asc":
            return new Date(a.ratedDate).getTime() - new Date(b.ratedDate).getTime();
          case "user-rating-desc":
            return (b.userRating || 0) - (a.userRating || 0);
          case "user-rating-asc":
            return (a.userRating || 0) - (b.userRating || 0);
          case "tmdb-rating-desc":
            return (b.tmdbRating || 0) - (a.tmdbRating || 0);
          case "tmdb-rating-asc":
            return (a.tmdbRating || 0) - (b.tmdbRating || 0);
          case "title-asc":
            return (a.title || '').localeCompare(b.title || '');
          case "title-desc":
            return (b.title || '').localeCompare(a.title || '');
          case "year-desc":
            return (b.year === 'N/A' ? 0 : b.year) - (a.year === 'N/A' ? 0 : a.year);
          case "year-asc":
            return (a.year === 'N/A' ? 0 : a.year) - (b.year === 'N/A' ? 0 : b.year);
          default:
            return 0;
        }
      } catch (error) {
        console.error('[UserProfilePage] Error sorting rated movies:', error);
        return 0;
      }
    });
  } catch (error) {
    console.error('[UserProfilePage] Error filtering/sorting rated movies:', error);
    filteredRatedMovies = [...ratedMovies]; // Fallback to unfiltered
  }

  const ratingDistribution = Array.from({ length: 10 }, (_, i) => i + 1).map(
    (rating) => ({
      rating,
      count: ratedMovies.filter((m) => m.userRating === rating).length,
    })
  );

  // Movie click handler - fetch full details and show modal

  const currentUserName = user?.name || user?.email?.split("@")[0] || "Anonymous";

  return (
    <>
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
        totalRatedMovies={ratedMovies.length}  // Total unfiltered count
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
        showWatchlistDeleteDialog={showWatchlistDeleteDialog}
        setShowWatchlistDeleteDialog={setShowWatchlistDeleteDialog}
        handleWatchlistDeleteClick={handleWatchlistDeleteClick}
        handleClearAllWatchlist={handleClearAllWatchlist}
        // utils
        formatDate={formatDate}
        formatRuntime={formatRuntime}
      />
    </>
  );
}
