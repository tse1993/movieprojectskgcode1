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
router.post('/auth/forgot-password', authController.forgotPassword); 

// MOVIE ROUTES (PUBLIC)
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/top-rated', movieController.getTopRatedMovies);
router.get('/movies/upcoming', movieController.getUpcomingMovies);
router.get('/movies/genre/:genre', movieController.getMoviesByGenre);
router.get('/movies/:id', optionalAuth, movieController.getMovieDetails);

// USER ROUTES (AUTHENTICATED)
// Profile & Statistics
router.get('/user/profile', authenticateToken, userController.getProfile);
router.put('/user/profile', authenticateToken, userController.updateProfile);
router.put('/user/password', authenticateToken, userController.changePassword);
router.get('/user/statistics', authenticateToken, userController.getUserStatistics);

// Ratings
router.post('/user/rate', authenticateToken, userController.rateMovie);
router.get('/user/ratings', authenticateToken, userController.getUserRatings);
router.delete('/user/ratings', authenticateToken, userController.clearAllRatings);

// Favorites
router.post('/user/favorite', authenticateToken, userController.toggleFavorite);
router.get('/user/favorites', authenticateToken, userController.getUserFavorites);
router.delete('/user/favorites', authenticateToken, userController.clearAllFavorites);

// Watchlist
router.post('/user/watchlist', authenticateToken, userController.toggleWatchlist);
router.get('/user/watchlist', authenticateToken, userController.getUserWatchlist);
router.delete('/user/watchlist', authenticateToken, userController.clearAllWatchlist);

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

// PUBLIC USER ROUTES
// Get public profile for any user (for viewing other users' profiles)
router.get('/users/:userId/public-profile', userController.getPublicProfile);

module.exports = router;
