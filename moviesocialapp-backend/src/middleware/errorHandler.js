const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // MongoDB errors
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value' });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;