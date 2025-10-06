
/** @typedef {import("../userProfile/user").User} User */
/** @typedef {import("../userProfile/favoriteMovie").FavoriteMovie} FavoriteMovie */
/** @typedef {import("../userProfile/favoriteMovie").FavoriteMovieData} FavoriteMovieData */
/** @typedef {import("../userProfile/ratedMovie").RatedMovie} RatedMovie */
/** @typedef {import("../userProfile/ratedMovie").MovieRating} MovieRating */
/** @typedef {import("../userProfile/watchlistMovie").WatchlistMovie} WatchlistMovie */

/**
 * @typedef {Object} UserProfilePageProps
 * @property {User} user
 * @property {() => void} onBack
 * @property {FavoriteMovieData[]} favoriteMovies
 * @property {() => void} onClearAllFavorites
 * @property {MovieRating[]} movieRatings
 * @property {() => void} onClearAllRatings
 * @property {WatchlistMovie[]} watchlistMovies
 * @property {() => void} onClearAllWatchlist
 * @property {(movieId: string) => void} onRemoveFromWatchlist
 */

export {};