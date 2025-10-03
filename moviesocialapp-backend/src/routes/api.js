const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');

// Middleware
const { authenticate, optionalAuth } = require('../middleware/auth');

// ==========================================
// HEALTH CHECK
// ==========================================
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ==========================================
// MOVIE ROUTES
// ==========================================
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/top-rated', movieController.getTopRatedMovies);
router.get('/movies/upcoming', movieController.getUpcomingMovies);
router.get('/movies/:movieId/reviews', movieController.getMovieReviews);



router.get('/movies/:id', optionalAuth, movieController.getMovieDetails);

module.exports = router;
