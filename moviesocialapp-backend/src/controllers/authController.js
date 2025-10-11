const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class AuthController {
  async register(req, res) {
    try {
      console.log('🔵 Register endpoint hit');
      console.log('Request body:', req.body);
      const { email, name, password } = req.body;

      // 📝 Validate input
      if (!email || !password || !name) {
        console.log('❌ Validation failed - missing fields');
        return res.status(400).json({ message: 'All fields are required' });
      }
      console.log('✅ Validation passed');

      const db = getDB();

      // 🔍 Check if user exists
      console.log('🔍 Checking if user exists...');
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        console.log('❌ User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }
      console.log('✅ User does not exist, proceeding...');

      // 🔐 Hash password and create user
      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        email,
        name,
        password: hashedPassword,
        createdAt: new Date(),
        favorites: [],
        watchlist: [],
        ratings: []
      };

      console.log('💾 Inserting user into database...');
      const result = await db.collection('users').insertOne(user);
      console.log('✅ User created with ID:', result.insertedId);

      // 🎫 Generate JWT token
      console.log('🎫 Generating JWT token...');
      const token = jwt.sign(
        { userId: result.insertedId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('✅ Registration successful, sending response');
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: result.insertedId, email, name, createdAt: user.createdAt }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 📝 Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const db = getDB();

      // 🔍 Find user
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 🔐 Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 🎫 Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new AuthController();