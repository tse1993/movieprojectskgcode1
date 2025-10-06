import { ArrowLeft, MessageCircle, Star, Calendar, Film } from "lucide-react";
import { Button } from "../../assets/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../assets/ui/card";
import { Separator } from "../../assets/ui/separator";
import { Badge } from "../../assets/ui/badge";

/** @typedef {import("../../assets/types/feed/comment").Comment} Comment */
/** @typedef {import("../../assets/types/pagesProps/FeedViewProps").FeedViewProps} FeedViewProps */

/** @param {FeedViewProps} props */
export default function FeedView({ user, onBack, comments, formatDate }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Movies</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <h1 className="text-2xl font-semibold">Feed</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Feed List */}
          <Card>
            <CardHeader>
              <CardTitle>Review Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {comments.map((comment, index) => (
                <div key={comment.id}>
                  <div className="flex space-x-4">
                    {/* Movie Poster */}
                    <div className="flex-shrink-0">
                      <img
                        src={comment.moviePoster}
                        alt={comment.movieTitle}
                        className="w-16 h-24 object-cover rounded-md"
                      />
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 space-y-3">
                      {/* Movie Info */}
                      <div className="flex items-center space-x-2">
                        <Film className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{comment.movieTitle}</h3>
                        <span className="text-muted-foreground">
                          ({comment.movieYear})
                        </span>
                        {comment.rating && (
                          <Badge variant="secondary" className="ml-auto">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {comment.rating}/10
                          </Badge>
                        )}
                      </div>

                      {/* Comment Text */}
                      <p className="text-muted-foreground leading-relaxed">
                        {comment.commentText}
                      </p>

                      {/* Comment Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(comment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="h-3 w-3 rounded-full bg-red-500 flex items-center justify-center">
                              <span className="text-white text-xs">♥</span>
                            </div>
                            <span>{comment.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < comments.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Empty State */}
          {comments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start reviewing movies to see your activity here!
                </p>
                <Button onClick={onBack}>Browse Movies</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
