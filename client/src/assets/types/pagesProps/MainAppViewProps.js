/**
 * View: μόνο UI (χωρίς state), παίρνει ό,τι χρειάζεται ως props.
 * @typedef {Object} MainAppViewProps
 * @property {{email:string, name?:string} | null} user
 * @property {()=>void} onLogout
 * @property {()=>void} onNavigateToSettings
 * @property {()=>void} onNavigateToProfile
 * @property {()=>void} onNavigateToFeed
 * @property {()=>void} onNavigateToPopular
 * @property {()=>void} onNavigateToTopRated
 * @property {()=>void} onNavigateToNewReleases
 * @property {string} searchQuery
 * @property {string} selectedGenre
 * @property {(q:string)=>void} onSearch
 * @property {(g:string)=>void} onGenreChange
 * @property {Array<string>} genres
 * @property {any|null} featuredMovie
 * @property {Array<any>} popularMovies
 * @property {Array<any>} topRatedMovies
 * @property {Array<any>} newReleases
 * @property {Array<any>} gridMovies
 * @property {(movie:any)=>void} onMovieClick
 * @property {(movieId:string|number, rating:number)=>void} onRateMovie
 * @property {(movieId:string|number)=>number} getUserRatingForMovie
 * @property {(movieId:string|number)=>void} onToggleFavorite
 * @property {(movieId:string|number)=>boolean} isMovieFavorite
 * @property {(movieId:string|number)=>void} onToggleWatchlist
 * @property {(movieId:string|number)=>boolean} isMovieInWatchlist
 * @property {any|null} selectedMovie
 * @property {boolean} isDetailsOpen
 * @property {()=>void} onCloseDetails
 * @property {Array<any>} movieComments
 * @property {(movieId:string|number, content:string)=>void} onAddComment
 * @property {string} currentUserName
 */

export {};