import { Badge } from "../../assets/ui/badge";
import { Button } from "../../assets/ui/button";
import { Separator } from "../../assets/ui/separator";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../../assets/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../assets/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "../../assets/ui/alert-dialog";
import {
  ArrowLeft, User, Star, Heart, Bookmark, Calendar, Filter,
  GridIcon, List, Users, Trash2, Clock,
} from "lucide-react";

/** @typedef {import("../../assets/types/pagesProps/UserProfileViewProps").UserProfileViewProps} UserProfileViewProps */

/** @param {UserProfileViewProps} props */
export default function UserProfileView(props) {
  const {
    user, onBack, userStats,
    allGenres, filteredMovies,
    viewMode, setViewMode,
    sortBy, setSortBy,
    filterGenre, setFilterGenre,
    showDeleteDialog, setShowDeleteDialog,
    handleDeleteClick, handleClearAllFavorites,

    totalRatedMovies, // Total unfiltered count
    filteredRatedMovies,
    ratedViewMode, setRatedViewMode,
    ratedSortBy, setRatedSortBy,
    filterRating, setFilterRating,
    showRatedDeleteDialog, setShowRatedDeleteDialog,
    handleRatedDeleteClick, handleClearAllRatings,
    ratingDistribution, getRatingBadgeVariant, getRatingColor,

    watchlistMoviesWithDetails, handleRemoveFromWatchlist,
    showWatchlistDeleteDialog, setShowWatchlistDeleteDialog,
    handleWatchlistDeleteClick, handleClearAllWatchlist,

    formatDate, formatRuntime,
  } = props;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Movies</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-2xl font-semibold">User Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Overview</span>
              </CardTitle>
              <CardDescription>
                Your movie database profile and activity summary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name || user.email.split('@')[0]}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Member since {userStats.memberSince}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Activity Stats */}
                <div>
                  <h4 className="font-medium mb-4">Activity Stats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Movies Rated</p>
                        <p className="font-semibold">{userStats.moviesRated}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                        <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Favorites</p>
                        <p className="font-semibold">{userStats.favorites}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Watchlist</p>
                        <p className="font-semibold">{userStats.watchlistItems}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* My Favorite Movies */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    <h4 className="font-medium">My Favorite Movies</h4>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Favorites</p>
                        <p className="font-semibold">{filteredMovies.length}</p>
                      </div>
                    </div>

                    {filteredMovies.length > 0 && (
                      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Clear All</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete all favorites?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove all your favorite movies from your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearAllFavorites}>
                              Yes, delete all favorites
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {/* Controls */}
                  {filteredMovies.length > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50 mb-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4" />
                            <span className="text-sm font-medium">Filter:</span>
                            <Select value={filterGenre} onValueChange={setFilterGenre}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Genres</SelectItem>
                                {allGenres.map((genre) => (
                                  <SelectItem key={genre} value={genre.toLowerCase()}>
                                    {genre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Sort:</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="added-desc">Recently Added</SelectItem>
                                <SelectItem value="added-asc">Oldest First</SelectItem>
                                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                                <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                                <SelectItem value="title-asc">Title A-Z</SelectItem>
                                <SelectItem value="title-desc">Title Z-A</SelectItem>
                                <SelectItem value="year-desc">Newest</SelectItem>
                                <SelectItem value="year-asc">Oldest</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                          >
                            <GridIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Movies Display */}
                  {filteredMovies.length === 0 ? (
                    <div className="py-8 text-center">
                      <Heart className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                      <h5 className="font-medium mb-2">No favorite movies found</h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        {filterGenre !== "all"
                          ? `No movies found in the ${filterGenre} genre.`
                          : "Start adding movies to your favorites to see them here!"}
                      </p>
                      <Button onClick={onBack} size="sm">
                        Browse Movies
                      </Button>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredMovies.map((movie) => (
                        <Card
                          key={movie.id}
                          className="group hover:shadow-lg transition-all duration-300"
                        >
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="bg-black/80 text-white">
                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h5 className="font-medium mb-1 line-clamp-1 text-sm">{movie.title}</h5>
                            <p className="text-xs text-muted-foreground mb-2">{movie.year}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {movie.genre.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">Added {formatDate(movie.addedDate)}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMovies.map((movie) => (
                        <div key={movie.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0 relative">
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-16 h-20 object-cover rounded-md"
                              />
                              <Heart className="absolute -top-1 -right-1 h-3 w-3 text-red-500 fill-red-500" />
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-medium text-sm">{movie.title}</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {movie.year} • {formatRuntime(movie.runtime)}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    <Star className="h-2 w-2 mr-1 fill-yellow-400 text-yellow-400" />
                                    {movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}
                                  </Badge>
                                  {movie.userRating && (
                                    <Badge variant="outline" className="text-xs">
                                      Your Rating: {movie.userRating}/10
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {movie.genre.map((genre) => (
                                  <Badge key={genre} variant="outline" className="text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <span>Directed by {movie.director}</span>
                                  <span>•</span>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-2 w-2" />
                                    <span>{movie.cast.slice(0, 2).join(", ")}</span>
                                    {movie.cast.length > 2 && <span>+{movie.cast.length - 2} more</span>}
                                  </div>
                                </div>
                                <span>Added {formatDate(movie.addedDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* My Rated Movies */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <h4 className="font-medium">My Rated Movies</h4>
                  </div>

                  <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Movies Rated</p>
                          <p className="font-semibold">{filteredRatedMovies.length}</p>
                        </div>
                      </div>
                    </div>

                    {filteredRatedMovies.length > 0 && (
                      <AlertDialog open={showRatedDeleteDialog} onOpenChange={setShowRatedDeleteDialog}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRatedDeleteClick}
                            className="flex items-center space-x-2 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Clear All</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete all ratings?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete all your movie ratings and remove them from your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearAllRatings}>
                              Yes, delete all ratings
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {/* Rating Distribution */}
                  {filteredRatedMovies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">Your Rating Distribution</span>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                          {ratingDistribution.map(({ rating, count }) => (
                            <div key={rating} className="text-center">
                              <div className="text-xs font-medium mb-1">{rating}</div>
                              <div className="h-8 bg-muted rounded flex items-end justify-center">
                                {count > 0 && (
                                  <div
                                    className="bg-primary rounded-t w-full transition-all"
                                    style={{
                                      height: `${Math.max(
                                        (count /
                                          Math.max(...ratingDistribution.map((r) => r.count) || [1])) *
                                          100,
                                        10
                                      )}%`,
                                    }}
                                  />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controls - Show when there are ANY rated movies (even if filtered results are 0) */}
                  {totalRatedMovies > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50 mb-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4" />
                            <span className="text-sm font-medium">Filter:</span>
                            <Select value={filterRating} onValueChange={setFilterRating}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                <SelectItem value="8">8-10 ⭐</SelectItem>
                                <SelectItem value="6">6-7 ⭐</SelectItem>
                                <SelectItem value="4">4-5 ⭐</SelectItem>
                                <SelectItem value="1">1-3 ⭐</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Sort:</span>
                            <Select value={ratedSortBy} onValueChange={setRatedSortBy}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rated-desc">Recently Rated</SelectItem>
                                <SelectItem value="rated-asc">Oldest Rated</SelectItem>
                                <SelectItem value="user-rating-desc">Your Rating (High)</SelectItem>
                                <SelectItem value="user-rating-asc">Your Rating (Low)</SelectItem>
                                <SelectItem value="tmdb-rating-desc">TMDB Rating (High)</SelectItem>
                                <SelectItem value="tmdb-rating-asc">TMDB Rating (Low)</SelectItem>
                                <SelectItem value="title-asc">Title A-Z</SelectItem>
                                <SelectItem value="title-desc">Title Z-A</SelectItem>
                                <SelectItem value="year-desc">Newest</SelectItem>
                                <SelectItem value="year-asc">Oldest</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant={ratedViewMode === "grid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRatedViewMode("grid")}
                          >
                            <GridIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={ratedViewMode === "list" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRatedViewMode("list")}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rated Movies Display */}
                  {filteredRatedMovies.length === 0 ? (
                    <div className="py-8 text-center">
                      <Star className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                      <h5 className="font-medium mb-2">No rated movies found</h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        {filterRating !== "all"
                          ? `No movies found with the selected rating range.`
                          : "Start rating movies to see them here!"}
                      </p>
                      <Button onClick={onBack} size="sm">
                        Browse Movies
                      </Button>
                    </div>
                  ) : ratedViewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredRatedMovies.map((movie) => (
                        <Card
                          key={movie.id}
                          className="group hover:shadow-lg transition-all duration-300"
                        >
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge
                                variant={getRatingBadgeVariant(movie.userRating)}
                                className={`${getRatingColor(movie.userRating)} bg-black/80 text-white border-0`}
                              >
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {movie.userRating}/10
                              </Badge>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="bg-black/80 text-white">
                                TMDB: {movie.tmdbRating}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h5 className="font-medium mb-1 line-clamp-1 text-sm">{movie.title}</h5>
                            <p className="text-xs text-muted-foreground mb-2">{movie.year}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {movie.genre.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">Rated {formatDate(movie.ratedDate)}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredRatedMovies.map((movie) => (
                        <div key={movie.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0 relative">
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-16 h-20 object-cover rounded-md"
                              />
                              <Badge
                                variant={getRatingBadgeVariant(movie.userRating)}
                                className={`absolute -top-1 -right-1 ${getRatingColor(movie.userRating)} bg-black/80 text-white border-0 text-xs`}
                              >
                                {movie.userRating}
                              </Badge>
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-medium text-sm">{movie.title}</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {movie.year} • {formatRuntime(movie.runtime)}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="default" className={`${getRatingColor(movie.userRating)} text-xs`}>
                                    <Star className="h-2 w-2 mr-1 fill-current" />
                                    Your Rating: {movie.userRating}/10
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    TMDB: {movie.tmdbRating}/10
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {movie.genre.map((genre) => (
                                  <Badge key={genre} variant="outline" className="text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <span>Directed by {movie.director}</span>
                                  <span>•</span>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-2 w-2" />
                                    <span>{movie.cast.slice(0, 2).join(", ")}</span>
                                    {movie.cast.length > 2 && <span>+{movie.cast.length - 2} more</span>}
                                  </div>
                                </div>
                                <span>Rated {formatDate(movie.ratedDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* My Watchlist */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">My Watchlist</h4>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Movies to Watch</p>
                        <p className="font-semibold">{watchlistMoviesWithDetails.length}</p>
                      </div>
                    </div>

                    {watchlistMoviesWithDetails.length > 0 && (
                      <AlertDialog open={showWatchlistDeleteDialog} onOpenChange={setShowWatchlistDeleteDialog}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleWatchlistDeleteClick}
                            className="flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Clear All</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete all watchlist items?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete all your watchlist items and remove them from your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearAllWatchlist}>
                              Yes, delete all watchlist items
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {watchlistMoviesWithDetails.length === 0 ? (
                    <div className="py-8 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-4 text-muted-foreground/50" />
                      <h5 className="font-medium mb-2">Your watchlist is empty</h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add movies you want to watch later to keep track of them.
                      </p>
                      <Button onClick={onBack} size="sm">
                        Browse Movies
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {watchlistMoviesWithDetails
                        .filter(Boolean)
                        .map((movie) => (
                          <div key={movie.id} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0">
                                <img
                                  src={movie.posterUrl}
                                  alt={movie.title}
                                  className="w-16 h-20 object-cover rounded-md"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder.jpg';
                                  }}
                                />
                              </div>

                              <div className="flex-grow space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="font-medium text-sm">{movie.title}</h5>
                                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                      <div className="flex items-center space-x-1">
                                        <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                                        <span>{movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}/10</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-2 w-2" />
                                        <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Badge variant="secondary" className="text-xs">{movie.genre}</Badge>

                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {movie.overview}
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Added {formatDate(movie.addedAt)}
                                  </span>
                                  <div className="flex space-x-2">
                                    {movie.trailerUrl && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-xs px-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(movie.trailerUrl, '_blank');
                                        }}
                                      >
                                        Watch Trailer
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
