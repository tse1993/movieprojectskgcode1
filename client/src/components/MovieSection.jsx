import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { MovieCard } from "./MovieCard.jsx";

//types
/** @typedef {import("./types/movieDisplays/movieStruct").Movie} Movie */
/** @typedef {import("../types/movie-section").MovieSectionProps} MovieSectionProps */

/** @param {MovieSectionProps} props */
export default function MovieSection({
  title,
  movies,
  onMovieClick,
  onViewAll,
  onRateMovie,
  getUserRatingForMovie,
  onToggleFavorite,
  isMovieFavorite,
  onToggleWatchlist,
  isMovieInWatchlist,
}) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const checkScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  /** @param {"left"|"right"} direction */
  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 320; // ~πλάτος κάρτας + gap
    const newScrollLeft =
      direction === "left" ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount;

    el.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  // Τα 10 πρώτα
  const displayMovies = movies.slice(0, 10);

  // Έλεγχος κουμπιών στο mount & όταν αλλάζουν τα movies
  useEffect(() => {
    const timer = setTimeout(checkScrollButtons, 100);
    return () => clearTimeout(timer);
  }, [movies]);

  // TODO: επέστρεψε εδώ το JSX σου (header, carousel, κ.λπ.)
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button
          variant="ghost"
          onClick={onViewAll}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Movies Carousel */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={checkScrollButtons}
        >
          {displayMovies.map((movie) => (
            <div key={movie.id} className="flex-none w-72">
              <MovieCard
                movie={movie}
                onClick={() => onMovieClick(movie)}
                onRateMovie={onRateMovie}
                getUserRatingForMovie={getUserRatingForMovie}
                onToggleFavorite={onToggleFavorite}
                isMovieFavorite={isMovieFavorite}
                onToggleWatchlist={onToggleWatchlist}
                isMovieInWatchlist={isMovieInWatchlist}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}