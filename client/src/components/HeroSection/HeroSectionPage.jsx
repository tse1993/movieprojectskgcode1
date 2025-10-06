import HeroSectionView from "./HeroSectionView.jsx";

/** @typedef {import("../../assets/types/movieDisplays/featuredMovie").HeroSectionProps} HeroSectionProps */

/** @param {HeroSectionProps} props */
export default function HeroSectionPage(props) {
  if (!props.featuredMovie) return null;
  return <HeroSectionView {...props} />;
}
