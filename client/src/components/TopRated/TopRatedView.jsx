import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../assets/ui/button";
import MovieDetailsPage from "../MovieDetails/MovieDetailsPage";
import MovieGridPage from "../MovieGrid/MovieGridPage";
import { getTopRatedMovies } from "@/data/movies";

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

  const topRatedMovies = getTopRatedMovies();

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
            Showing {topRatedMovies.length} top-rated movies
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
