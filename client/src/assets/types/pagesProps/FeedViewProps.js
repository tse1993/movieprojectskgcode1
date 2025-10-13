/**
 * @typedef {Object} FeedViewProps
 * @property {{ email:string, name?:string } | null} user
 * @property {() => void} onBack
 * @property {any[]} activities
 * @property {(dateString:string)=>string} formatDate
 * @property {() => void} onLoadMore
 * @property {boolean} hasMore
 * @property {boolean} loadingMore
 * @property {() => void} onRefresh
 * @property {boolean} loading
 * @property {number} newActivityCount
 */

export {};