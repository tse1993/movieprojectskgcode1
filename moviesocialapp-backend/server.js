const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// CORS Middleware - Updated with Vercel URL
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);
    
    // Allow all localhost/127.0.0.1 origins for development
    if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Allow Vercel frontend URL
    if (origin === 'https://movieprojectskgcode11.vercel.app') {
      return callback(null, true);
    }
    
    // Allow configured frontend URL from environment variable
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    // Reject other origins in production
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🎬 API ready: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();