import { useState, useEffect } from "react";
import StarRatingView from "./StarRatingView.jsx";

/** @typedef {import("../types/pagesProps/starRatingProps").StarRatingProps} StarRatingProps */

/** @param {StarRatingProps} props */
export default function StarRatingPage({ movieId, initialRating = 0, onRate, className }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  useEffect(() => {
    setCurrentRating(initialRating);
  }, [initialRating]);

  const handleStarClick = (rating) => {
    setCurrentRating(rating);
    onRate(movieId, rating);
  };

  const handleStarHover = (rating) => setHoveredRating(rating);
  const handleMouseLeave = () => setHoveredRating(0);

  return (
    <StarRatingView
      currentRating={currentRating}
      hoveredRating={hoveredRating}
      onStarClick={handleStarClick}
      onStarHover={handleStarHover}
      onMouseLeave={handleMouseLeave}
      className={className}
    />
  );
}
