import { useState, useEffect } from "react";
import DashboardView from "./DashboardView.jsx";
import { api } from "../../services/api.js";

// @ts-check
/** @typedef {import("../../assets/types/pagesProps/DashboardProps.js").DashboardProps} DashboardProps */

const genres = ["All", "Action", "Drama", "Sci-Fi", "Comedy", "Thriller", "Romance"];

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
    onLoadComments,
    onAddComment,
    onToggleWatchlist,
    isMovieInWatchlist,
    createMovieHandlers,
  } = props;

  // state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load movies from API on mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const [popular, topRated, upcoming] = await Promise.all([
          api.getPopularMovies(),
          api.getTopRatedMovies(),
          api.getUpcomingMovies()
        ]);

        const popularResults = popular.results || [];
        setPopularMovies(popularResults);
        setTopRatedMovies(topRated.results || []);
        setNewReleases(upcoming.results || []);

        // Fetch full details for featured movie (first popular movie) to get trailer
        if (popularResults.length > 0) {
          try {
            const featuredDetails = await api.getMovieDetails(popularResults[0].id);
            setPopularMovies(prev => [featuredDetails, ...prev.slice(1)]);
          } catch (error) {
            console.error('[Dashboard] Load featured movie failed:', error);
          }
        }
      } catch (error) {
        console.error('[Dashboard] Load movies failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Search movies when query changes
  useEffect(() => {
    const searchMoviesDebounced = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await api.searchMovies(searchQuery);
          setSearchResults(results.results || []);
        } catch (error) {
          console.error('[Dashboard] Search failed:', error);
          setSearchResults([]);
          throw error;
        }
      } else {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(searchMoviesDebounced, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load movies by genre when genre changes
  useEffect(() => {
    const loadGenreMovies = async () => {
      if (selectedGenre !== "All" && !searchQuery) {
        try {
          setLoading(true);
          const results = await api.getMoviesByGenre(selectedGenre);
          setGenreMovies(results.results || []);
        } catch (error) {
          console.error('[Dashboard] Load genre movies failed:', error);
          setGenreMovies([]);
          throw error;
        } finally {
          setLoading(false);
        }
      }
    };

    loadGenreMovies();
  }, [selectedGenre, searchQuery]);

  // featured (πρώτη ταινία από popular)
  const featuredMovie = popularMovies[0] || null;

  /** @typedef {{id:number,title:string,posterUrl:string,rating:number,releaseDate:string,genre:string,overview:string,trailerUrl?:string}} Movie */

  /** @param {Movie} movie */
  const handleMovieClick = async (movie) => {
    // Set basic movie data immediately so modal can render
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
    setIsLoadingDetails(true);
    onMoviePopupChange?.(true);

    try {
      // Fetch full movie details and load comments in parallel
      await Promise.all([
        api.getMovieDetails(movie.id).then(fullDetails => {
          setSelectedMovie(fullDetails);
        }),
        onLoadComments?.(movie.id)
      ]);
    } catch (error) {
      console.error('[Dashboard] Load movie details failed:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedMovie(null);
    setIsLoadingDetails(false);
    onMoviePopupChange?.(false);
  };

  // Get the wrapped handlers from the factory function
  const movieHandlers = createMovieHandlers([selectedMovie, setSelectedMovie]);

  /** @param {string} query */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre("All");
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setSearchQuery("");
  };

  // Filter movies based on search or genre
  const getFilteredMovies = () => {
    if (searchQuery) {
      return searchResults;
    }

    if (selectedGenre === "All") {
      return popularMovies;
    }

    // Use genre-filtered movies from API
    return genreMovies;
  };

  const filteredMovies = getFilteredMovies();

  // If showing "All" and no search, remove featured from grid
  const gridMovies =
    selectedGenre === "All" && !searchQuery && filteredMovies.length > 0
      ? filteredMovies.slice(1)
      : filteredMovies;

  const currentUserName =
    user?.name || user?.email?.split("@")[0] || "Anonymous";

  // Extract comments for the selected movie
  const selectedMovieComments = selectedMovie
    ? (movieComments[selectedMovie.id] || [])
    : [];

  if (loading && selectedGenre === "All" && !searchQuery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

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
      onRateMovie={movieHandlers.handleRateMovie}
      getUserRatingForMovie={getUserRatingForMovie}
      onToggleFavorite={movieHandlers.handleToggleFavorite}
      isMovieFavorite={isMovieFavorite}
      onToggleWatchlist={movieHandlers.handleToggleWatchlist}
      isMovieInWatchlist={isMovieInWatchlist}
      /* details modal */
      selectedMovie={selectedMovie}
      isDetailsOpen={isDetailsOpen}
      isLoadingDetails={isLoadingDetails}
      onCloseDetails={handleCloseDetails}
      /* comments */
      movieComments={selectedMovieComments}
      onAddComment={onAddComment}
      currentUserName={currentUserName}
    />
  );
}
