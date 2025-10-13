import UserProfileModalView from "./UserProfileModalView.jsx";

/**
 * Container: User Profile Modal
 * This is a simple pass-through container since all logic is handled by parent (FeedPage)
 */
export default function UserProfileModal(props) {
  return <UserProfileModalView {...props} />;
}
