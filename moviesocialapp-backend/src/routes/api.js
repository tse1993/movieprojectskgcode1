const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');
const socialController = require('../controllers/socialController');
const userController = require('../controllers/userController');

// Middleware
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// AUTHENTICATION ROUTES
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// MOVIE ROUTES (PUBLIC)
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/top-rated', movieController.getTopRatedMovies);
router.get('/movies/upcoming', movieController.getUpcomingMovies);
router.get('/movies/:id', optionalAuth, movieController.getMovieDetails);

// SOCIAL ROUTES - COMMENTS
// Get comments for a movie (public)
router.get('/comments/:tmdbId', socialController.getMovieComments);

// Add a comment (authenticated)
router.post('/comments', authenticateToken, socialController.addComment);

// Update a comment (authenticated, own comment only)
router.put('/comments/:id', authenticateToken, socialController.updateComment);

// Delete a comment (authenticated, own comment only)
router.delete('/comments/:id', authenticateToken, socialController.deleteComment);

// SOCIAL ROUTES - FEED
// Get activity feed (public)
router.get('/feed', socialController.getFeed);

// User routes

router.get('/user/ratings', authenticateToken, userController.getUserRatings);
router.post('/user/ratings', authenticateToken, userController.addOrUpdateRating);
router.get('/user/ratings/:tmdbId', authenticateToken, userController.getRatingForMovie);
router.delete('/user/ratings/:tmdbId', authenticateToken, userController.deleteRating);

router.get('/user/favorites', authenticateToken, userController.getFavorites);
router.post('/user/favorites', authenticateToken, userController.addToFavorites);
router.get('/user/favorites/:tmdbId', authenticateToken, userController.isFavorite);
router.delete('/user/favorites/:tmdbId', authenticateToken, userController.removeFromFavorites);

router.get('/user/watchlist', authenticateToken, userController.getWatchlist);
router.post('/user/watchlist', authenticateToken, userController.addToWatchlist);
router.get('/user/watchlist/:tmdbId', authenticateToken, userController.isInWatchlist);
router.delete('/user/watchlist/:tmdbId', authenticateToken, userController.removeFromWatchlist);

router.get('/user/stats', authenticateToken, userController.getUserStats);

module.exports = router;