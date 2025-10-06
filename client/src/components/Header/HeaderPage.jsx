import HeaderView from "./HeaderView.jsx";

/** @typedef {import("../../assets/types/pagesProps/HeaderProps").HeaderProps} HeaderProps */

/** @param {HeaderProps} props */
export default function HeaderPage(props) {
  return <HeaderView {...props} />;
}
