import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../assets/ui/button";
import { api } from "../../services/api.js";
import MovieGridPage from "../MovieGrid/MovieGridPage";
import MovieDetailsPage from "../MovieDetails/MovieDetailsPage";

/** @typedef {import("../../assets/types/movieDisplays/movieStruct").Movie} Movie */
/** @typedef {import("../../assets/types/pagesProps/popularMoviesPage").PopularMoviesPageProps} PopularMoviesPageProps */

/** @param {PopularMoviesPageProps} props */
export default function PopularMoviesView(props) {
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

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadMovies = async (page = 1) => {
      try {
        setLoading(true);
        const data = await api.getPopularMovies(page);
        setPopularMovies(data.results || []);
        setCurrentPage(data.page);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('[PopularMoviesView] Failed to load popular movies:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    loadMovies(currentPage);
  }, [currentPage]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading popular movies...</p>
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
          <h1 className="text-xl font-semibold">Popular Movies</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Discover the most popular movies on TMDB. These are the
            highest-rated films that the community loves.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {popularMovies.length} movies (Page {currentPage} of {totalPages})
          </p>
        </div>

        <MovieGridPage
          movies={popularMovies}
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
          currentUserName={
            user?.name || (user?.email ? user.email.split("@")[0] : "User")
          }
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      )}
    </div>
  );
}
