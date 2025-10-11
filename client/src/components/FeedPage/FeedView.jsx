import { ArrowLeft, MessageCircle, Star, Calendar, Film } from "lucide-react";
import { Button } from "../../assets/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../assets/ui/card";
import { Separator } from "../../assets/ui/separator";
import { Badge } from "../../assets/ui/badge";

/** @typedef {import("../../assets/types/feed/comment").Comment} Comment */
/** @typedef {import("../../assets/types/pagesProps/FeedViewProps").FeedViewProps} FeedViewProps */

/** @param {FeedViewProps} props */
export default function FeedView({ user, onBack, activities, formatDate, onLoadMore, hasMore, loadingMore, onMovieClick }) {
  console.log('[FeedView] Rendering with activities:', {
    count: activities.length,
    firstActivity: activities[0],
    firstPoster: activities[0]?.moviePoster
  });

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
              {activities.map((activity, index) => (
                <div key={activity._id || index}>
                  <div className="flex space-x-4">
                    {/* Movie Poster */}
                    <div
                      className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onMovieClick && onMovieClick(activity.tmdbId, activity.movieTitle)}
                    >
                      {activity.moviePoster ? (
                        <img
                          src={activity.moviePoster}
                          alt={activity.movieTitle || 'Movie poster'}
                          className="w-16 h-24 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-muted rounded-md flex items-center justify-center">
                          <Film className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 space-y-3">
                      {/* User & Movie Info */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{activity.userName || 'Anonymous'}</span>
                          <span className="text-muted-foreground text-sm">commented on</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Film className="h-4 w-4 text-muted-foreground" />
                          <h3
                            className="font-semibold cursor-pointer hover:text-primary transition-colors"
                            onClick={() => onMovieClick && onMovieClick(activity.tmdbId, activity.movieTitle)}
                          >
                            {activity.movieTitle || 'Unknown Movie'}
                          </h3>
                          {activity.movieYear && (
                            <span className="text-muted-foreground">
                              ({activity.movieYear})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comment Text */}
                      <p className="text-muted-foreground leading-relaxed">
                        {activity.content || ''}
                      </p>

                      {/* Comment Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < activities.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Load More Button */}
          {activities.length > 0 && hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="min-w-[200px]"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {activities.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start commenting on movies to see activity here!
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
