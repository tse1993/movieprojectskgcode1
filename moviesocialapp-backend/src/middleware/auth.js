const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.substring(7);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next();
    }

    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (user) {
      req.user = {
        userId: user._id.toString(),
        username: user.username,
        email: user.email
      };
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, optionalAuth };