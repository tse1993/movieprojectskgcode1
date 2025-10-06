import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { getNewReleases } from "@/data/movies";

import MovieGridPage from "../MovieGrid/MovieGridPage";
import MovieDetailsPage from "../MovieDetails/MovieDetailsPage";

/** @typedef {import("../types/movieDisplays/movieStruct").Movie} Movie */
/** @typedef {import("../types/pagesProps/newReleasesPageProps").NewReleasesPageProps} NewReleasesPageProps */

/** @param {NewReleasesPageProps} props */
export default function NewReleasesView(props) {
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

  const newReleases = getNewReleases();

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
          <h1 className="text-xl font-semibold">New Releases</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Stay up to date with the latest movie releases. Discover fresh
            content that has recently joined our platform.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {newReleases.length} new releases from the last 6 months
          </p>
        </div>

        <MovieGridPage
          movies={newReleases}
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
