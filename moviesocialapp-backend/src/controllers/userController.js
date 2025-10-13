const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const tmdbApi = require('../utils/tmdbApi');
const bcrypt = require('bcrypt');

class UserController {
  async getProfile(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne(
        { _id: req.user.userId },
        { projection: { password: 0 } } // Exclude password
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Transform response to match login format (id instead of _id)
      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  }

  async getUserStatistics(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const stats = {
        moviesRated: user.ratings.length,
        averageRating: user.ratings.length > 0
          ? user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length
          : 0,
        favoriteCount: user.favorites.length,
        watchlistCount: user.watchlist.length,
        memberSince: user.createdAt.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      res.json(stats);
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ message: 'Error fetching statistics' });
    }
  }

  async rateMovie(req, res) {
    try {
      const { tmdbId, rating } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || !rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: 'Valid tmdbId and rating (1-10) required' });
      }

      // Remove existing rating for this movie
      await db.collection('users').updateOne(
        { _id: userId },
        { $pull: { ratings: { tmdbId: parseInt(tmdbId) } } }
      );

      // Add new rating
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $push: {
            ratings: {
              tmdbId: parseInt(tmdbId),
              rating: parseInt(rating),
              ratedAt: new Date()
            }
          }
        }
      );

      res.json({ message: 'Rating saved successfully' });
    } catch (error) {
      console.error('Rate movie error:', error);
      res.status(500).json({ message: 'Error saving rating' });
    }
  }

  async getUserRatings(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each rated movie
      const ratingsWithMovies = await Promise.all(
        user.ratings.map(async (rating) => {
          try {
            const movie = await tmdbApi.getMovieDetails(rating.tmdbId);
            return {
              ...rating,
              movie
            };
          } catch (error) {
            console.error(`Error fetching movie ${rating.tmdbId}:`, error);
            return rating; // Return rating without movie details if TMDB fails
          }
        })
      );

      res.json(ratingsWithMovies);
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ message: 'Error fetching ratings' });
    }
  }

  async clearAllRatings(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { ratings: [] } }
      );
      res.json({ message: 'All ratings cleared successfully' });
    } catch (error) {
      console.error('Clear ratings error:', error);
      res.status(500).json({ message: 'Error clearing ratings' });
    }
  }

  async toggleFavorite(req, res) {
    try {
      const { tmdbId } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId) {
        return res.status(400).json({ message: 'tmdbId is required' });
      }

      const user = await db.collection('users').findOne({ _id: userId });
      const isFavorite = user.favorites.includes(parseInt(tmdbId));

      if (isFavorite) {
        // Remove from favorites
        await db.collection('users').updateOne(
          { _id: userId },
          { $pull: { favorites: parseInt(tmdbId) } }
        );
        res.json({ message: 'Removed from favorites', isFavorite: false });
      } else {
        // Add to favorites
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { favorites: parseInt(tmdbId) } }
        );
        res.json({ message: 'Added to favorites', isFavorite: true });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ message: 'Error updating favorites' });
    }
  }

  async getUserFavorites(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each favorite
      const favoriteMovies = await Promise.all(
        user.favorites.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              ...movie,
              addedAt: new Date().toISOString() // Simplified - could track actual add date
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      res.json(favoriteMovies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error fetching favorites' });
    }
  }

  async clearAllFavorites(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { favorites: [] } }
      );
      res.json({ message: 'All favorites cleared successfully' });
    } catch (error) {
      console.error('Clear favorites error:', error);
      res.status(500).json({ message: 'Error clearing favorites' });
    }
  }

  async toggleWatchlist(req, res) {
    try {
      const { tmdbId } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId) {
        return res.status(400).json({ message: 'tmdbId is required' });
      }

      const user = await db.collection('users').findOne({ _id: userId });
      const isInWatchlist = user.watchlist.includes(parseInt(tmdbId));

      if (isInWatchlist) {
        // Remove from watchlist
        await db.collection('users').updateOne(
          { _id: userId },
          { $pull: { watchlist: parseInt(tmdbId) } }
        );
        res.json({ message: 'Removed from watchlist', isInWatchlist: false });
      } else {
        // Add to watchlist
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { watchlist: parseInt(tmdbId) } }
        );
        res.json({ message: 'Added to watchlist', isInWatchlist: true });
      }
    } catch (error) {
      console.error('Toggle watchlist error:', error);
      res.status(500).json({ message: 'Error updating watchlist' });
    }
  }

  async getUserWatchlist(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each watchlist item
      const watchlistMovies = await Promise.all(
        user.watchlist.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              ...movie,
              addedAt: new Date().toISOString() // Simplified - could track actual add date
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      res.json(watchlistMovies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ message: 'Error fetching watchlist' });
    }
  }

  async clearAllWatchlist(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { watchlist: [] } }
      );
      res.json({ message: 'All watchlist items cleared successfully' });
    } catch (error) {
      console.error('Clear watchlist error:', error);
      res.status(500).json({ message: 'Error clearing watchlist' });
    }
  }

  /**
   * Update user profile (name)
   * PUT /api/user/profile
   * Body: { name }
   */
  async updateProfile(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          message: 'Name is required'
        });
      }

      if (name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({
          message: 'Name must be between 2 and 50 characters'
        });
      }

      // Update user profile
      const result = await db.collection('users').updateOne(
        { _id: userId },
        { $set: { name: name.trim() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Return updated user (without password)
      const updatedUser = await db.collection('users').findOne(
        { _id: userId },
        { projection: { password: 0 } }
      );

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Change user password
   * PUT /api/user/password
   * Body: { currentPassword, newPassword }
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: 'New password must be at least 6 characters'
        });
      }

      // Get user with password
      const user = await db.collection('users').findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { password: hashedPassword } }
      );

      res.json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Get public profile for any user (for viewing other users' profiles)
   * GET /api/users/:userId/public-profile
   */
  async getPublicProfile(req, res) {
    try {
      const { userId } = req.params;
      const db = getDB();

      // Validate userId format
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // Find user by ID
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0, email: 0 } } // Exclude sensitive data
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Calculate statistics
      const stats = {
        ratingsCount: user.ratings.length,
        averageRating: user.ratings.length > 0
          ? Math.round((user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length) * 10) / 10
          : 0,
        favoritesCount: user.favorites.length,
        watchlistCount: user.watchlist.length
      };

      // Get recent ratings (last 5, sorted by date)
      const recentRatings = user.ratings
        .sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt))
        .slice(0, 5);

      // Fetch movie details for recent ratings
      const recentActivity = await Promise.all(
        recentRatings.map(async (rating) => {
          try {
            const movie = await tmdbApi.getMovieDetails(rating.tmdbId);
            return {
              type: 'rating',
              movie: {
                id: movie.id,
                title: movie.title,
                posterUrl: movie.posterUrl
              },
              rating: rating.rating,
              date: rating.ratedAt
            };
          } catch (error) {
            console.error(`Error fetching movie ${rating.tmdbId}:`, error);
            return null;
          }
        })
      );

      // Get recent comments from the user
      const recentComments = await db.collection('comments')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      // Fetch movie details for recent comments
      const commentsActivity = await Promise.all(
        recentComments.map(async (comment) => {
          try {
            const movie = await tmdbApi.getMovieDetails(comment.tmdbId);
            return {
              type: 'comment',
              movie: {
                id: movie.id,
                title: movie.title,
                posterUrl: movie.posterUrl
              },
              content: comment.content,
              date: comment.createdAt
            };
          } catch (error) {
            console.error(`Error fetching movie ${comment.tmdbId}:`, error);
            return null;
          }
        })
      );

      // Combine and sort all activity by date
      const allActivity = [...recentActivity, ...commentsActivity]
        .filter(item => item !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

      // Get favorite movies (top 6 for display)
      const topFavorites = user.favorites.slice(0, 6);
      const favoriteMovies = await Promise.all(
        topFavorites.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              id: movie.id,
              title: movie.title,
              posterUrl: movie.posterUrl,
              rating: movie.rating
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Get watchlist movies (top 6 for display)
      const topWatchlist = user.watchlist.slice(0, 6);
      const watchlistMovies = await Promise.all(
        topWatchlist.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              id: movie.id,
              title: movie.title,
              posterUrl: movie.posterUrl,
              rating: movie.rating
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Build response
      const publicProfile = {
        user: {
          id: user._id,
          name: user.name,
          createdAt: user.createdAt
        },
        statistics: stats,
        recentActivity: allActivity,
        favorites: favoriteMovies.filter(movie => movie !== null),
        watchlist: watchlistMovies.filter(movie => movie !== null)
      };

      res.json(publicProfile);
    } catch (error) {
      console.error('Get public profile error:', error);
      res.status(500).json({ message: 'Error fetching public profile' });
    }
  }
}

module.exports = new UserController();
