import MovieDetailsView from "./MovieDetailsView.jsx";

/** @typedef {import("../../assets/types/movieDisplays/movieStruct").movieDetailsProps} movieDetailsProps */
/** @typedef {import("../../assets/types/feed/movieComment").MovieComment} movieComment */

/**
 * Container: περνάει τα props στη View.
 * @param {movieDetailsProps} props
 */
export default function MovieDetailsPage(props) {
  return <MovieDetailsView {...props} />;
}
