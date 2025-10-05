const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class UserController {
  /**
   * Get user's ratings for movies
   * GET /api/user/ratings
   */
  async getUserRatings(req, res) {
    try {
      const userId = req.user.userId;
      const db = getDB();

      const ratings = await db.collection('ratings')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(ratings);
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ message: 'Error fetching ratings' });
    }
  }

  /**
   * Add or update a rating for a movie
   * POST /api/user/ratings
   * Body: { tmdbId, rating (1-10), review (optional) }
   */
  async addOrUpdateRating(req, res) {
    try {
      const { tmdbId, rating, review } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      // Validation
      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: 'Rating must be between 1 and 10' });
      }

      // Check if rating already exists
      const existingRating = await db.collection('ratings').findOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (existingRating) {
        // Update existing rating
        await db.collection('ratings').updateOne(
          { _id: existingRating._id },
          {
            $set: {
              rating: parseFloat(rating),
              review: review || null,
              updatedAt: new Date()
            }
          }
        );

        const updatedRating = await db.collection('ratings').findOne({ _id: existingRating._id });
        return res.json({ message: 'Rating updated', rating: updatedRating });
      } else {
        // Create new rating
        const newRating = {
          userId: new ObjectId(userId),
          tmdbId: parseInt(tmdbId),
          rating: parseFloat(rating),
          review: review || null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('ratings').insertOne(newRating);
        const createdRating = await db.collection('ratings').findOne({ _id: result.insertedId });
        return res.status(201).json({ message: 'Rating added', rating: createdRating });
      }
    } catch (error) {
      console.error('Add/update rating error:', error);
      res.status(500).json({ message: 'Error saving rating' });
    }
  }

  /**
   * Get a specific rating for a movie
   * GET /api/user/ratings/:tmdbId
   */
  async getRatingForMovie(req, res) {
    try {
      const { tmdbId } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const rating = await db.collection('ratings').findOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (!rating) {
        return res.status(404).json({ message: 'Rating not found' });
      }

      res.json(rating);
    } catch (error) {
      console.error('Get rating error:', error);
      res.status(500).json({ message: 'Error fetching rating' });
    }
  }

  /**
   * Delete a rating
   * DELETE /api/user/ratings/:tmdbId
   */
  async deleteRating(req, res) {
    try {
      const { tmdbId } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const result = await db.collection('ratings').deleteOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Rating not found' });
      }

      res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
      console.error('Delete rating error:', error);
      res.status(500).json({ message: 'Error deleting rating' });
    }
  }

  /**
   * Get user's favorites
   * GET /api/user/favorites
   */
  async getFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const db = getDB();

      const favorites = await db.collection('favorites')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(favorites);
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error fetching favorites' });
    }
  }

  /**
   * Add a movie to favorites
   * POST /api/user/favorites
   * Body: { tmdbId, title, posterPath, releaseDate }
   */
  async addToFavorites(req, res) {
    try {
      const { tmdbId, title, posterPath, releaseDate } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      if (!title) {
        return res.status(400).json({ message: 'Movie title is required' });
      }

      // Check if already in favorites
      const existing = await db.collection('favorites').findOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (existing) {
        return res.status(400).json({ message: 'Movie already in favorites' });
      }

      const favorite = {
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId),
        title,
        posterPath: posterPath || null,
        releaseDate: releaseDate || null,
        createdAt: new Date()
      };

      const result = await db.collection('favorites').insertOne(favorite);
      const createdFavorite = await db.collection('favorites').findOne({ _id: result.insertedId });

      res.status(201).json({ message: 'Added to favorites', favorite: createdFavorite });
    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({ message: 'Error adding to favorites' });
    }
  }

  /**
   * Remove a movie from favorites
   * DELETE /api/user/favorites/:tmdbId
   */
  async removeFromFavorites(req, res) {
    try {
      const { tmdbId } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const result = await db.collection('favorites').deleteOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Movie not in favorites' });
      }

      res.json({ message: 'Removed from favorites' });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({ message: 'Error removing from favorites' });
    }
  }

  /**
   * Check if a movie is in favorites
   * GET /api/user/favorites/:tmdbId
   */
  async isFavorite(req, res) {
    try {
      const { tmdbId } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const favorite = await db.collection('favorites').findOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      res.json({ isFavorite: !!favorite });
    } catch (error) {
      console.error('Check favorite error:', error);
      res.status(500).json({ message: 'Error checking favorite status' });
    }
  }

  /**
   * Get user's watchlist
   * GET /api/user/watchlist
   */
  async getWatchlist(req, res) {
    try {
      const userId = req.user.userId;
      const db = getDB();

      const watchlist = await db.collection('watchlist')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(watchlist);
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ message: 'Error fetching watchlist' });
    }
  }

  /**
   * Add a movie to watchlist
   * POST /api/user/watchlist
   * Body: { tmdbId, title, posterPath, releaseDate }
   */
  async addToWatchlist(req, res) {
    try {
      const { tmdbId, title, posterPath, releaseDate } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      if (!title) {
        return res.status(400).json({ message: 'Movie title is required' });
      }

      // Check if already in watchlist
      const existing = await db.collection('watchlist').findOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (existing) {
        return res.status(400).json({ message: 'Movie already in watchlist' });
      }

      const watchlistItem = {
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId),
        title,
        posterPath: posterPath || null,
        releaseDate: releaseDate || null,
        createdAt: new Date()
      };

      const result = await db.collection('watchlist').insertOne(watchlistItem);
      const createdItem = await db.collection('watchlist').findOne({ _id: result.insertedId });

      res.status(201).json({ message: 'Added to watchlist', watchlistItem: createdItem });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ message: 'Error adding to watchlist' });
    }
  }

  /**
   * Remove a movie from watchlist
   * DELETE /api/user/watchlist/:tmdbId
   */
  async removeFromWatchlist(req, res) {
    try {
      const { tmdbId } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const result = await db.collection('watchlist').deleteOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Movie not in watchlist' });
      }

      res.json({ message: 'Removed from watchlist' });
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      res.status(500).json({ message: 'Error removing from watchlist' });
    }
  }

  /**
   * Check if a movie is in watchlist
   * GET /api/user/watchlist/:tmdbId
   */
  async isInWatchlist(req, res) {
    try {
      const { tmdbId } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || isNaN(tmdbId)) {
        return res.status(400).json({ message: 'Valid movie ID is required' });
      }

      const watchlistItem = await db.collection('watchlist').findOne({
        userId: new ObjectId(userId),
        tmdbId: parseInt(tmdbId)
      });

      res.json({ isInWatchlist: !!watchlistItem });
    } catch (error) {
      console.error('Check watchlist error:', error);
      res.status(500).json({ message: 'Error checking watchlist status' });
    }
  }

  /**
   * Get user statistics
   * GET /api/user/stats
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user.userId;
      const db = getDB();

      const [ratingsCount, favoritesCount, watchlistCount, avgRating] = await Promise.all([
        db.collection('ratings').countDocuments({ userId: new ObjectId(userId) }),
        db.collection('favorites').countDocuments({ userId: new ObjectId(userId) }),
        db.collection('watchlist').countDocuments({ userId: new ObjectId(userId) }),
        db.collection('ratings').aggregate([
          { $match: { userId: new ObjectId(userId) } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]).toArray()
      ]);

      res.json({
        ratingsCount,
        favoritesCount,
        watchlistCount,
        averageRating: avgRating[0]?.avgRating || 0
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ message: 'Error fetching user statistics' });
    }
  }
}

module.exports = new UserController();