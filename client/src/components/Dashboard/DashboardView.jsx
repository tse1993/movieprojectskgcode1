import Header from "../Header/HeaderPage.jsx";
import HeroSectionPage from "../HeroSection/HeroSectionPage.jsx";
import MovieGridPage from "../MovieGrid/MovieGridPage.jsx";
import MovieDetailsPage from "../MovieDetails/MovieDetailsPage.jsx";
import MovieSectionPage from "../MovieSection/MovieSectionPage.jsx";
import { Button } from "../../assets/ui/button.jsx";

// @ts-check
/** @typedef {import("../../assets/types/pagesProps/DashboardViewProps.js").DashboardViewProps} DashboardViewProps */

/** @param {DashboardViewProps} props */
export default function DashboardView(props) {
  const {
    user,
    onLogout,
    onNavigateToSettings,
    onNavigateToProfile,
    onNavigateToFeed,
    onNavigateToPopular,
    onNavigateToTopRated,
    onNavigateToNewReleases,

    searchQuery,
    selectedGenre,
    onSearch,
    onGenreChange,
    genres,

    featuredMovie,
    popularMovies,
    topRatedMovies,
    newReleases,
    gridMovies,

    onMovieClick,
    onRateMovie,
    getUserRatingForMovie,
    onToggleFavorite,
    isMovieFavorite,
    onToggleWatchlist,
    isMovieInWatchlist,

    selectedMovie,
    isDetailsOpen,
    onCloseDetails,

    movieComments,
    onAddComment,
    currentUserName,
  } = props;

  const showLandingSections = !searchQuery && selectedGenre === "All";

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={onSearch}
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

      {showLandingSections && featuredMovie && (
        <HeroSectionPage
          featuredMovie={featuredMovie}
          onMovieClick={onMovieClick}
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
              onClick={() => onGenreChange(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Full-width Movie Sections */}
      {showLandingSections && (
        <div className="w-full space-y-12 pb-8">
          {/* Popular Movies Section */}
          <div className="container px-4">
            <MovieSectionPage
              title="Popular Movies"
              movies={popularMovies}
              onMovieClick={onMovieClick}
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
              movies={topRatedMovies}
              onMovieClick={onMovieClick}
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
              movies={newReleases}
              onMovieClick={onMovieClick}
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
            onMovieClick={onMovieClick}
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

      {/* Movie Details Modal */}
      <MovieDetailsPage
        movie={selectedMovie}
        isOpen={isDetailsOpen}
        onClose={onCloseDetails}
        onRateMovie={onRateMovie}
        getUserRatingForMovie={getUserRatingForMovie}
        onToggleFavorite={onToggleFavorite}
        isMovieFavorite={isMovieFavorite}
        movieComments={movieComments}
        onAddComment={onAddComment}
        currentUserName={currentUserName}
        onToggleWatchlist={onToggleWatchlist}
        isMovieInWatchlist={isMovieInWatchlist}
      />

      {/* Footer */}
      <footer
        className="mt-16"
        style={{ backgroundColor: "#383838", paddingTop: "3%", paddingBottom: "3%" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start">
            <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200">
              This project created with ❤ by Skg team B
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
