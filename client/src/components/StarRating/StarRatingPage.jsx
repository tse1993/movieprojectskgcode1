import { useState, useEffect } from "react";
import StarRatingView from "./StarRatingView.jsx";

/** @typedef {import("../../assets/types/pagesProps/starRatingProps").StarRatingProps} StarRatingProps */

/** @param {StarRatingProps} props */
export default function StarRatingPage({ movieId, initialRating = 0, onRate, className }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  useEffect(() => {
    setCurrentRating(initialRating);
  }, [initialRating]);

  const handleStarClick = (rating) => {
    try {
      setCurrentRating(rating);
      onRate(movieId, rating);
    } catch (error) {
      console.error('[StarRatingPage] Failed to set rating:', error);
      // Revert to previous rating on error
      setCurrentRating(initialRating);
      throw error;
    }
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
