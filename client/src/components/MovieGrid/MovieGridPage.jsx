import MovieGridView from "./MovieGridView.jsx";

/** @typedef {import("../../assets/types/movieDisplays/movieGridProps").MovieGridProps} MovieGridProps */

/** @param {MovieGridProps} props */
export default function MovieGridPage(props) {
  return <MovieGridView {...props} />;
}
