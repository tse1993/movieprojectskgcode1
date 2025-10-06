import PopularMoviesView from "./PopularMoviesView.jsx";
/** @typedef {import("../../assets/types/pagesProps/popularMoviesPage").PopularMoviesPageProps} PopularMoviesPageProps */

/** @param {PopularMoviesPageProps} props */
export default function PopularMoviesPage(props) {
  return <PopularMoviesView {...props} />;
}
