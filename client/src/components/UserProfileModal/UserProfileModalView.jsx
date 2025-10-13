import { User, Calendar, Star, Heart, Bookmark, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../assets/ui/dialog";
import { Button } from "../../assets/ui/button";
import { Badge } from "../../assets/ui/badge";
import { Separator } from "../../assets/ui/separator";
import { Card, CardContent } from "../../assets/ui/card";

/**
 * View: User Profile Modal - Similar UI to MovieDetailsModal
 */
export default function UserProfileModalView({
  profile,
  isOpen,
  isLoading,
  onClose
}) {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatActivityDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] overflow-y-auto">
        {/* Loading Overlay - Same style as MovieDetailsModal */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle>{profile?.user?.name || 'User Profile'}</DialogTitle>
          <DialogDescription>
            View {profile?.user?.name}'s movie preferences and activity
          </DialogDescription>
          <Button
            variant="outline"
            className="absolute right-4 top-4 bg-black text-white hover:bg-gray-800 hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogHeader>

        {profile && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - User Info & Stats */}
            <div className="md:col-span-1 space-y-4">
              {/* User Avatar */}
              <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <User className="h-32 w-32 text-primary/40" />
              </div>

              {/* User Info Card */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatDate(profile.user.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Card */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-lg mb-3">Statistics</h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Movies Rated</span>
                    </div>
                    <Badge variant="secondary">{profile.statistics.ratingsCount}</Badge>
                  </div>

                  {profile.statistics.ratingsCount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{profile.statistics.averageRating}/10</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Favorites</span>
                    </div>
                    <Badge variant="secondary">{profile.statistics.favoritesCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bookmark className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Watchlist</span>
                    </div>
                    <Badge variant="secondary">{profile.statistics.watchlistCount}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Favorites, Watchlist & Activity */}
            <div className="md:col-span-2 space-y-6">
              {/* Favorite Movies */}
              {profile.favorites && profile.favorites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Favorite Movies</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {profile.favorites.map((movie) => (
                      <Card key={movie.id} className="overflow-hidden">
                        <div className="flex space-x-3 p-3">
                          {/* Small poster like feed */}
                          <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded-md">
                            {movie.posterUrl ? (
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <Star className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Movie info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{movie.title}</p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{movie.rating}/10</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Watchlist Movies */}
              {profile.watchlist && profile.watchlist.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Bookmark className="h-5 w-5 text-blue-500" />
                    <span>Watchlist</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {profile.watchlist.map((movie) => (
                      <Card key={movie.id} className="overflow-hidden">
                        <div className="flex space-x-3 p-3">
                          {/* Small poster like feed */}
                          <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded-md">
                            {movie.posterUrl ? (
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <Star className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Movie info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{movie.title}</p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{movie.rating}/10</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                {profile.recentActivity && profile.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {profile.recentActivity.map((activity, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            {/* Movie Poster Thumbnail */}
                            {activity.movie.posterUrl && (
                              <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={activity.movie.posterUrl}
                                  alt={activity.movie.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Activity Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                {activity.type === 'rating' ? (
                                  <>
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm font-medium">
                                      Rated <span className="font-bold">{activity.movie.title}</span>
                                    </span>
                                    <Badge variant="secondary">{activity.rating}/10</Badge>
                                  </>
                                ) : (
                                  <>
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">
                                      Commented on <span className="font-bold">{activity.movie.title}</span>
                                    </span>
                                  </>
                                )}
                              </div>

                              {activity.type === 'comment' && activity.content && (
                                <p className="text-sm text-muted-foreground mt-2">"{activity.content}"</p>
                              )}

                              <p className="text-xs text-muted-foreground mt-2">
                                {formatActivityDate(activity.date)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
