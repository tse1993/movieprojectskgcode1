const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');

// Middleware
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Movie routes (public)
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/top-rated', movieController.getTopRatedMovies);
router.get('/movies/upcoming', movieController.getUpcomingMovies);
router.get('/movies/:id', optionalAuth, movieController.getMovieDetails);

module.exports = router;
