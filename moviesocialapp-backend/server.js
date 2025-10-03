const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, getDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
  });
}

// ==========================================
// ROUTES
// ==========================================

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🎬 Movie Social Platform API',
    status: 'running',
    version: '1.0.0',
    database: 'Connected',
    endpoints: {
      health: 'GET /api/health',
      docs: 'Full API documentation coming soon',
      movieRoutes: {
        search: 'GET /api/movies/search?query=inception',
        popular: 'GET /api/movies/popular',
        topRated: 'GET /api/movies/top-rated',
        upcoming: 'GET /api/movies/upcoming',
        details: 'GET /api/movies/:id',
        reviews: 'GET /api/movies/:movieId/reviews'
      },
      userRoutes: {
        watchlist: 'GET /api/movies/watchlist (auth required)',
        favorites: 'GET /api/movies/favorites (auth required)',
        myReviews: 'GET /api/movies/my-reviews (auth required)'
      }
    }
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB FIRST
    await connectDB();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════╗');
      console.log(`║  🚀 Server running on port ${PORT}       ║`);
      console.log(`║  📡 API: http://localhost:${PORT}/api    ║`);
      console.log(`║  🎬 Environment: ${process.env.NODE_ENV || 'development'}          ║`);
      console.log(`║  ✅ Database: Connected                 ║`);
      console.log('╚════════════════════════════════════════╝');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();