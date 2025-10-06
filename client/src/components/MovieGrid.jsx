import { MovieCard } from "./MovieCard";

/** @typedef {import("./types/movieDisplays/movieGridProps").MovieGridProps} MovieGridProps*/

export default function MovieGrid({
  movies,
  onMovieClick,
  title,
  onRateMovie,
  getUserRatingForMovie,
  onToggleFavorite,
  isMovieFavorite,
  onToggleWatchlist,
  isMovieInWatchlist,
}) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No movies found</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
            onRateMovie={onRateMovie}
            getUserRatingForMovie={getUserRatingForMovie}
            onToggleFavorite={onToggleFavorite}
            isMovieFavorite={isMovieFavorite}
            onToggleWatchlist={onToggleWatchlist}
            isMovieInWatchlist={isMovieInWatchlist}
          />
        ))}
      </div>
    </div>
  );
}
