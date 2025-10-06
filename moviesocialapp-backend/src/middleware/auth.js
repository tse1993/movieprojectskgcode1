const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { userId: user._id, email: user.email, name: user.name };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const db = getDB();
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

      if (user) {
        req.user = { userId: user._id, email: user.email, name: user.name };
      }
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };