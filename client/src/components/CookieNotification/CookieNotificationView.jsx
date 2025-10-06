// src/components/pages/CookieNotificationView.jsx
import { X, Cookie } from "lucide-react";
import { Button } from "../../assets/ui/button";
import { Card } from "../../assets/ui/card";

/** @typedef {import("../../assets/types/pagesProps/CookieNotificationViewProps").CookieNotificationViewProps} CookieNotificationViewProps */

/**
 * View: μόνο το UI/markup.
 * @param {CookieNotificationViewProps} props
 */
export default function CookieNotificationView({
  isOpen,
  onAccept,
  onDecline,
  onDismiss,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold mb-1">We use cookies</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, serve
                  personalized content, and analyze our traffic. By clicking
                  "Accept All", you consent to our use of cookies. You can
                  manage your preferences or learn more about our cookie policy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={onAccept} size="sm" className="flex-1 sm:flex-none">
                  Accept All
                </Button>
                <Button
                  onClick={onDecline}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Decline
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="flex-shrink-0 h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
