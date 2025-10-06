require('dotenv').config(); // Add this line at the top
const { MongoClient } = require('mongodb');

let db = null;

async function connectDB() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('URI exists:', !!process.env.MONGODB_URI); // Debug log
    
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db('moviesocialapp');
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

module.exports = { connectDB, getDB };