import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { getPopularMovies } from "@/data/movies";
import MovieDetails from "./MovieDetails.jsx";
import MovieGrid from "./MovieGrid.jsx";

/** @typedef {import("./types/movieDisplays/movieStruct").Movie} Movie */
/** @typedef {import("./types/pagesProps/popularMoviesPage").PopularMoviesPageProps} PopularMoviesPageProps */

/**
 * @param {PopularMoviesPageProps} props
 */
export default function PopularMoviesPage(props) {
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

  const popularMovies = getPopularMovies();

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
    onMoviePopupChange(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedMovie(null);
    onMoviePopupChange(false);
  };

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
            Discover the most popular movies on our platform. These are the
            highest-rated films that our community loves.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {popularMovies.length} popular movies
          </p>
        </div>

        <MovieGrid
          movies={popularMovies}
          onMovieClick={handleMovieClick}
          onRateMovie={onRateMovie}
          getUserRatingForMovie={getUserRatingForMovie}
          onToggleFavorite={onToggleFavorite}
          isMovieFavorite={isMovieFavorite}
          onToggleWatchlist={onToggleWatchlist}
          isMovieInWatchlist={isMovieInWatchlist}
        />
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
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
