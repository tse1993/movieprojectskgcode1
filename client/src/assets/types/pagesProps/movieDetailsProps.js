
/**
 * @typedef {Object} MovieDetailsProps
 * @property {Movie | null} movie
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {(movieId: string|number, rating: number) => void} onRateMovie
 * @property {(movieId: string|number) => number} getUserRatingForMovie
 * @property {(movieId: string|number) => void} onToggleFavorite
 * @property {(movieId: string|number) => boolean} isMovieFavorite
 * @property {MovieComment[]} movieComments
 * @property {(movieId: string|number, content: string) => void} onAddComment
 * @property {string} currentUserName
 * @property {(movieId: string|number) => void} onToggleWatchlist
 * @property {(movieId: string|number) => boolean} isMovieInWatchlist
 */

export {};