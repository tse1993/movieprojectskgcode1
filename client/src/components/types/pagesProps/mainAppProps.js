// types/main-app-props.js

/** @typedef {import("../userProfile/user").User} User */
/** @typedef {import("..movieDisplays/MovieComment").MovieComment} MovieComment */

/**
 * @typedef {Object} MainAppProps
 * @property {User|null} user
 * @property {() => void} onLogout
 * @property {() => void} onNavigateToSettings
 * @property {() => void} onNavigateToProfile
 * @property {() => void} onNavigateToFeed
 * @property {() => void} onNavigateToPopular
 * @property {() => void} onNavigateToTopRated
 * @property {() => void} onNavigateToNewReleases
 * @property {(movieId: string, rating: number) => void} onRateMovie
 * @property {(movieId: string) => number} getUserRatingForMovie
 * @property {(movieId: string) => void} onToggleFavorite
 * @property {(movieId: string) => boolean} isMovieFavorite
 * @property {(isOpen: boolean) => void} onMoviePopupChange
 * @property {MovieComment[]} movieComments
 * @property {(movieId: string, content: string) => void} onAddComment
 * @property {(movieId: string) => void} onToggleWatchlist
 */
export {};
