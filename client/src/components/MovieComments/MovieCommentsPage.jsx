import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

//types
/** @typedef {import("./types/feed/movieComment").movieComment} movieComment */
/** @typedef {import("./types/pagesProps/movieCommentsProps").movieCommentsProps} movieCommentsProps */

export default function MovieCommentsPage({ movieId, comments, currentUserName, onAddComment }) {
    const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Φιλτράρουμε μόνο τα σχόλια για τη συγκεκριμένη ταινία
  const movieComments = comments.filter(
    (comment) => String(comment.movieId) === String(movieId)
  );

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      onAddComment(movieId, newComment.trim());
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffInMs = Date.now() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comments ({movieComments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
            <span className="text-sm font-medium">
              {currentUserName?.charAt(0)?.toUpperCase() ?? "U"}
            </span>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your thoughts about this movie..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {movieComments.length > 0 && <Separator />}

      {/* Comments List */}
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {movieComments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          movieComments
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}