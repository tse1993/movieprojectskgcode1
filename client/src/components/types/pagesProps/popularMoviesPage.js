/** @typedef {import("../userProfile/user").User} User */
/** @typedef {import("../feed/movieComment").MovieComment} MovieComment */

/**
 * @typedef {Object} PopularMoviesPageProps
 * @property {User|null} user
 * @property {() => void} onBack
 * @property {(movieId: string, rating: number) => void} onRateMovie
 * @property {(movieId: string) => number} getUserRatingForMovie
 * @property {(movieId: string) => void} onToggleFavorite
 * @property {(movieId: string) => boolean} isMovieFavorite
 * @property {(isOpen: boolean) => void} onMoviePopupChange
 * @property {MovieComment[]} movieComments
 * @property {(movieId: string, content: string) => void} onAddComment
 * @property {(movieId: string) => void} onToggleWatchlist
 * @property {(movieId: string) => boolean} isMovieInWatchlist
 */

export {};
