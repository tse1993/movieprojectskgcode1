import { Play, Info, Star } from "lucide-react";
import { Button } from "../../assets/ui/button";
import { Badge } from "../../assets/ui/badge";

/** @typedef {import("../../assets/types/movieDisplays/featuredMovie").HeroSectionProps} HeroSectionProps */
/** @param {HeroSectionProps} props */
export default function HeroSectionView({ featuredMovie, onMovieClick }) {
  return (
    <section
      className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.6)), url(${featuredMovie.posterUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container relative z-10 text-center text-white">
        <Badge variant="secondary" className="mb-4">
          Featured Movie
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {featuredMovie.title}
        </h1>

        <div className="flex items-center justify-center space-x-4 mb-6 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{featuredMovie.rating}/10</span>
          </div>
          <span>•</span>
          <span>{new Date(featuredMovie.releaseDate).getFullYear()}</span>
          <span>•</span>
          <span>{featuredMovie.genre}</span>
        </div>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
          {featuredMovie.overview}
        </p>

        <div className="flex items-center justify-center space-x-4">
          <Button size="lg" className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Watch Trailer</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => onMovieClick(featuredMovie)}
          >
            <Info className="h-5 w-5" />
            <span>More Info</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
