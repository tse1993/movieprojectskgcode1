import FeedView from "./FeedView.jsx";
import { mockComments } from "@/data/comments";

/** @typedef {import("../../assets/types/pagesProps/feedPageProps").FeedPageProps} FeedPageProps */

/**
 * Container: κρατάει το minimal logic (formatDate) και τα δεδομένα (mockComments)
 * και τα περνάει στο view.
 * @param {FeedPageProps} props
 */
export default function FeedPage({ user, onBack }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <FeedView
      user={user}
      onBack={onBack}
      comments={mockComments}
      formatDate={formatDate}
    />
  );
}
