import TopRatedView from "./TopRatedView.jsx";
/** @typedef {import("../types/pagesProps/topRatedPageProps").TopRatedPageProps} TopRatedPageProps */

/** @param {TopRatedPageProps} props */
export default function TopRatedPage(props) {
  return <TopRatedView {...props} />;
}
