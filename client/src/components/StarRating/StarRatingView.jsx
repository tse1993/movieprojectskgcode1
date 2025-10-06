import { Star } from "lucide-react";
import { cn } from "../../assets/lib/utils";

/** @typedef {import("../../assets/types/pagesProps/starRatingViewProps").StarRatingProps} StarRatingProps */

/** @param {StarRatingProps} props */
export default function StarRatingView({
  currentRating,
  hoveredRating,
  onStarClick,
  onStarHover,
  onMouseLeave,
  className,
}) {
  const displayRating = hoveredRating || currentRating;

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium mr-2">Your Rating:</span>
        <div className="flex items-center space-x-1" onMouseLeave={onMouseLeave}>
          {[1,2,3,4,5,6,7,8,9,10].map((star) => (
            <button
              key={star}
              onClick={() => onStarClick(star)}
              onMouseEnter={() => onStarHover(star)}
              className={cn(
                "transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm",
                "p-0.5"
              )}
              type="button"
              aria-label={`Rate ${star} out of 10`}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors duration-150",
                  star <= displayRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-transparent text-gray-300 hover:text-yellow-300"
                )}
              />
            </button>
          ))}
        </div>
        {currentRating > 0 && (
          <span className="text-sm text-muted-foreground ml-2">
            {currentRating}/10
          </span>
        )}
      </div>

      <div className="h-4 text-xs">
        {hoveredRating > 0 ? (
          <div className="text-muted-foreground">Click to rate {hoveredRating}/10</div>
        ) : currentRating > 0 ? (
          <div className="text-green-600">Rated {currentRating}/10 ✓</div>
        ) : (
          <div className="invisible">Placeholder</div>
        )}
      </div>
    </div>
  );
}
