import MovieCardPage from "../MovieCard/MovieCardPage.jsx";

/** @typedef {import("../types/movieDisplays/movieGridProps").MovieGridProps} MovieGridProps */

/** @param {MovieGridProps} props */
export default function MovieGridView({
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
          <MovieCardPage
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
