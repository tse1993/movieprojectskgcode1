const tmdbApi = require('../utils/tmdbApi');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class MovieController {
  async searchMovies(req, res) {
    try {
      const { q, page = 1 } = req.query;

      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const data = await tmdbApi.searchMovies(q, page);
      res.json(data);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Error searching movies' });
    }
  }

  async getPopularMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getPopularMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Popular movies error:', error);
      res.status(500).json({ message: 'Error fetching popular movies' });
    }
  }

  async getTopRatedMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getTopRatedMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Top rated error:', error);
      res.status(500).json({ message: 'Error fetching top rated movies' });
    }
  }

  async getUpcomingMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getUpcomingMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Upcoming movies error:', error);
      res.status(500).json({ message: 'Error fetching upcoming movies' });
    }
  }

  async getMovieDetails(req, res) {
    try {
      const { id } = req.params;
      const db = getDB();

      // Get movie details from TMDB
      const movie = await tmdbApi.getMovieDetails(id);

      // Add user-specific data if authenticated
      if (req.user) {
        const user = await db.collection('users').findOne({ _id: req.user.userId });

        // Add user rating
        const userRating = user.ratings.find(r => r.tmdbId == id);
        movie.userRating = userRating ? userRating.rating : null;

        // Add favorite status
        movie.isFavorite = user.favorites.includes(parseInt(id));

        // Add watchlist status
        movie.isInWatchlist = user.watchlist.includes(parseInt(id));
      }

      // Get comments for this movie
      const comments = await db.collection('comments')
        .find({ tmdbId: parseInt(id) })
        .sort({ createdAt: -1 })
        .toArray();

      movie.comments = comments;
      res.json(movie);
    } catch (error) {
      console.error('Movie details error:', error);
      res.status(500).json({ message: 'Error fetching movie details' });
    }
  }
}

module.exports = new MovieController();
