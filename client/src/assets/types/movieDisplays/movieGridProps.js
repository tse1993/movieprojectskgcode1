/** @typedef {import("./movieStruct").Movie} Movie */

/**
 * @typedef {Object} MovieGridProps
 * @property {Movie[]} movies
 * @property {(movie: Movie) => void} onMovieClick
 * @property {string} [title]
 * @property {(movieId: string|number, rating: number) => void} [onRateMovie]
 * @property {(movieId: string|number) => number} [getUserRatingForMovie]
 * @property {(movieId: string|number) => void} [onToggleFavorite]
 * @property {(movieId: string|number) => boolean} [isMovieFavorite]
 * @property {(movieId: string|number) => void} [onToggleWatchlist]
 * @property {(movieId: string|number) => boolean} [isMovieInWatchlist]
 */

export {};
