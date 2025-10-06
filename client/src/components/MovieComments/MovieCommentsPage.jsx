import MovieCommentsView from "./MovieCommentsView.jsx";

/** @typedef {import("../../assets/types/feed/movieComment").movieComment} movieComment */
/** @typedef {import("../../assets/types/pagesProps/movieCommentsProps").movieCommentsProps} movieCommentsProps */

/**
 * Container: περνάει απλώς τα props στη view.
 * @param {movieCommentsProps} props
 */
export default function MovieCommentsPage(props) {
  return <MovieCommentsView {...props} />;
}
