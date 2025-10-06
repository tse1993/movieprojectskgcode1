import MovieCardView from "./MovieCardView.jsx";

/** @typedef {import("../types/pagesProps/movieCardProps").MovieCardProps}  MovieCardProps */

/**
 * Container: απλώς περνάει τα props στη view.
 * @param {MovieCardProps} props
 */
export default function MovieCardPage(props) {
  return <MovieCardView {...props} />;
}
