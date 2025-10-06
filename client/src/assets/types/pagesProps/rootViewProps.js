/**
 * @typedef {Object} AppViewProps
 * @property {{email:string, name?:string} | null} user
 * @property {(email:string)=>void} onLogin
 * @property {()=>void} onLogout
 * @property {"main"|"settings"|"profile"|"feed"|"popular"|"top_rated"|"new_releases"} currentView
 * @property {()=>void} onNavigateToSettings
 * @property {()=>void} onNavigateToProfile
 * @property {()=>void} onNavigateToFeed
 * @property {()=>void} onNavigateToPopular
 * @property {()=>void} onNavigateToTopRated
 * @property {()=>void} onNavigateToNewReleases
 * @property {()=>void} onNavigateToMain
 * @property {(u:any)=>void} onUpdateUser
 * @property {Array<any>} movieRatings
 * @property {Array<any>} favoriteMovies
 * @property {Array<any>} watchlistMovies
 * @property {()=>void} onClearAllFavorites
 * @property {()=>void} onClearAllRatings
 * @property {()=>void} onClearAllWatchlist
 * @property {(movieId:string|number)=>void} onRemoveFromWatchlist
 * @property {(movieId:string|number, rating:number)=>void} onRateMovie
 * @property {(movieId:string|number)=>number} getUserRatingForMovie
 * @property {(movieId:string|number)=>void} onToggleFavorite
 * @property {(movieId:string|number)=>boolean} isMovieFavorite
 * @property {(movieId:string|number)=>void} onToggleWatchlist
 * @property {(movieId:string|number)=>boolean} isMovieInWatchlist
 * @property {Array<any>} movieComments
 * @property {(movieId:string|number, content:string)=>void} onAddComment
 * @property {boolean} isMoviePopupOpen
 * @property {(open:boolean)=>void} onMoviePopupChange
 */

export {};