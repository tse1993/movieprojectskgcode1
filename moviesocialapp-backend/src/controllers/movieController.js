const { getDB } = require('../config/db');
const tmdbApi = require('../utils/tmdbApi');
const { ObjectId } = require('mongodb');

const movieController = {
  // ==========================================
  // TMDB API ENDPOINTS (Public)
  // ==========================================

  /**
   * Search movies from TMDB
   * GET /api/movies/search?query=inception&page=1
   */
  async searchMovies(req, res, next) {
    try {
      const { query, page = 1 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const data = await tmdbApi.searchMovies(query, page);

      res.json({
        success: true,
        data: {
          movies: data.results,
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get popular movies from TMDB
   * GET /api/movies/popular?page=1
   */
  async getPopularMovies(req, res, next) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getPopularMovies(page);

      res.json({
        success: true,
        data: {
          movies: data.results,
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get top rated movies from TMDB
   * GET /api/movies/top-rated?page=1
   */
  async getTopRatedMovies(req, res, next) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getTopRatedMovies(page);

      res.json({
        success: true,
        data: {
          movies: data.results,
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get upcoming movies from TMDB
   * GET /api/movies/upcoming?page=1
   */
  async getUpcomingMovies(req, res, next) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getUpcomingMovies(page);

      res.json({
        success: true,
        data: {
          movies: data.results,
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get movie details from TMDB
   * GET /api/movies/:id
   */
  async getMovieDetails(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      const movie = await tmdbApi.getMovieDetails(id);

      // If user is authenticated, check if movie is in their lists
      if (req.user) {
        const db = getDB();
        const userId = new ObjectId(req.user.userId);

        const [watchlist, favorites, review] = await Promise.all([
          db.collection('watchlists').findOne({
            userId,
            'movies.id': parseInt(id)
          }),
          db.collection('favorites').findOne({
            userId,
            'movies.id': parseInt(id)
          }),
          db.collection('reviews').findOne({
            userId,
            movieId: parseInt(id)
          })
        ]);

        movie.userStatus = {
          inWatchlist: !!watchlist,
          inFavorites: !!favorites,
          userReview: review ? {
            rating: review.rating,
            comment: review.comment
          } : null
        };
      }

      res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }
      next(error);
    }
  },

  // ==========================================
  // WATCHLIST ENDPOINTS (Authenticated)
  // ==========================================

  /**
   * Get user's watchlist
   * GET /api/movies/watchlist
   */
  async getWatchlist(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);

      const watchlistDoc = await db.collection('watchlists').findOne({ userId });

      res.json({
        success: true,
        data: {
          movies: watchlistDoc?.movies || [],
          count: watchlistDoc?.movies?.length || 0
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add movie to watchlist
   * POST /api/movies/watchlist
   * Body: { movieId, title, posterUrl, rating, releaseDate, genre, overview }
   */
  async addToWatchlist(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { movieId, title, posterUrl, rating, releaseDate, genre, overview } = req.body;

      if (!movieId || !title) {
        return res.status(400).json({
          success: false,
          message: 'Movie ID and title are required'
        });
      }

      const movie = {
        id: parseInt(movieId),
        title,
        posterUrl,
        rating: rating || 0,
        releaseDate: releaseDate || '',
        genre: genre || 'Unknown',
        overview: overview || '',
        addedAt: new Date()
      };

      // Check if already in watchlist
      const existing = await db.collection('watchlists').findOne({
        userId,
        'movies.id': movie.id
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Movie already in watchlist'
        });
      }

      // Add to watchlist (create or update)
      await db.collection('watchlists').updateOne(
        { userId },
        {
          $push: { movies: movie },
          $setOnInsert: { createdAt: new Date() },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'Movie added to watchlist',
        data: movie
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove movie from watchlist
   * DELETE /api/movies/watchlist/:movieId
   */
  async removeFromWatchlist(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { movieId } = req.params;

      if (!movieId || isNaN(movieId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      const result = await db.collection('watchlists').updateOne(
        { userId },
        { 
          $pull: { movies: { id: parseInt(movieId) } },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found in watchlist'
        });
      }

      res.json({
        success: true,
        message: 'Movie removed from watchlist'
      });
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // FAVORITES ENDPOINTS (Authenticated)
  // ==========================================

  /**
   * Get user's favorite movies
   * GET /api/movies/favorites
   */
  async getFavorites(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);

      const favoritesDoc = await db.collection('favorites').findOne({ userId });

      res.json({
        success: true,
        data: {
          movies: favoritesDoc?.movies || [],
          count: favoritesDoc?.movies?.length || 0
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add movie to favorites
   * POST /api/movies/favorites
   * Body: { movieId, title, posterUrl, rating, releaseDate, genre, overview }
   */
  async addToFavorites(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { movieId, title, posterUrl, rating, releaseDate, genre, overview } = req.body;

      if (!movieId || !title) {
        return res.status(400).json({
          success: false,
          message: 'Movie ID and title are required'
        });
      }

      const movie = {
        id: parseInt(movieId),
        title,
        posterUrl,
        rating: rating || 0,
        releaseDate: releaseDate || '',
        genre: genre || 'Unknown',
        overview: overview || '',
        addedAt: new Date()
      };

      // Check if already in favorites
      const existing = await db.collection('favorites').findOne({
        userId,
        'movies.id': movie.id
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Movie already in favorites'
        });
      }

      // Add to favorites
      await db.collection('favorites').updateOne(
        { userId },
        {
          $push: { movies: movie },
          $setOnInsert: { createdAt: new Date() },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'Movie added to favorites',
        data: movie
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove movie from favorites
   * DELETE /api/movies/favorites/:movieId
   */
  async removeFromFavorites(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { movieId } = req.params;

      if (!movieId || isNaN(movieId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      const result = await db.collection('favorites').updateOne(
        { userId },
        { 
          $pull: { movies: { id: parseInt(movieId) } },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found in favorites'
        });
      }

      res.json({
        success: true,
        message: 'Movie removed from favorites'
      });
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // REVIEWS ENDPOINTS (Authenticated)
  // ==========================================

  /**
   * Get reviews for a movie
   * GET /api/movies/:movieId/reviews
   */
  async getMovieReviews(req, res, next) {
    try {
      const db = getDB();
      const { movieId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!movieId || isNaN(movieId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const reviews = await db.collection('reviews')
        .find({ movieId: parseInt(movieId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      // Get user info for each review
      const userIds = reviews.map(r => r.userId);
      const users = await db.collection('users')
        .find({ _id: { $in: userIds } })
        .project({ username: 1, email: 1 })
        .toArray();

      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user;
        return acc;
      }, {});

      const reviewsWithUsers = reviews.map(review => ({
        ...review,
        user: {
          id: review.userId.toString(),
          username: userMap[review.userId.toString()]?.username || 'Anonymous',
          email: userMap[review.userId.toString()]?.email
        }
      }));

      const total = await db.collection('reviews').countDocuments({ 
        movieId: parseInt(movieId) 
      });

      res.json({
        success: true,
        data: {
          reviews: reviewsWithUsers,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalReviews: total
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add or update a review
   * POST /api/movies/:movieId/reviews
   * Body: { rating, comment }
   */
  async addReview(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { movieId } = req.params;
      const { rating, comment } = req.body;

      if (!movieId || isNaN(movieId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 10'
        });
      }

      const review = {
        userId,
        movieId: parseInt(movieId),
        rating: parseFloat(rating),
        comment: comment || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Update or insert review
      const result = await db.collection('reviews').updateOne(
        { userId, movieId: parseInt(movieId) },
        { 
          $set: review
        },
        { upsert: true }
      );

      res.status(result.upsertedId ? 201 : 200).json({
        success: true,
        message: result.upsertedId ? 'Review added' : 'Review updated',
        data: review
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a review
   * DELETE /api/movies/:movieId/reviews
   */
  async deleteReview(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { movieId } = req.params;

      if (!movieId || isNaN(movieId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      const result = await db.collection('reviews').deleteOne({
        userId,
        movieId: parseInt(movieId)
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review deleted'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user's reviews
   * GET /api/movies/my-reviews
   */
  async getUserReviews(req, res, next) {
    try {
      const db = getDB();
      const userId = new ObjectId(req.user.userId);
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const reviews = await db.collection('reviews')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      const total = await db.collection('reviews').countDocuments({ userId });

      res.json({
        success: true,
        data: {
          reviews,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalReviews: total
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = movieController;