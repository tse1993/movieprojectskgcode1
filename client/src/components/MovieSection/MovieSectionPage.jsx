import MovieSectionView from "./MovieSectionView.jsx";

/** @typedef {import("../../assets/types/movie-section").MovieSectionProps} MovieSectionProps */

/** @param {MovieSectionProps} props */
export default function MovieSectionPage(props) {
  return <MovieSectionView {...props} />;
}
