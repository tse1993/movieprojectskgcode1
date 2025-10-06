import { useState, useEffect } from "react";
import CookieNotificationView from "./CookieNotificationView.jsx";

/** @typedef {import("../../assets/types/pagesProps/CookieNotificationProps").CookieNotificationProps} CookieNotificationProps */

/**
 * Container: διαχειρίζεται state, localStorage και business logic.
 * @param {CookieNotificationProps} props
 */
export default function CookieNotificationPage({ isMoviePopupOpen = false }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <CookieNotificationView
      isOpen={isVisible && !isMoviePopupOpen}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onDismiss={handleDismiss}
    />
  );
}
