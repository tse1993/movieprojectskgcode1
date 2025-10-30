const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { sendTemporaryPasswordEmail } = require('../utils/emailService'); // Updated import


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

  // 🆕 NEW: Send temporary password to email
  async forgotPassword(req, res) {
    try {
      console.log('🔵 Forgot password endpoint hit');
      const { email } = req.body;

      // 📝 Validate input
      if (!email) {
        return res.status(400).json({ 
          message: "Email field is empty or doesn't exist on the database" 
        });
      }

      const db = getDB();

      // 🔍 Find user
      console.log('🔍 Looking for user with email:', email);
      const user = await db.collection('users').findOne({ email });
      
      if (!user) {
        console.log('❌ User not found');
        return res.status(400).json({ 
          message: "Email field is empty or doesn't exist on the database" 
        });
      }

      // 🎲 Generate temporary password (8 characters, easy to type)
      console.log('🎲 Generating temporary password...');
      const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 char hex
      
      // 🔐 Hash temporary password
      console.log('🔐 Hashing temporary password...');
      const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

      // 💾 Update user's password
      console.log('💾 Updating user password...');
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedTempPassword,
            passwordChangedAt: new Date()
          }
        }
      );

      // 📧 Send email with temporary password
      console.log('📧 Sending temporary password email...');
      await sendTemporaryPasswordEmail(user.email, tempPassword);

      console.log('✅ Temporary password sent');
      res.json({ 
        message: 'A temporary password has been sent to your email account' 
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new AuthController();