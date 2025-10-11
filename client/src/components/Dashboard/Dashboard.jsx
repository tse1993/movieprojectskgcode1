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
      console.log('[Dashboard] loadMovies called - fetching popular, top-rated, and upcoming movies');
      try {
        setLoading(true);
        const [popular, topRated, upcoming] = await Promise.all([
          api.getPopularMovies(),
          api.getTopRatedMovies(),
          api.getUpcomingMovies()
        ]);

        console.log('[Dashboard] Movies loaded successfully:', {
          popularCount: popular.results?.length,
          topRatedCount: topRated.results?.length,
          upcomingCount: upcoming.results?.length
        });

        const popularResults = popular.results || [];
        setPopularMovies(popularResults);
        setTopRatedMovies(topRated.results || []);
        setNewReleases(upcoming.results || []);

        // Fetch full details for featured movie (first popular movie) to get trailer
        if (popularResults.length > 0) {
          console.log('[Dashboard] Fetching full details for featured movie:', popularResults[0].title);
          try {
            const featuredDetails = await api.getMovieDetails(popularResults[0].id);
            console.log('[Dashboard] Featured movie details loaded:', {
              title: featuredDetails.title,
              hasTrailer: !!featuredDetails.trailerUrl
            });
            setPopularMovies(prev => [featuredDetails, ...prev.slice(1)]);
          } catch (error) {
            console.error('[Dashboard] Failed to load featured movie details:', error);
          }
        }
      } catch (error) {
        console.error('[Dashboard] Failed to load movies:', error);
        throw error;
      } finally {
        setLoading(false);
        console.log('[Dashboard] Loading complete');
      }
    };

    loadMovies();
  }, []);

  // Search movies when query changes
  useEffect(() => {
    const searchMoviesDebounced = async () => {
      if (searchQuery.trim()) {
        console.log('[Dashboard] Searching movies with query:', searchQuery);
        try {
          const results = await api.searchMovies(searchQuery);
          console.log('[Dashboard] Search results:', { count: results.results?.length, query: searchQuery });
          setSearchResults(results.results || []);
        } catch (error) {
          console.error('[Dashboard] Search failed:', { query: searchQuery, error });
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
        console.log('[Dashboard] Loading movies for genre:', selectedGenre);
        try {
          setLoading(true);
          const results = await api.getMoviesByGenre(selectedGenre);
          console.log('[Dashboard] Genre movies loaded:', { genre: selectedGenre, count: results.results?.length });
          setGenreMovies(results.results || []);
        } catch (error) {
          console.error('[Dashboard] Failed to load genre movies:', { genre: selectedGenre, error });
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
    console.log('[Dashboard] handleMovieClick called:', { movieId: movie.id, title: movie.title });

    // Set basic movie data immediately so modal can render
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
    setIsLoadingDetails(true);
    onMoviePopupChange?.(true);

    try {
      // Fetch full movie details and load comments in parallel
      console.log('[Dashboard] Fetching full movie details and loading comments for:', movie.title);
      await Promise.all([
        api.getMovieDetails(movie.id).then(fullDetails => {
          console.log('[Dashboard] Movie details loaded successfully:', {
            title: fullDetails.title,
            hasTrailer: !!fullDetails.trailerUrl,
            hasBackdrop: !!fullDetails.backdropUrl
          });
          setSelectedMovie(fullDetails);
        }),
        onLoadComments?.(movie.id)
      ]);

      console.log('[Dashboard] Movie details and comments loaded');
    } catch (error) {
      console.error('[Dashboard] Failed to load movie details:', { movieId: movie.id, title: movie.title, error });
      // Keep using basic movie data (already set above)
      console.log('[Dashboard] Using fallback basic movie data');
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
