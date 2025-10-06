import { useState } from "react";
import DashboardView from "./DashboardView.jsx";

import {
  movies,
  genres,
  getMoviesByGenre,
  searchMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNewReleases,
} from "../../data/movies.js";

// @ts-check
/** @typedef {import("../../assets/types/pagesProps/DashboardProps.js").DashboardProps} DashboardProps */

/**
 * Container: κρατά state/handlers & περνά δεδομένα στο View.
 * @param {DashboardProps} props
 */
export default function Dashboard(props) {
  const {
    user,
    onLogout,
    onNavigateToSettings,
    onNavigateToProfile,
    onNavigateToFeed,
    onNavigateToPopular,
    onNavigateToTopRated,
    onNavigateToNewReleases,
    onRateMovie,
    getUserRatingForMovie,
    onToggleFavorite,
    isMovieFavorite,
    onMoviePopupChange,
    movieComments,
    onAddComment,
    onToggleWatchlist,
    isMovieInWatchlist,
  } = props;

  // state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // featured (πρώτη ταινία)
  const featuredMovie = movies[0] || null;

  /** @typedef {{id:number,title:string,posterUrl:string,rating:number,releaseDate:string,genre:string,overview:string}} Movie */

  /** @param {Movie} movie */
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
    onMoviePopupChange?.(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedMovie(null);
    onMoviePopupChange?.(false);
  };

  /** @param {string} query */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre("All");
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setSearchQuery(""); // reset search όταν αλλάζει το genre
  };

  // Φιλτράρισμα με βάση search ή genre
  const filteredMovies = searchQuery
    ? searchMovies(searchQuery)
    : getMoviesByGenre(selectedGenre);

  // Αν δείχνουμε "All" και δεν υπάρχει search, βγάλε το featured (πρώτο)
  const gridMovies =
    selectedGenre === "All" && !searchQuery
      ? filteredMovies.slice(1)
      : filteredMovies;

  // precomputed sections
  const popularMovies = getPopularMovies();
  const topRatedMovies = getTopRatedMovies();
  const newReleases = getNewReleases();

  const currentUserName =
    user?.name || user?.email?.split("@")[0] || "Anonymous";

  return (
    <DashboardView
      /* user + nav */
      user={user}
      onLogout={onLogout}
      onNavigateToSettings={onNavigateToSettings}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToFeed={onNavigateToFeed}
      onNavigateToPopular={onNavigateToPopular}
      onNavigateToTopRated={onNavigateToTopRated}
      onNavigateToNewReleases={onNavigateToNewReleases}
      /* filters */
      searchQuery={searchQuery}
      selectedGenre={selectedGenre}
      onSearch={handleSearch}
      onGenreChange={handleGenreChange}
      genres={genres}
      /* movies data */
      featuredMovie={featuredMovie}
      popularMovies={popularMovies}
      topRatedMovies={topRatedMovies}
      newReleases={newReleases}
      gridMovies={gridMovies}
      /* actions */
      onMovieClick={handleMovieClick}
      onRateMovie={onRateMovie}
      getUserRatingForMovie={getUserRatingForMovie}
      onToggleFavorite={onToggleFavorite}
      isMovieFavorite={isMovieFavorite}
      onToggleWatchlist={onToggleWatchlist}
      isMovieInWatchlist={isMovieInWatchlist}
      /* details modal */
      selectedMovie={selectedMovie}
      isDetailsOpen={isDetailsOpen}
      onCloseDetails={handleCloseDetails}
      /* comments */
      movieComments={movieComments}
      onAddComment={onAddComment}
      currentUserName={currentUserName}
    />
  );
}
