import NewReleasesView from "./NewReleasesView.jsx";
/** @typedef {import("../types/pagesProps/newReleasesPageProps").NewReleasesPageProps} NewReleasesPageProps */

/** @param {NewReleasesPageProps} props */
export default function NewReleasesPage(props) {
  return <NewReleasesView {...props} />;
}
