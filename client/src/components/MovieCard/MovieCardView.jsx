import { Star, Calendar } from "lucide-react";
import { Card, CardContent } from "../../assets/ui/card";
import { Badge } from "../../assets/ui/badge";

/** @typedef {import("../../assets/types/pagesProps/movieCardProps").MovieCardProps}  MovieCardProps */

/**
 * View: καθαρό UI.
 * @param {MovieCardProps} props
 */
export default function MovieCardView({ movie, onClick }) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={() => onClick?.(movie)}
    >
      <div className="aspect-[3/4] overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-1 mb-2">{movie.title}</h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              {movie.releaseDate
                ? new Date(movie.releaseDate).getFullYear()
                : 'N/A'}
            </span>
          </div>
        </div>

        <Badge variant="secondary" className="mt-2 text-xs">
          {movie.genre}
        </Badge>
      </CardContent>
    </Card>
  );
}
