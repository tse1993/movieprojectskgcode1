import { Star, Calendar, Clock, Play, Heart, Bookmark } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../assets/ui/dialog";
import { Button } from "../../assets/ui/button";
import { Badge } from "../../assets/ui/badge";
import { Separator } from "../../assets/ui/separator";
import StarRatingPage from "../StarRating/StarRatingPage";
import MovieCommentsPage from "../MovieComments/MovieCommentsPage";
import { toast } from "sonner";

/** @typedef {import("../../assets/types/movieDisplays/movieStruct").movieDetailsProps} movieDetailsProps */
/** @typedef {import("../../assets/types/feed/movieComment").MovieComment} movieComment */

/**
 * View: περιέχει μόνο το UI + τοπικούς handlers.
 * @param {movieDetailsProps} props
 */
export default function MovieDetailsView({
  movie,
  isOpen,
  isLoadingDetails,
  onClose,
  onRateMovie,
  getUserRatingForMovie,
  onToggleFavorite,
  isMovieFavorite,
  movieComments,
  onAddComment,
  currentUserName,
  onToggleWatchlist,
  isMovieInWatchlist,
}) {
  // Αν δεν είναι ανοιχτό το modal, μην εμφανίζεις τίποτα
  if (!isOpen) return null;

  // Αν δεν υπάρχει ταινία ακόμα, μην εμφανίζεις τίποτα
  if (!movie) return null;

  /** @param {string|number} movieId @param {number} rating */
  const handleRateMovie = (movieId, rating) => {
    console.log('[MovieDetailsView] handleRateMovie called:', { movieId, rating, title: movie.title });
    try {
      onRateMovie(movieId, rating);
      console.log('[MovieDetailsView] Movie rated successfully');
      toast.success(`Rated "${movie.title}" ${rating}/10 ⭐`);
    } catch (error) {
      console.error('[MovieDetailsView] Failed to rate movie:', { movieId, rating, error });
      toast.error('Failed to rate movie');
      throw error;
    }
  };

  const handleToggleFavorite = () => {
    console.log('[MovieDetailsView] handleToggleFavorite called:', { movieId: movie.id, title: movie.title, currentState: movie.isFavorite });
    try {
      const wasFavorite = movie.isFavorite !== undefined ? movie.isFavorite : isMovieFavorite(movie.id);
      onToggleFavorite(movie.id);
      console.log('[MovieDetailsView] Favorite toggled successfully:', { wasFavorite, nowFavorite: !wasFavorite });
      if (wasFavorite) {
        toast.success(`Removed "${movie.title}" from favorites`);
      } else {
        toast.success(`Added "${movie.title}" to favorites ❤️`);
      }
    } catch (error) {
      console.error('[MovieDetailsView] Failed to toggle favorite:', { movieId: movie.id, error });
      toast.error('Failed to update favorites');
      throw error;
    }
  };

  const handleToggleWatchlist = () => {
    console.log('[MovieDetailsView] handleToggleWatchlist called:', { movieId: movie.id, title: movie.title, currentState: movie.isInWatchlist });
    try {
      const wasInWatchlist = movie.isInWatchlist !== undefined ? movie.isInWatchlist : (isMovieInWatchlist ? isMovieInWatchlist(movie.id) : false);
      onToggleWatchlist(movie.id);
      console.log('[MovieDetailsView] Watchlist toggled successfully:', { wasInWatchlist, nowInWatchlist: !wasInWatchlist });
      if (wasInWatchlist) {
        toast.success(`Removed "${movie.title}" from watchlist`);
      } else {
        toast.success(`Added "${movie.title}" to watchlist 🕒`);
      }
    } catch (error) {
      console.error('[MovieDetailsView] Failed to toggle watchlist:', { movieId: movie.id, error });
      toast.error('Failed to update watchlist');
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] overflow-y-auto">
        {/* Loading Overlay */}
        {isLoadingDetails && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading details...</p>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle>{movie.title}</DialogTitle>
          <DialogDescription>
            Movie details for {movie.title}
          </DialogDescription>
          <Button
            variant="outline"
            className="absolute right-4 top-4 bg-black text-white hover:bg-gray-800 hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] overflow-hidden rounded-lg">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.rating}/10</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'Unknown'}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="mb-4">
                {movie.genre}
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex space-x-3">
                {movie.trailerUrl && (
                  <Button
                    className="flex items-center space-x-2"
                    onClick={() => window.open(movie.trailerUrl, '_blank')}
                  >
                    <Play className="h-4 w-4" />
                    <span>Watch Trailer</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleToggleWatchlist}
                  className="flex items-center space-x-2"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      (movie.isInWatchlist !== undefined ? movie.isInWatchlist : (isMovieInWatchlist && isMovieInWatchlist(movie.id)))
                        ? "fill-blue-500 text-blue-500"
                        : "text-current"
                    }`}
                  />
                  <span>
                    {(movie.isInWatchlist !== undefined ? movie.isInWatchlist : (isMovieInWatchlist && isMovieInWatchlist(movie.id))) ? "Remove from Watchlist" : "Add to Watchlist"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className="flex items-center space-x-2"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      (movie.isFavorite !== undefined ? movie.isFavorite : isMovieFavorite(movie.id))
                        ? "fill-red-500 text-red-500"
                        : "text-current"
                    }`}
                  />
                  <span>
                    {(movie.isFavorite !== undefined ? movie.isFavorite : isMovieFavorite(movie.id)) ? "Remove from Favorites" : "Add to Favorites"}
                  </span>
                </Button>
              </div>

              <StarRatingPage
                movieId={movie.id}
                initialRating={movie.userRating !== undefined ? movie.userRating : getUserRatingForMovie(movie.id)}
                onRate={handleRateMovie}
                className="border-t pt-4"
              />
            </div>

            {/* Cast & Crew Section */}
            {(movie.cast || movie.crew) && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Cast & Crew</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {/* Display cast members */}
                  {movie.cast && movie.cast.map((person) => (
                    <div key={person.id}>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-muted-foreground">{person.character}</p>
                    </div>
                  ))}

                  {/* Display crew (director, producer) */}
                  {movie.crew && movie.crew.map((person) => (
                    <div key={person.id}>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-muted-foreground">{person.job}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <MovieCommentsPage
              movieId={movie.id}
              comments={movieComments}
              currentUserName={currentUserName}
              onAddComment={onAddComment}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
