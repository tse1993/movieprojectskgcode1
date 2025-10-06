import MovieDetailsView from "./MovieDetailsView.jsx";

/** @typedef {import("../types/movieDisplays/movieStruct").movieDetailsProps} movieDetailsProps */
/** @typedef {import("../types/feed/movieComment").MovieComment} movieComment */

/**
 * Container: περνάει τα props στη View.
 * @param {movieDetailsProps} props
 */
export default function MovieDetailsPage(props) {
  return <MovieDetailsView {...props} />;
}
