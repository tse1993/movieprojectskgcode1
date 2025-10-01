const express = require('express');
require('dotenv').config(); // IMPORTANT: Load .env file
const { connectDB, getDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Movie Platform API',
    status: 'running',
    database: 'Connected',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      }
    }
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const db = getDB();
    await db.command({ ping: 1 });
    
    res.json({ 
      status: 'OK',
      database: 'Connected',
      databaseName: 'moviesocialapp',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'Error',
      database: 'Not connected',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB FIRST
    await connectDB();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();