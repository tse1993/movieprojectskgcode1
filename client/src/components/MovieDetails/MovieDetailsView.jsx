import { Star, Calendar, Clock, Play, Heart, Bookmark } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import StarRatingPage from "../StarRating/StarRatingPage";
import MovieCommentsPage from "../MovieComments/MovieCommentsPage";
import { toast } from "sonner";

/** @typedef {import("../types/movieDisplays/movieStruct").movieDetailsProps} movieDetailsProps */
/** @typedef {import("../types/feed/movieComment").MovieComment} movieComment */

/**
 * View: περιέχει μόνο το UI + τοπικούς handlers.
 * @param {movieDetailsProps} props
 */
export default function MovieDetailsView({
  movie,
  isOpen,
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
  // Αν δεν υπάρχει ταινία ή δεν είναι ανοιχτό το modal, μην εμφανίζεις τίποτα
  if (!movie || !isOpen) return null;

  /** @param {string|number} movieId @param {number} rating */
  const handleRateMovie = (movieId, rating) => {
    onRateMovie(movieId, rating);
    toast.success(`Rated "${movie.title}" ${rating}/10 ⭐`);
  };

  const handleToggleFavorite = () => {
    const wasFavorite = isMovieFavorite(movie.id);
    onToggleFavorite(movie.id);
    if (wasFavorite) {
      toast.success(`Removed "${movie.title}" from favorites`);
    } else {
      toast.success(`Added "${movie.title}" to favorites ❤️`);
    }
  };

  const handleToggleWatchlist = () => {
    const wasInWatchlist = isMovieInWatchlist(movie.id);
    onToggleWatchlist(movie.id);
    if (wasInWatchlist) {
      toast.success(`Removed "${movie.title}" from watchlist`);
    } else {
      toast.success(`Added "${movie.title}" to watchlist 🕒`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] overflow-y-auto">
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
              <p>Error on Loading</p>
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
                  <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>2h 15m</span>
                </div>
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
                <Button className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Watch Trailer</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleWatchlist}
                  className="flex items-center space-x-2"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isMovieInWatchlist(movie.id)
                        ? "fill-blue-500 text-blue-500"
                        : "text-current"
                    }`}
                  />
                  <span>
                    {isMovieInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className="flex items-center space-x-2"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isMovieFavorite(movie.id)
                        ? "fill-red-500 text-red-500"
                        : "text-current"
                    }`}
                  />
                  <span>
                    {isMovieFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
                  </span>
                </Button>
              </div>

              <StarRatingPage
                movieId={movie.id}
                initialRating={getUserRatingForMovie(movie.id)}
                onRate={handleRateMovie}
                className="border-t pt-4"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Cast</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">John Actor</p>
                  <p className="text-muted-foreground">Main Character</p>
                </div>
                <div>
                  <p className="font-medium">Jane Actress</p>
                  <p className="text-muted-foreground">Supporting Role</p>
                </div>
                <div>
                  <p className="font-medium">Director Name</p>
                  <p className="text-muted-foreground">Director</p>
                </div>
                <div>
                  <p className="font-medium">Producer Name</p>
                  <p className="text-muted-foreground">Producer</p>
                </div>
              </div>
            </div>

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
