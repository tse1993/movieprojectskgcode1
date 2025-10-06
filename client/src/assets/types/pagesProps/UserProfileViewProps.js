/**
 * @typedef {Object} UserProfileViewProps
 * @property {{email:string, name?:string}} user
 * @property {()=>void} onBack
 * @property {{moviesRated:number, favorites:number, watchlistItems:number, memberSince:string}} userStats
 * @property {string[]} allGenres
 * @property {Array<any>} filteredMovies
 * @property {"grid"|"list"} viewMode
 * @property {(m:"grid"|"list")=>void} setViewMode
 * @property {string} sortBy
 * @property {(v:string)=>void} setSortBy
 * @property {string} filterGenre
 * @property {(v:string)=>void} setFilterGenre
 * @property {boolean} showDeleteDialog
 * @property {(open:boolean)=>void} setShowDeleteDialog
 * @property {()=>void} handleDeleteClick
 * @property {()=>void} handleClearAllFavorites
 * @property {Array<any>} filteredRatedMovies
 * @property {"grid"|"list"} ratedViewMode
 * @property {(m:"grid"|"list")=>void} setRatedViewMode
 * @property {string} ratedSortBy
 * @property {(v:string)=>void} setRatedSortBy
 * @property {string} filterRating
 * @property {(v:string)=>void} setFilterRating
 * @property {boolean} showRatedDeleteDialog
 * @property {(open:boolean)=>void} setShowRatedDeleteDialog
 * @property {()=>void} handleRatedDeleteClick
 * @property {()=>void} handleClearAllRatings
 * @property {Array<{rating:number,count:number}>} ratingDistribution
 * @property {(rating:number)=>"default"|"secondary"|"outline"} getRatingBadgeVariant
 * @property {(rating:number)=>string} getRatingColor
 * @property {(date:string)=>string} formatDate
 * @property {(mins:number)=>string} formatRuntime
 * @property {Array<any>} watchlistMoviesWithDetails
 * @property {(id:string|number)=>void} handleRemoveFromWatchlist
 * @property {()=>void} onClearAllWatchlist
 */

export {};