const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');
const socialController = require('../controllers/socialController');

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

module.exports = router;