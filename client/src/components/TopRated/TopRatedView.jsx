import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../assets/ui/button";
import MovieDetailsPage from "../MovieDetails/MovieDetailsPage";
import MovieGridPage from "../MovieGrid/MovieGridPage";
import { api } from "../../services/api.js";

/** @typedef {import("../../assets/types/pagesProps/topRatedPageProps").TopRatedPageProps} TopRatedPageProps */
/** @typedef {import("../../assets/types/movieDisplays/movieStruct").Movie} Movie */

/** @param {TopRatedPageProps} props */
export default function TopRatedView(props) {
  const {
    user,
    onBack,
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

  /** @type {Movie|null} */
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadMovies = async (page = 1) => {
      console.log('[TopRatedView] loadMovies called:', { page });
      try {
        setLoading(true);
        const data = await api.getTopRatedMovies(page);
        console.log('[TopRatedView] Top rated movies loaded successfully:', {
          count: data.results?.length,
          page: data.page,
          totalPages: data.total_pages
        });
        setTopRatedMovies(data.results || []);
        setCurrentPage(data.page);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('[TopRatedView] Failed to load top rated movies:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    loadMovies(currentPage);
  }, [currentPage]);

  /** @param {Movie} movie */
  const handleMovieClick = (movie) => {
    console.log('[TopRatedView] handleMovieClick called:', { movieId: movie.id, title: movie.title });
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
    onMoviePopupChange?.(true);
  };

  const handleCloseDetails = () => {
    console.log('[TopRatedView] handleCloseDetails called');
    setIsDetailsOpen(false);
    setSelectedMovie(null);
    onMoviePopupChange?.(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading top rated movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container flex items-center h-16 px-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Top Rated Movies</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Explore the highest-rated movies of all time. These films have
            received the best scores from our community of movie enthusiasts.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {topRatedMovies.length} movies (Page {currentPage} of {totalPages})
          </p>
        </div>

        <MovieGridPage
          movies={topRatedMovies}
          onMovieClick={handleMovieClick}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-8 pb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsPage
          movie={selectedMovie}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          movieComments={movieComments}
          onAddComment={onAddComment}
          user={user}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      )}
    </div>
  );
}
