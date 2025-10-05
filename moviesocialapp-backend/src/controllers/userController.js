const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const tmdbApi = require('../utils/tmdbApi');

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

      res.json(user);
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
}

module.exports = new UserController();
