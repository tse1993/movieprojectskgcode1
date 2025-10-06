import { useState } from "react";
import Header from "./Header/HeaderPage.jsx";
import HeroSectionPage from "./HeroSection/HeroSectionPage.jsx";
import MovieGridPage from "./MovieGrid/MovieGridPage.jsx";
import MovieDetailsPage from "./MovieDetails/MovieDetailsPage.jsx";
import MovieSectionPage from "./MovieSection/MovieSectionPage.jsx";
import MovieCommentsPage from "./MovieComments/MovieCommentsPage.jsx";

import { Button } from "../assets/ui/button";
import { movies, genres, getMoviesByGenre, searchMovies, getPopularMovies, getTopRatedMovies, getNewReleases } from "../data/movies";

// @ts-check
/** @typedef {import("./types/pagesProps/mainAppProps.js").MainAppProps} MainAppProps*/

export default function MainApp({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToProfile,
  onNavigateToFeed,
  onNavigateToPopular,
  onNavigateToTopRated,
  onNavigateToNewReleases,
  onRateMovie,
  getUserRatingForMovie,
  onToggleFavorite,
  isMovieFavorite,
  onMoviePopupChange,
  movieComments,
  onAddComment,
  onToggleWatchlist,
  isMovieInWatchlist,
}) {
  
    // state
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // featured
    const featuredMovie = movies[0]; // πρώτη ταινία ως featured

    // @ts-check

    /** @typedef {{id:number,title:string,posterUrl:string,rating:number,releaseDate:string,genre:string,overview:string}} Movie */

    /** @param {Movie} movie */
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setIsDetailsOpen(true);
        onMoviePopupChange(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedMovie(null);
        onMoviePopupChange(false);
    };

    /** @param {string} query */
    const handleSearch = (query) => {
        setSearchQuery(query);
        setSelectedGenre("All");
    };

    const handleGenreChange = (genre) => {
      setSelectedGenre(genre);
      setSearchQuery(""); // reset search όταν αλλάζει το genre
    };

    // Φιλτράρισμα με βάση search ή genre
    const filteredMovies = searchQuery
    ? searchMovies(searchQuery)
    : getMoviesByGenre(selectedGenre);

    // Αν δείχνουμε "All" και δεν υπάρχει search, βγάλε το featured (πρώτο)
    const gridMovies =
    selectedGenre === "All" && !searchQuery
        ? filteredMovies.slice(1)
        : filteredMovies;

    return (
        <div className="min-h-screen bg-background">
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        user={user}
        onLogout={onLogout}
        onNavigateToSettings={onNavigateToSettings}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToFeed={onNavigateToFeed}
        onNavigateToPopular={onNavigateToPopular}
        onNavigateToTopRated={onNavigateToTopRated}
        onNavigateToNewReleases={onNavigateToNewReleases}
      />
      
      {!searchQuery && selectedGenre === "All" && (
        <HeroSectionPage 
          featuredMovie={featuredMovie} 
          onMovieClick={handleMovieClick}
        />
      )}

      {/* Genre Filter - Always visible */}
      <div className="container px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreChange(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Full-width Movie Sections */}
      {!searchQuery && selectedGenre === "All" && (
        <div className="w-full space-y-12 pb-8">
          {/* Popular Movies Section */}
          <div className="container px-4">
            <MovieSectionPage
              title="Popular Movies"
              movies={getPopularMovies()}
              onMovieClick={handleMovieClick}
              onViewAll={onNavigateToPopular}
              onRateMovie={onRateMovie}
              getUserRatingForMovie={getUserRatingForMovie}
              onToggleFavorite={onToggleFavorite}
              isMovieFavorite={isMovieFavorite}
              onToggleWatchlist={onToggleWatchlist}
              isMovieInWatchlist={isMovieInWatchlist}
            />
          </div>

          {/* Top Rated Section */}
          <div className="container px-4">
            <MovieSectionPage
              title="Top Rated"
              movies={getTopRatedMovies()}
              onMovieClick={handleMovieClick}
              onViewAll={onNavigateToTopRated}
              onRateMovie={onRateMovie}
              getUserRatingForMovie={getUserRatingForMovie}
              onToggleFavorite={onToggleFavorite}
              isMovieFavorite={isMovieFavorite}
              onToggleWatchlist={onToggleWatchlist}
              isMovieInWatchlist={isMovieInWatchlist}
            />
          </div>

          {/* New Releases Section */}
          <div className="container px-4">
            <MovieSectionPage
              title="New Releases"
              movies={getNewReleases()}
              onMovieClick={handleMovieClick}
              onViewAll={onNavigateToNewReleases}
              onRateMovie={onRateMovie}
              getUserRatingForMovie={getUserRatingForMovie}
              onToggleFavorite={onToggleFavorite}
              isMovieFavorite={isMovieFavorite}
              onToggleWatchlist={onToggleWatchlist}
              isMovieInWatchlist={isMovieInWatchlist}
            />
          </div>
        </div>
      )}

      {/* Movies Grid - Only show when filtering */}
      {(searchQuery || selectedGenre !== "All") && (
        <main className="container px-4 py-8">
          <MovieGridPage
            movies={gridMovies}
            onMovieClick={handleMovieClick}
            title={
              searchQuery 
                ? `Search results for "${searchQuery}"` 
                : `${selectedGenre} Movies`
            }
            onRateMovie={onRateMovie}
            getUserRatingForMovie={getUserRatingForMovie}
            onToggleFavorite={onToggleFavorite}
            isMovieFavorite={isMovieFavorite}
            onToggleWatchlist={onToggleWatchlist}
            isMovieInWatchlist={isMovieInWatchlist}
          />
        </main>
      )}

      <MovieDetailsPage
        movie={selectedMovie}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onRateMovie={onRateMovie}
        getUserRatingForMovie={getUserRatingForMovie}
        onToggleFavorite={onToggleFavorite}
        isMovieFavorite={isMovieFavorite}
        movieComments={movieComments}
        onAddComment={onAddComment}
        currentUserName={user?.name || user?.email?.split('@')[0] || "Anonymous"}
        onToggleWatchlist={onToggleWatchlist}
        isMovieInWatchlist={isMovieInWatchlist}
      />

      {/* Footer */}
      <footer className="mt-16" style={{ backgroundColor: '#383838', paddingTop: '3%', paddingBottom: '3%' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start">
            <a 
              href="#" 
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              This project created with ❤ by Skg team B
            </a>
          </div>
        </div>
      </footer>
    </div>
    );
}