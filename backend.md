# MovieSocialApp - Backend Development Guide

## 📊 **Your Progress Tracker**

### ✅ **Completed Phases (All Tests Passing: 61/61 - 100%)**
- ✅ **Phase 1: Foundation Setup** - Project structure, package.json, .env configured
- ✅ **Phase 2: Database Connection** - MongoDB Atlas connected (6/6 tests ✅)
- ✅ **Phase 3: Authentication System** - Register & Login implemented (7/7 tests ✅)
- ✅ **Phase 4: TMDB Integration** - Movie API utility complete (5/5 tests ✅)
- ✅ **Phase 4: Movie Controller** - All movie endpoints implemented (9/9 tests ✅)
- ✅ **Phase 5: User Controller** - Ratings, favorites, watchlist implemented (24/24 tests ✅)
- ✅ **Phase 6: Social Controller** - Comments & Feed implemented (22/22 tests ✅)
- ✅ **Phase 7: Middleware** - Auth & Error handling complete
- ✅ **Phase 7: Routes & Server** - All routes wired (Auth, Movies, User, Social), server fully configured

### 🎉 **PROJECT COMPLETE!**
All backend features implemented and tested. Ready for frontend integration and deployment.

### 🎯 **Current Status**
- Server: ✅ Running on http://localhost:5000
- Database: ✅ Connected to MongoDB Atlas
- Auth: ✅ Working (register/login) - 7/7 tests passing
- TMDB: ✅ Working (search, lists, details) - 5/5 tests passing
- Movie Routes: ✅ Complete - 9/9 tests passing
- User Routes: ✅ Complete (profile, ratings, favorites, watchlist) - 24/24 tests passing
- Social Routes: ✅ Complete (comments, feed) - 22/22 tests passing
- Middleware: ✅ Complete (authenticateToken, optionalAuth, errorHandler)
- **Comprehensive Endpoint Tests: ✅ 61/61 passing (100%)**

---

## 📖 Table of Contents

### 🎯 **Phase 1: Understanding**
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Backend Architecture Concepts](#backend-architecture-concepts)
4. [Quick Start Guide](#quick-start-guide)
5. [Project Structure](#project-structure)
6. [Database Design](#database-design)

### 🛠️ **Phase 2: Building**
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Code Walkthrough & Examples](#code-walkthrough--examples)
9. [Step-by-Step Implementation](#step-by-step-implementation)

### 🧪 **Phase 3: Testing**
10. [Testing Your Backend](#testing-your-backend)
11. [Development Workflow](#development-workflow)

### 🔗 **Phase 4: Integration**
12. [Frontend Integration](#frontend-integration)
13. [Security Best Practices](#security-best-practices)

### 🚀 **Phase 5: Deployment**
14. [Deployment Guide](#deployment-guide)
15. [Performance & Optimization](#performance--optimization)

### 📊 **Phase 6: Production**
16. [Monitoring & Maintenance](#monitoring--maintenance)
17. [Troubleshooting](#troubleshooting)
18. [Advanced Features & Next Steps](#advanced-features--next-steps)

## 📌 Overview

This is a **simplified but complete backend** for MovieSocialApp - a social movie platform where users can:
- 🔐 Register and login
- 🎬 Browse movies from TMDB (real movie database)
- ⭐ Rate movies (1-10 scale)
- ❤️ Add movies to favorites
- 📝 Create watchlists
- 💬 Comment on movies
- 📱 View social activity feed

**Why this architecture?** It's designed for learning - simple enough to understand, complete enough to be functional.

## 🛠️ Technology Stack

| Component | Technology | Why We Use It |
|-----------|------------|---------------|
| **Runtime** | Node.js (v18+) | JavaScript everywhere, great ecosystem |
| **Framework** | Express.js | Simple, fast, widely used web framework |
| **Database** | MongoDB Atlas | Document-based, easy to start with |
| **DB Driver** | Native MongoDB | No extra abstraction, learn pure MongoDB |
| **Authentication** | JWT | Stateless, scalable auth method |
| **External API** | TMDB API | Real movie data, free tier available |
| **Security** | bcrypt, CORS | Password hashing, cross-origin requests |
| **Environment** | dotenv | Secure environment variable management |

## 🏗️ Backend Architecture Concepts

### 📖 **What You'll Learn**
- What is an API and how does it work?
- How our backend is organized (MVC pattern)
- Request/response lifecycle
- Why we choose this specific architecture

### 🤔 **What is an API?**

**API = Application Programming Interface**

Think of an API as a **waiter in a restaurant**:
- 🍽️ **You (frontend)** want food (data)
- 👨‍🍳 **Kitchen (database)** has the food
- 👨‍💼 **Waiter (API)** takes your order and brings your food

```
Frontend ↔ API ↔ Database
   ↓        ↓       ↓
 "I want    "Get     "Here's
  movies"   movies"  the data"
```

### 🏛️ **Our Architecture Pattern: MVC + Services**

**MVC = Model, View, Controller**

```
📱 Frontend Request
    ↓
🛣️  Routes (URL mapping)
    ↓
🎮 Controllers (Handle requests)
    ↓
⚙️  Services (Business logic)
    ↓
🗄️  Database (Data storage)
```

**Why this pattern?**
- ✅ **Organized**: Each file has one job
- ✅ **Testable**: Easy to test each part
- ✅ **Scalable**: Easy to add features
- ✅ **Maintainable**: Easy to fix bugs

### 🔄 **Request/Response Lifecycle**

**Example: User rates a movie**

```
1. 📱 Frontend sends: POST /api/user/rate {tmdbId: 550, rating: 9}
2. 🛣️  Route matches: POST /user/rate → userController.rateMovie
3. 🔐 Middleware checks: Is user logged in? ✅
4. 🎮 Controller extracts: tmdbId=550, rating=9, userId from token
5. ⚙️  Service validates: Rating 1-10? ✅ User exists? ✅
6. 🗄️  Database updates: Add rating to user's ratings array
7. 📤 Response sent: {message: "Rating saved successfully"}
8. 📱 Frontend receives: Success! Show toast notification
```

### 🛡️ **Middleware Chain Concept**

Middleware = **Functions that run between request and response**

```
Request → Middleware 1 → Middleware 2 → Controller → Response
           ↓              ↓              ↓
        Parse JSON    Check Auth    Handle Logic
```

**Our middleware:**
- 📝 **express.json()**: Parse JSON from request body
- 🔐 **authenticateToken()**: Check if user is logged in
- ❌ **errorHandler()**: Catch and format errors

### 🎯 **Why This Architecture?**

**Simple enough to learn:**
- 📁 **10 main files** instead of 50+
- 🗄️ **2 collections** instead of 20 tables
- 🛣️ **1 route file** instead of scattered routes

**Professional enough to work:**
- 🔐 **JWT authentication**
- 🗄️ **Real database** (MongoDB)
- 🎬 **External API** integration (TMDB)
- 🧪 **Error handling** and validation

### ✅ **Verification: Do You Understand?**

Before moving on, make sure you can answer:
1. **What does our API do?** (Manages users and movies)
2. **What happens when someone logs in?** (JWT token created)
3. **Why do we use controllers?** (Separate HTTP handling from business logic)
4. **What is middleware?** (Functions that run between request/response)

**If yes → continue to Quick Start Guide**
**If no → re-read this section or check Learning Resources**

## 🚀 Quick Start Guide

### Step 1: Prerequisites Check
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# If not installed, download from: https://nodejs.org/
```

### Step 2: Get API Keys
1. **TMDB API Key** (Free)
   - Go to [TMDB](https://www.themoviedb.org/settings/api)
   - Create account → Request API key → Copy the key

2. **MongoDB Atlas** (Free)
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create account → Create cluster → Get connection string

### Step 3: Project Setup
```bash
# Create project directory
mkdir moviesocialapp-backend
cd moviesocialapp-backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongodb bcrypt jsonwebtoken axios cors dotenv

# Install development dependencies
npm install --save-dev nodemon
```

### Step 4: Environment Setup
Create `.env` file in project root:
```bash
# Copy this exactly, replace values with your own
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/moviesocialapp
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random
TMDB_API_KEY=your-tmdb-api-key
FRONTEND_URL=http://localhost:3000
```

### Step 5: Test Run
```bash
# Start development server
npm run dev

# You should see:
# Connected to MongoDB
# Server running on port 5000
```

## 📁 Project Structure

```
moviesocialapp-backend/
├── src/                          # Source code directory
│   ├── config/                   # Configuration files
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers/              # Handle HTTP requests/responses
│   │   ├── authController.js     # Login, register, user management
│   │   ├── movieController.js    # Movie search, details from TMDB
│   │   ├── userController.js     # User ratings, favorites, watchlist
│   │   └── socialController.js   # Comments, feed, social features
│   ├── middleware/               # Functions that run between request/response
│   │   ├── auth.js              # Check if user is logged in (JWT)
│   │   └── errorHandler.js      # Handle errors gracefully
│   ├── routes/                   # Define API endpoints
│   │   └── api.js               # All API routes in one file
│   └── utils/                    # Helper functions
│       └── tmdbApi.js           # Connect to TMDB movie database
├── .env                          # Environment variables (secrets)
├── .gitignore                   # Files Git should ignore
├── package.json                 # Project info and dependencies
├── package-lock.json           # Exact dependency versions
├── README.md                   # Project documentation
└── server.js                   # Main entry point - starts the server
```

### 🎯 What Each File Does

| File | Purpose | What's Inside |
|------|---------|---------------|
| `server.js` | 🚀 **App Entry Point** | Starts server, connects to database |
| `src/config/db.js` | 🗄️ **Database Setup** | MongoDB connection logic |
| `src/controllers/` | 🎮 **Request Handlers** | Functions that handle API requests |
| `src/middleware/auth.js` | 🔐 **Security Guard** | Checks if users are logged in |
| `src/routes/api.js` | 🛣️ **API Routes** | Maps URLs to controller functions |
| `src/utils/tmdbApi.js` | 🎬 **Movie Data** | Gets real movie info from TMDB |
| `.env` | 🔑 **Secrets File** | API keys, database passwords (never commit!) |

## 🗄️ Database Design

**Why MongoDB?**
- **Document-based**: Store complex objects naturally (like user ratings array)
- **No rigid schema**: Easy to add new fields later
- **JSON-like**: Works perfectly with JavaScript

### 📊 Database Overview
We use **2 simple collections** instead of complex relational tables:

```
MongoDB Database: moviesocialapp
├── users       (user accounts + their movie interactions)
└── comments    (movie comments)

Note: Movie data comes from TMDB API (no local storage needed!)
```

### 👤 Users Collection
**What it stores**: User accounts + all their movie interactions

```javascript
// Example user document
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "john@example.com",           // ✅ Unique identifier
  password: "$2b$10$hashedpassword",   // ✅ Encrypted with bcrypt
  name: "John Doe",                    // ✅ Display name
  createdAt: "2024-01-15T10:30:00Z",  // ✅ When user registered

  // 🎬 User's movie interactions (embedded for simplicity)
  favorites: [550, 680, 27205],       // Array of TMDB movie IDs
  watchlist: [13, 120, 155],          // Array of TMDB movie IDs
  ratings: [                          // Array of movie ratings
    {
      tmdbId: 550,                    // Fight Club
      rating: 9,                      // User's rating (1-10)
      ratedAt: "2024-01-20T15:45:00Z"
    },
    {
      tmdbId: 680,                    // Pulp Fiction
      rating: 10,
      ratedAt: "2024-01-22T09:15:00Z"
    }
  ]
}
```

**Why embed movie data in users?**
- ✅ **Simple**: All user data in one place
- ✅ **Fast**: No complex joins needed
- ✅ **Scalable**: Works fine for thousands of movies per user

### 💬 Comments Collection
**What it stores**: User comments on movies

```javascript
// Example comment document
{
  _id: ObjectId("507f1f77bcf86cd799439022"),
  tmdbId: 550,                        // Fight Club (TMDB ID)
  userId: ObjectId("507f1f77bcf86cd799439011"), // Who wrote it
  userName: "John Doe",               // Display name (copied for speed)
  content: "Amazing movie! The plot twist blew my mind.",
  createdAt: "2024-01-25T14:20:00Z",
  updatedAt: "2024-01-25T14:20:00Z"   // If user edits comment
}
```

**Why separate comments collection?**
- ✅ **Performance**: Comments can be loaded separately
- ✅ **Flexibility**: Easy to add features like likes, replies
- ✅ **Search**: Can search across all comments

### 🔍 Database Indexes (For Speed)
```javascript
// Make email lookups fast (for login)
db.users.createIndex({ email: 1 }, { unique: true })

// Make movie comment lookups fast
db.comments.createIndex({ tmdbId: 1, createdAt: -1 })

// Make user's comment history fast
db.comments.createIndex({ userId: 1 })
```

### 🎯 Data Flow Example
```
User rates Fight Club (tmdbId: 550) with 9/10
    ↓
Add to user's ratings array: { tmdbId: 550, rating: 9, ratedAt: "2024-01-20T15:45:00Z" }
    ↓
When frontend asks for Fight Club details:
    1. Get movie info from TMDB API
    2. Check user's ratings array for tmdbId: 550
    3. Return: movie data + userRating: 9
```

## 🛣️ API Endpoints Reference

### 🔐 Authentication Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `POST` | `/api/auth/login` | User login | ❌ No |
| `POST` | `/api/auth/register` | Create new account | ❌ No |

**Example: User Login**
```bash
# Request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Response
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### 🎬 Movie Routes (TMDB Integration)
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/api/movies/search?q=query` | Search movies | ❌ No |
| `GET` | `/api/movies/popular` | Popular movies | ❌ No |
| `GET` | `/api/movies/top-rated` | Top rated movies | ❌ No |
| `GET` | `/api/movies/upcoming` | Upcoming movies | ❌ No |
| `GET` | `/api/movies/:id` | Movie details + user data | 🔶 Optional |

**Example: Get Movie Details**
```bash
# Without authentication (guest user)
curl http://localhost:5000/api/movies/550

# With authentication (logged in user)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/movies/550

# Response includes user's personal data if authenticated
{
  "id": 550,
  "title": "Fight Club",
  "posterUrl": "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
  "rating": 8.8,
  "releaseDate": "1999-10-15",
  "genre": "Drama",
  "overview": "A ticking-time-bomb insomniac...",
  "userRating": 9,      // Only if authenticated
  "isFavorite": true,   // Only if authenticated
  "isInWatchlist": false, // Only if authenticated
  "comments": [...]     // Always included
}
```

### 👤 User Profile & Actions
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/api/user/profile` | Get user profile | ✅ Yes |
| `GET` | `/api/user/statistics` | Get user stats | ✅ Yes |
| `POST` | `/api/user/rate` | Rate a movie | ✅ Yes |
| `GET` | `/api/user/ratings` | Get user's ratings | ✅ Yes |
| `DELETE` | `/api/user/ratings` | Clear all ratings | ✅ Yes |
| `POST` | `/api/user/favorite` | Toggle favorite | ✅ Yes |
| `GET` | `/api/user/favorites` | Get favorites list | ✅ Yes |
| `DELETE` | `/api/user/favorites` | Clear all favorites | ✅ Yes |
| `POST` | `/api/user/watchlist` | Toggle watchlist | ✅ Yes |
| `GET` | `/api/user/watchlist` | Get watchlist | ✅ Yes |
| `DELETE` | `/api/user/watchlist` | Clear all watchlist | ✅ Yes |

**Example: Rate a Movie**
```bash
# Request
curl -X POST http://localhost:5000/api/user/rate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tmdbId": 550, "rating": 9}'

# Response
{
  "message": "Rating saved successfully"
}
```

### 💬 Social Features
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/api/comments/:tmdbId` | Get movie comments | ❌ No |
| `POST` | `/api/comments` | Add comment | ✅ Yes |
| `PUT` | `/api/comments/:id` | Update comment | ✅ Yes (own only) |
| `DELETE` | `/api/comments/:id` | Delete comment | ✅ Yes (own only) |
| `GET` | `/api/feed` | Activity feed | ❌ No |

**Example: Add Comment**
```bash
# Request
curl -X POST http://localhost:5000/api/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tmdbId": 550, "content": "Amazing movie! Mind-blowing plot twist."}'

# Response
{
  "_id": "507f1f77bcf86cd799439033",
  "tmdbId": 550,
  "userId": "507f1f77bcf86cd799439011",
  "userName": "John Doe",
  "content": "Amazing movie! Mind-blowing plot twist.",
  "createdAt": "2024-01-25T14:20:00Z",
  "updatedAt": "2024-01-25T14:20:00Z"
}
```

### 🔑 Authentication Headers
For protected routes, include JWT token in header:
```bash
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**How to get the token?**
1. Login via `/api/auth/login`
2. Copy the `token` from response
3. Use it in all subsequent requests

## 🔍 Code Walkthrough & Examples

### 📖 **What You'll Learn**
- How to build your first endpoint from scratch
- Understanding the flow from route to database
- Common patterns used throughout the codebase
- How to add new features following our patterns

### 🛠️ **Building Your First Endpoint: "Get User Profile"**

Let's walk through creating a complete endpoint step by step.

#### **Step 1: Define the Route**
*File: `src/routes/api.js`*

```javascript
// Add this line to your routes
router.get('/user/profile', authenticateToken, userController.getProfile);

// What this means:
// GET /api/user/profile → requires authentication → calls userController.getProfile
```

#### **Step 2: Create the Controller Function**
*File: `src/controllers/userController.js`*

```javascript
async getProfile(req, res) {
  try {
    // 📖 What we're doing: Get user info from database
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: req.user.userId },        // Find by user ID from JWT token
      { projection: { password: 0 } }  // Don't return password field
    );

    // 🔍 Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Send user data back
    res.json(user);
  } catch (error) {
    // ❌ Handle any errors
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
}
```

#### **Step 3: Test Your Endpoint**

```bash
# First, login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Copy the token from response, then test your endpoint
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/user/profile
```

### 🔐 **Authentication Flow Walkthrough**

**How does `authenticateToken` middleware work?**

```javascript
// src/middleware/auth.js
const authenticateToken = async (req, res, next) => {
  try {
    // 1. 📖 Extract token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // 2. 🔍 Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId: "507f1f77bcf86cd799439011", iat: 1643723400, exp: 1644328200 }

    // 3. 🗄️ Check if user still exists in database
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // 4. ✅ Add user info to request object for next function
    req.user = { userId: user._id, email: user.email, name: user.name };
    next(); // Continue to the controller
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
```

### 🗄️ **Database Operations Walkthrough**

**Example: Adding a movie rating**

```javascript
// src/controllers/userController.js
async rateMovie(req, res) {
  try {
    const { tmdbId, rating } = req.body;     // Get data from request
    const userId = req.user.userId;          // Get user from middleware
    const db = getDB();                      // Get database connection

    // 📝 Validation
    if (!tmdbId || !rating || rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Valid tmdbId and rating (1-10) required' });
    }

    // 🗄️ Database operations
    // First, remove any existing rating for this movie
    await db.collection('users').updateOne(
      { _id: userId },
      { $pull: { ratings: { tmdbId: parseInt(tmdbId) } } }
    );

    // Then, add the new rating
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $push: {
          ratings: {
            tmdbId: parseInt(tmdbId),
            rating: parseInt(rating),
            ratedAt: new Date()
          }
        }
      }
    );

    res.json({ message: 'Rating saved successfully' });
  } catch (error) {
    console.error('Rate movie error:', error);
    res.status(500).json({ message: 'Error saving rating' });
  }
}
```

### 🎬 **External API Integration Walkthrough**

**Example: Getting movie details from TMDB**

```javascript
// src/utils/tmdbApi.js
const tmdbApi = {
  // 🔄 Transform TMDB data to match our frontend needs
  transformMovie(tmdbMovie) {
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      posterUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      rating: tmdbMovie.vote_average || 0,
      releaseDate: tmdbMovie.release_date || '',
      genre: tmdbMovie.genres?.[0]?.name || 'Unknown',
      overview: tmdbMovie.overview || ''
    };
  },

  async getMovieDetails(id) {
    // 📡 Make API call to TMDB
    const response = await tmdbClient.get(`/movie/${id}`);

    // 🔄 Transform the data before returning
    return this.transformMovie(response.data);
  }
};
```

### ❌ **Error Handling Patterns**

**Our error handling strategy:**

```javascript
// 1. ✅ Try/Catch in every async function
try {
  // Your code here
} catch (error) {
  console.error('Descriptive error name:', error);
  res.status(500).json({ message: 'User-friendly error message' });
}

// 2. ✅ Validate input data
if (!requiredField) {
  return res.status(400).json({ message: 'Field is required' });
}

// 3. ✅ Check database results
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

// 4. ✅ Global error handler catches anything we missed
// src/middleware/errorHandler.js
```

### 🔄 **Common Code Patterns**

**Pattern 1: Controller Structure**
```javascript
async functionName(req, res) {
  try {
    // 1. Extract data from request
    // 2. Validate input
    // 3. Get database connection
    // 4. Perform database operations
    // 5. Send response
  } catch (error) {
    // 6. Handle errors
  }
}
```

**Pattern 2: Database Updates**
```javascript
// Always follow this pattern for user data updates:
// 1. Remove old data (if exists)
await db.collection('users').updateOne(
  { _id: userId },
  { $pull: { arrayField: { condition } } }
);

// 2. Add new data
await db.collection('users').updateOne(
  { _id: userId },
  { $push: { arrayField: newData } }
);
```

### 🧪 **Quick Exercise: Add Your Own Endpoint**

**Challenge**: Create an endpoint to get a user's favorite count

```javascript
// 1. Add route (you do this)
router.get('/user/favorite-count', authenticateToken, userController.getFavoriteCount);

// 2. Create controller function (you do this)
async getFavoriteCount(req, res) {
  try {
    // Get user from database
    // Count favorites array length
    // Return count
  } catch (error) {
    // Handle error
  }
}

// 3. Test with curl (you do this)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/user/favorite-count
```

### ✅ **Verification: Can You Code?**

Before moving to implementation, make sure you understand:
1. **Route → Controller → Database → Response flow**
2. **How authentication middleware works**
3. **Error handling patterns**
4. **Database update patterns**

**Ready to build? → Continue to Step-by-Step Implementation**

## 🛠️ Step-by-Step Implementation

### 📖 **What You'll Build**
By following this guide, you'll create a complete, working backend with:
- ✅ 10 implementation files
- ✅ All endpoints fully functional
- ✅ Real TMDB API integration
- ✅ Complete authentication system
- ✅ Database operations
- ✅ Error handling
- ✅ Security measures

### 🎯 **Implementation Phases**

```
Phase 1: Foundation (Files 1-3)    → Basic server setup
Phase 2: Database (File 4)         → MongoDB connection
Phase 3: Authentication (File 5)   → User login/register
Phase 4: Movies (File 6-7)         → TMDB integration
Phase 5: User Features (File 8)    → Ratings, favorites
Phase 6: Social (File 9)           → Comments system
Phase 7: Assembly (File 10-11)     → Routes & server
```

---

## 📁 **Phase 1: Foundation Setup**

### **File 1: Create Project Structure** ✅ COMPLETED

```bash
# Create all directories
mkdir -p src/config src/controllers src/middleware src/routes src/utils

# Create all files we'll need
touch src/config/db.js
touch src/utils/tmdbApi.js
touch src/controllers/authController.js
touch src/controllers/movieController.js
touch src/controllers/userController.js
touch src/controllers/socialController.js
touch src/middleware/auth.js
touch src/middleware/errorHandler.js
touch src/routes/api.js
touch server.js

# Create environment file
touch .env
```

### **File 2: Package.json Setup** ✅ COMPLETED

```json
{
  "name": "moviesocialapp-backend",
  "version": "1.0.0",
  "description": "Backend API for MovieSocialApp",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.3.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

```bash
# Install dependencies
npm install
```

### **File 3: Environment Variables (.env)** ✅ COMPLETED

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/moviesocialapp

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random

# TMDB API
TMDB_API_KEY=your-tmdb-api-key

# CORS
FRONTEND_URL=http://localhost:3000
```

**✅ Test Phase 1:**
```bash
# Should show your environment
node -e "require('dotenv').config(); console.log('✅ Environment loaded');"
```

---

## 🗄️ **Phase 2: Database Connection** ✅ COMPLETED

### **File 4: Database Configuration (`src/config/db.js`)** ✅ COMPLETED

```javascript
const { MongoClient } = require('mongodb');

let db = null;

async function connectDB() {
  try {
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
```

**✅ Test Phase 2:**
```bash
# Test database connection
node -e "
require('dotenv').config();
const { connectDB } = require('./src/config/db');
connectDB().then(() => console.log('✅ Database test passed'));
"
```

---

## 🔐 **Phase 3: Authentication System** ✅ COMPLETED

### **File 5: Authentication Controller (`src/controllers/authController.js`)** ✅ COMPLETED

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class AuthController {
  async register(req, res) {
    try {
      const { email, name, password } = req.body;

      // 📝 Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const db = getDB();

      // 🔍 Check if user exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // 🔐 Hash password and create user
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

      const result = await db.collection('users').insertOne(user);

      // 🎫 Generate JWT token
      const token = jwt.sign(
        { userId: result.insertedId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: result.insertedId, email, name }
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
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // 🔐 Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
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
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new AuthController();
```

**✅ Test Phase 3:**
```bash
# We'll test this after setting up the server
```

---

## 🎬 **Phase 4: TMDB Integration** ✅ COMPLETED

### **File 6: TMDB API Utility (`src/utils/tmdbApi.js`)** ✅ COMPLETED

```javascript
const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

const tmdbApi = {
  // 🔄 Transform TMDB data to match frontend Movie interface
  transformMovie(tmdbMovie) {
    return {
      id: tmdbMovie.id,  // TMDB ID becomes frontend id
      title: tmdbMovie.title,
      posterUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      rating: tmdbMovie.vote_average || 0,
      releaseDate: tmdbMovie.release_date || '',
      genre: tmdbMovie.genres?.[0]?.name || 'Unknown', // First genre as string
      overview: tmdbMovie.overview || ''
    };
  },

  async searchMovies(query, page = 1) {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getPopularMovies(page = 1) {
    const response = await tmdbClient.get('/movie/popular', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getTopRatedMovies(page = 1) {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getUpcomingMovies(page = 1) {
    const response = await tmdbClient.get('/movie/upcoming', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getMovieDetails(id) {
    const response = await tmdbClient.get(`/movie/${id}`);
    return this.transformMovie(response.data);
  }
};

module.exports = tmdbApi;
```

### **File 7: Movie Controller (`src/controllers/movieController.js`)** ✅ COMPLETE

```javascript
const tmdbApi = require('../utils/tmdbApi');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class MovieController {
  async searchMovies(req, res) {
    try {
      const { q, page = 1 } = req.query;

      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const data = await tmdbApi.searchMovies(q, page);
      res.json(data);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Error searching movies' });
    }
  }

  async getPopularMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getPopularMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Popular movies error:', error);
      res.status(500).json({ message: 'Error fetching popular movies' });
    }
  }

  async getTopRatedMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getTopRatedMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Top rated error:', error);
      res.status(500).json({ message: 'Error fetching top rated movies' });
    }
  }

  async getUpcomingMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getUpcomingMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Upcoming movies error:', error);
      res.status(500).json({ message: 'Error fetching upcoming movies' });
    }
  }

  async getMovieDetails(req, res) {
    try {
      const { id } = req.params;
      const db = getDB();

      // 🎬 Get movie details from TMDB
      const movie = await tmdbApi.getMovieDetails(id);

      // 👤 Add user-specific data if authenticated
      if (req.user) {
        const user = await db.collection('users').findOne({ _id: req.user.userId });

        // Add user rating
        const userRating = user.ratings.find(r => r.tmdbId == id);
        movie.userRating = userRating ? userRating.rating : null;

        // Add favorite status
        movie.isFavorite = user.favorites.includes(parseInt(id));

        // Add watchlist status
        movie.isInWatchlist = user.watchlist.includes(parseInt(id));
      }

      // 💬 Get comments for this movie
      const comments = await db.collection('comments')
        .find({ tmdbId: parseInt(id) })
        .sort({ createdAt: -1 })
        .toArray();

      movie.comments = comments;
      res.json(movie);
    } catch (error) {
      console.error('Movie details error:', error);
      res.status(500).json({ message: 'Error fetching movie details' });
    }
  }
}

module.exports = new MovieController();
```

**✅ Test Phase 4:**
```bash
# Test TMDB API connection
node -e "
require('dotenv').config();
const tmdbApi = require('./src/utils/tmdbApi');
tmdbApi.getPopularMovies().then(data =>
  console.log('✅ TMDB test passed:', data.results[0].title)
);
"
```

---

## 👤 **Phase 5: User Features** ⏳ TO DO

### **File 8: User Controller (`src/controllers/userController.js`)** ⏳ TO DO

```javascript
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const tmdbApi = require('../utils/tmdbApi');

class UserController {
  async getProfile(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne(
        { _id: req.user.userId },
        { projection: { password: 0 } } // Exclude password
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  }

  async getUserStatistics(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const stats = {
        moviesRated: user.ratings.length,
        averageRating: user.ratings.length > 0
          ? user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length
          : 0,
        favoriteCount: user.favorites.length,
        watchlistCount: user.watchlist.length,
        memberSince: user.createdAt.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      res.json(stats);
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ message: 'Error fetching statistics' });
    }
  }

  async rateMovie(req, res) {
    try {
      const { tmdbId, rating } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || !rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: 'Valid tmdbId and rating (1-10) required' });
      }

      // Remove existing rating for this movie
      await db.collection('users').updateOne(
        { _id: userId },
        { $pull: { ratings: { tmdbId: parseInt(tmdbId) } } }
      );

      // Add new rating
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $push: {
            ratings: {
              tmdbId: parseInt(tmdbId),
              rating: parseInt(rating),
              ratedAt: new Date()
            }
          }
        }
      );

      res.json({ message: 'Rating saved successfully' });
    } catch (error) {
      console.error('Rate movie error:', error);
      res.status(500).json({ message: 'Error saving rating' });
    }
  }

  async getUserRatings(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each rated movie
      const ratingsWithMovies = await Promise.all(
        user.ratings.map(async (rating) => {
          try {
            const movie = await tmdbApi.getMovieDetails(rating.tmdbId);
            return {
              ...rating,
              movie
            };
          } catch (error) {
            console.error(`Error fetching movie ${rating.tmdbId}:`, error);
            return rating; // Return rating without movie details if TMDB fails
          }
        })
      );

      res.json(ratingsWithMovies);
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ message: 'Error fetching ratings' });
    }
  }

  async clearAllRatings(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { ratings: [] } }
      );
      res.json({ message: 'All ratings cleared successfully' });
    } catch (error) {
      console.error('Clear ratings error:', error);
      res.status(500).json({ message: 'Error clearing ratings' });
    }
  }

  async toggleFavorite(req, res) {
    try {
      const { tmdbId } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId) {
        return res.status(400).json({ message: 'tmdbId is required' });
      }

      const user = await db.collection('users').findOne({ _id: userId });
      const isFavorite = user.favorites.includes(parseInt(tmdbId));

      if (isFavorite) {
        // Remove from favorites
        await db.collection('users').updateOne(
          { _id: userId },
          { $pull: { favorites: parseInt(tmdbId) } }
        );
        res.json({ message: 'Removed from favorites', isFavorite: false });
      } else {
        // Add to favorites
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { favorites: parseInt(tmdbId) } }
        );
        res.json({ message: 'Added to favorites', isFavorite: true });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ message: 'Error updating favorites' });
    }
  }

  async getUserFavorites(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each favorite
      const favoriteMovies = await Promise.all(
        user.favorites.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              ...movie,
              addedAt: new Date().toISOString() // Simplified - could track actual add date
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      res.json(favoriteMovies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error fetching favorites' });
    }
  }

  async clearAllFavorites(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { favorites: [] } }
      );
      res.json({ message: 'All favorites cleared successfully' });
    } catch (error) {
      console.error('Clear favorites error:', error);
      res.status(500).json({ message: 'Error clearing favorites' });
    }
  }

  async toggleWatchlist(req, res) {
    try {
      const { tmdbId } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId) {
        return res.status(400).json({ message: 'tmdbId is required' });
      }

      const user = await db.collection('users').findOne({ _id: userId });
      const isInWatchlist = user.watchlist.includes(parseInt(tmdbId));

      if (isInWatchlist) {
        // Remove from watchlist
        await db.collection('users').updateOne(
          { _id: userId },
          { $pull: { watchlist: parseInt(tmdbId) } }
        );
        res.json({ message: 'Removed from watchlist', isInWatchlist: false });
      } else {
        // Add to watchlist
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { watchlist: parseInt(tmdbId) } }
        );
        res.json({ message: 'Added to watchlist', isInWatchlist: true });
      }
    } catch (error) {
      console.error('Toggle watchlist error:', error);
      res.status(500).json({ message: 'Error updating watchlist' });
    }
  }

  async getUserWatchlist(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each watchlist item
      const watchlistMovies = await Promise.all(
        user.watchlist.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              ...movie,
              addedAt: new Date().toISOString() // Simplified - could track actual add date
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      res.json(watchlistMovies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ message: 'Error fetching watchlist' });
    }
  }

  async clearAllWatchlist(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { watchlist: [] } }
      );
      res.json({ message: 'All watchlist items cleared successfully' });
    } catch (error) {
      console.error('Clear watchlist error:', error);
      res.status(500).json({ message: 'Error clearing watchlist' });
    }
  }
}

module.exports = new UserController();
```

**✅ Test Phase 5:**
```bash
# We'll test user features after authentication is working
```

---

## 💬 **Phase 6: Social Features** ✅ COMPLETE & TESTED

### **File 9: Social Controller (`src/controllers/socialController.js`)** ✅ COMPLETE & TESTED

```javascript
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class SocialController {
  async getMovieComments(req, res) {
    try {
      const { tmdbId } = req.params;
      const db = getDB();

      const comments = await db.collection('comments')
        .find({ tmdbId: parseInt(tmdbId) })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(comments);
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  }

  async addComment(req, res) {
    try {
      const { tmdbId, content } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || !content || !content.trim()) {
        return res.status(400).json({ message: 'tmdbId and content are required' });
      }

      // Get user name
      const user = await db.collection('users').findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = {
        tmdbId: parseInt(tmdbId),
        userId,
        userName: user.name,
        content: content.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('comments').insertOne(comment);

      // Return the created comment
      const createdComment = await db.collection('comments').findOne({ _id: result.insertedId });
      res.status(201).json(createdComment);
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Error adding comment' });
    }
  }

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Content is required' });
      }

      // Check if comment exists and belongs to user
      const comment = await db.collection('comments').findOne({
        _id: new ObjectId(id),
        userId
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      // Update comment
      await db.collection('comments').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            content: content.trim(),
            updatedAt: new Date()
          }
        }
      );

      res.json({ message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Update comment error:', error);
      res.status(500).json({ message: 'Error updating comment' });
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      // Check if comment exists and belongs to user
      const comment = await db.collection('comments').findOne({
        _id: new ObjectId(id),
        userId
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      // Delete comment
      await db.collection('comments').deleteOne({ _id: new ObjectId(id) });

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ message: 'Error deleting comment' });
    }
  }

  async getFeed(req, res) {
    try {
      const db = getDB();
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      // Simple feed: recent comments across all movies
      const feedItems = await db.collection('comments')
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.json({
        items: feedItems,
        page: parseInt(page),
        hasMore: feedItems.length === parseInt(limit)
      });
    } catch (error) {
      console.error('Get feed error:', error);
      res.status(500).json({ message: 'Error fetching feed' });
    }
  }
}

module.exports = new SocialController();
```

**✅ Test Phase 6:**
```bash
# Social Controller Tests - 22/22 PASSING
node test-social.js

# Test Coverage:
# ✅ Add comment (authenticated)
# ✅ Get movie comments (public)
# ✅ Update comment (own comment only)
# ✅ Delete comment (own comment only)
# ✅ Activity feed with pagination
# ✅ Authorization checks (prevent editing others' comments)
# ✅ Input validation (missing/invalid data)
# ✅ Authentication requirements
```

---

## 🔧 **Phase 7: Middleware & Assembly** ✅ COMPLETE

### **File 10: Authentication Middleware (`src/middleware/auth.js`)** ✅ COMPLETE

```javascript
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
```

### **File 11: Error Handler (`src/middleware/errorHandler.js`)** ✅ COMPLETE

```javascript
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
```

### **File 12: API Routes (`src/routes/api.js`)** ✅ COMPLETE (Auth, Movies, Social)

```javascript
const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');
const userController = require('../controllers/userController');
const socialController = require('../controllers/socialController');

// Middleware
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Movie routes (public)
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/top-rated', movieController.getTopRatedMovies);
router.get('/movies/upcoming', movieController.getUpcomingMovies);
router.get('/movies/:id', optionalAuth, movieController.getMovieDetails);

// User routes (authenticated)
router.get('/user/profile', authenticateToken, userController.getProfile);
router.get('/user/statistics', authenticateToken, userController.getUserStatistics);

// User rating routes
router.post('/user/rate', authenticateToken, userController.rateMovie);
router.get('/user/ratings', authenticateToken, userController.getUserRatings);
router.delete('/user/ratings', authenticateToken, userController.clearAllRatings);

// User favorite routes
router.post('/user/favorite', authenticateToken, userController.toggleFavorite);
router.get('/user/favorites', authenticateToken, userController.getUserFavorites);
router.delete('/user/favorites', authenticateToken, userController.clearAllFavorites);

// User watchlist routes
router.post('/user/watchlist', authenticateToken, userController.toggleWatchlist);
router.get('/user/watchlist', authenticateToken, userController.getUserWatchlist);
router.delete('/user/watchlist', authenticateToken, userController.clearAllWatchlist);

// Social routes
router.get('/comments/:tmdbId', socialController.getMovieComments);
router.post('/comments', authenticateToken, socialController.addComment);
router.put('/comments/:id', authenticateToken, socialController.updateComment);
router.delete('/comments/:id', authenticateToken, socialController.deleteComment);
router.get('/feed', socialController.getFeed);

module.exports = router;
```

### **File 13: Main Server (`server.js`)** ✅ COMPLETE

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
```

---

## ✅ **Final Testing & Verification**

### **Complete End-to-End Test**

```bash
# 1. Start your server
npm run dev

# 2. Test health endpoint
curl http://localhost:5000/health

# 3. Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# 4. Test login (save the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 5. Test movie search
curl "http://localhost:5000/api/movies/search?q=fight"

# 6. Test authenticated endpoint (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/user/profile

# 7. Test rating a movie
curl -X POST http://localhost:5000/api/user/rate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tmdbId": 550, "rating": 9}'

# 8. Test adding a comment
curl -X POST http://localhost:5000/api/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tmdbId": 550, "content": "Great movie!"}'
```

### **✅ Verification Checklist**

- [ ] **Server starts** without errors
- [ ] **Health endpoint** returns 200 OK
- [ ] **Registration** creates new user
- [ ] **Login** returns JWT token
- [ ] **Movie search** returns TMDB data
- [ ] **Authentication** protects user routes
- [ ] **Rating system** saves to database
- [ ] **Comments system** works
- [ ] **All endpoints** respond correctly

### **🎉 Success! You've Built a Complete Backend**

**What you've accomplished:**
- ✅ **13 files** of production-ready code
- ✅ **Complete authentication** system
- ✅ **Real TMDB integration**
- ✅ **Full user management**
- ✅ **Social features**
- ✅ **Error handling**
- ✅ **Security measures**
- ✅ **Database operations**

**Next steps:**
- 🚀 Deploy to production
- 🧪 Add comprehensive testing
- 📊 Add monitoring and logging
- 🔒 Enhance security features

### 2. TMDB API Utils (`src/utils/tmdbApi.js`)
```javascript
const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

const tmdbApi = {
  // Transform TMDB data to match frontend Movie interface
  transformMovie(tmdbMovie) {
    return {
      id: tmdbMovie.id,  // TMDB ID becomes frontend id
      title: tmdbMovie.title,
      posterUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      rating: tmdbMovie.vote_average || 0,
      releaseDate: tmdbMovie.release_date || '',
      genre: tmdbMovie.genres?.[0]?.name || 'Unknown', // First genre as string
      overview: tmdbMovie.overview || ''
    };
  },

  async searchMovies(query, page = 1) {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getPopularMovies(page = 1) {
    const response = await tmdbClient.get('/movie/popular', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getTopRatedMovies(page = 1) {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getUpcomingMovies(page = 1) {
    const response = await tmdbClient.get('/movie/upcoming', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getMovieDetails(id) {
    const response = await tmdbClient.get(`/movie/${id}`);
    return this.transformMovie(response.data);
  }
};

module.exports = tmdbApi;
```

### 3. Authentication Controller (`src/controllers/authController.js`)
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class AuthController {
  async register(req, res) {
    try {
      const { email, name, password } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const db = getDB();

      // Check if user exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password and create user
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

      const result = await db.collection('users').insertOne(user);

      // Generate token
      const token = jwt.sign(
        { userId: result.insertedId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: result.insertedId, email, name }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const db = getDB();

      // Find user
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
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
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new AuthController();
```

### 4. Movie Controller (`src/controllers/movieController.js`)
```javascript
const tmdbApi = require('../utils/tmdbApi');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class MovieController {
  async searchMovies(req, res) {
    try {
      const { q, page = 1 } = req.query;

      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const data = await tmdbApi.searchMovies(q, page);
      res.json(data);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Error searching movies' });
    }
  }

  async getPopularMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getPopularMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Popular movies error:', error);
      res.status(500).json({ message: 'Error fetching popular movies' });
    }
  }

  async getTopRatedMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getTopRatedMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Top rated error:', error);
      res.status(500).json({ message: 'Error fetching top rated movies' });
    }
  }

  async getUpcomingMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const data = await tmdbApi.getUpcomingMovies(page);
      res.json(data);
    } catch (error) {
      console.error('Upcoming movies error:', error);
      res.status(500).json({ message: 'Error fetching upcoming movies' });
    }
  }

  async getMovieDetails(req, res) {
    try {
      const { id } = req.params;
      const db = getDB();

      // Get movie details from TMDB
      const movie = await tmdbApi.getMovieDetails(id);

      // Add user-specific data if authenticated
      if (req.user) {
        const user = await db.collection('users').findOne({ _id: req.user.userId });

        // Add user rating
        const userRating = user.ratings.find(r => r.tmdbId == id);
        movie.userRating = userRating ? userRating.rating : null;

        // Add favorite status
        movie.isFavorite = user.favorites.includes(parseInt(id));

        // Add watchlist status
        movie.isInWatchlist = user.watchlist.includes(parseInt(id));
      }

      // Get comments for this movie
      const comments = await db.collection('comments')
        .find({ tmdbId: parseInt(id) })
        .sort({ createdAt: -1 })
        .toArray();

      movie.comments = comments;
      res.json(movie);
    } catch (error) {
      console.error('Movie details error:', error);
      res.status(500).json({ message: 'Error fetching movie details' });
    }
  }
}

module.exports = new MovieController();
```

### 5. User Controller (`src/controllers/userController.js`)
```javascript
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const tmdbApi = require('../utils/tmdbApi');

class UserController {
  async getProfile(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne(
        { _id: req.user.userId },
        { projection: { password: 0 } } // Exclude password
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  }

  async getUserStatistics(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const stats = {
        moviesRated: user.ratings.length,
        averageRating: user.ratings.length > 0
          ? user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length
          : 0,
        favoriteCount: user.favorites.length,
        watchlistCount: user.watchlist.length,
        memberSince: user.createdAt.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      res.json(stats);
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ message: 'Error fetching statistics' });
    }
  }

  async rateMovie(req, res) {
    try {
      const { tmdbId, rating } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || !rating || rating < 1 || rating > 10) {
        return res.status(400).json({ message: 'Valid tmdbId and rating (1-10) required' });
      }

      // Remove existing rating for this movie
      await db.collection('users').updateOne(
        { _id: userId },
        { $pull: { ratings: { tmdbId: parseInt(tmdbId) } } }
      );

      // Add new rating
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $push: {
            ratings: {
              tmdbId: parseInt(tmdbId),
              rating: parseInt(rating),
              ratedAt: new Date()
            }
          }
        }
      );

      res.json({ message: 'Rating saved successfully' });
    } catch (error) {
      console.error('Rate movie error:', error);
      res.status(500).json({ message: 'Error saving rating' });
    }
  }

  async getUserRatings(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each rated movie
      const ratingsWithMovies = await Promise.all(
        user.ratings.map(async (rating) => {
          try {
            const movie = await tmdbApi.getMovieDetails(rating.tmdbId);
            return {
              ...rating,
              movie
            };
          } catch (error) {
            console.error(`Error fetching movie ${rating.tmdbId}:`, error);
            return rating; // Return rating without movie details if TMDB fails
          }
        })
      );

      res.json(ratingsWithMovies);
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ message: 'Error fetching ratings' });
    }
  }

  async clearAllRatings(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { ratings: [] } }
      );
      res.json({ message: 'All ratings cleared successfully' });
    } catch (error) {
      console.error('Clear ratings error:', error);
      res.status(500).json({ message: 'Error clearing ratings' });
    }
  }

  async toggleFavorite(req, res) {
    try {
      const { tmdbId } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId) {
        return res.status(400).json({ message: 'tmdbId is required' });
      }

      const user = await db.collection('users').findOne({ _id: userId });
      const isFavorite = user.favorites.includes(parseInt(tmdbId));

      if (isFavorite) {
        // Remove from favorites
        await db.collection('users').updateOne(
          { _id: userId },
          { $pull: { favorites: parseInt(tmdbId) } }
        );
        res.json({ message: 'Removed from favorites', isFavorite: false });
      } else {
        // Add to favorites
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { favorites: parseInt(tmdbId) } }
        );
        res.json({ message: 'Added to favorites', isFavorite: true });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ message: 'Error updating favorites' });
    }
  }

  async getUserFavorites(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each favorite
      const favoriteMovies = await Promise.all(
        user.favorites.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              ...movie,
              addedAt: new Date().toISOString() // Simplified - could track actual add date
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      res.json(favoriteMovies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error fetching favorites' });
    }
  }

  async clearAllFavorites(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { favorites: [] } }
      );
      res.json({ message: 'All favorites cleared successfully' });
    } catch (error) {
      console.error('Clear favorites error:', error);
      res.status(500).json({ message: 'Error clearing favorites' });
    }
  }

  async toggleWatchlist(req, res) {
    try {
      const { tmdbId } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId) {
        return res.status(400).json({ message: 'tmdbId is required' });
      }

      const user = await db.collection('users').findOne({ _id: userId });
      const isInWatchlist = user.watchlist.includes(parseInt(tmdbId));

      if (isInWatchlist) {
        // Remove from watchlist
        await db.collection('users').updateOne(
          { _id: userId },
          { $pull: { watchlist: parseInt(tmdbId) } }
        );
        res.json({ message: 'Removed from watchlist', isInWatchlist: false });
      } else {
        // Add to watchlist
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { watchlist: parseInt(tmdbId) } }
        );
        res.json({ message: 'Added to watchlist', isInWatchlist: true });
      }
    } catch (error) {
      console.error('Toggle watchlist error:', error);
      res.status(500).json({ message: 'Error updating watchlist' });
    }
  }

  async getUserWatchlist(req, res) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get movie details for each watchlist item
      const watchlistMovies = await Promise.all(
        user.watchlist.map(async (tmdbId) => {
          try {
            const movie = await tmdbApi.getMovieDetails(tmdbId);
            return {
              ...movie,
              addedAt: new Date().toISOString() // Simplified - could track actual add date
            };
          } catch (error) {
            console.error(`Error fetching movie ${tmdbId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      res.json(watchlistMovies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ message: 'Error fetching watchlist' });
    }
  }

  async clearAllWatchlist(req, res) {
    try {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: req.user.userId },
        { $set: { watchlist: [] } }
      );
      res.json({ message: 'All watchlist items cleared successfully' });
    } catch (error) {
      console.error('Clear watchlist error:', error);
      res.status(500).json({ message: 'Error clearing watchlist' });
    }
  }
}

module.exports = new UserController();
```

### 6. Social Controller (`src/controllers/socialController.js`)
```javascript
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class SocialController {
  async getMovieComments(req, res) {
    try {
      const { tmdbId } = req.params;
      const db = getDB();

      const comments = await db.collection('comments')
        .find({ tmdbId: parseInt(tmdbId) })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(comments);
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  }

  async addComment(req, res) {
    try {
      const { tmdbId, content } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!tmdbId || !content || !content.trim()) {
        return res.status(400).json({ message: 'tmdbId and content are required' });
      }

      // Get user name
      const user = await db.collection('users').findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = {
        tmdbId: parseInt(tmdbId),
        userId,
        userName: user.name,
        content: content.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('comments').insertOne(comment);

      // Return the created comment
      const createdComment = await db.collection('comments').findOne({ _id: result.insertedId });
      res.status(201).json(createdComment);
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Error adding comment' });
    }
  }

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;
      const db = getDB();

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Content is required' });
      }

      // Check if comment exists and belongs to user
      const comment = await db.collection('comments').findOne({
        _id: new ObjectId(id),
        userId
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      // Update comment
      await db.collection('comments').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            content: content.trim(),
            updatedAt: new Date()
          }
        }
      );

      res.json({ message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Update comment error:', error);
      res.status(500).json({ message: 'Error updating comment' });
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const db = getDB();

      // Check if comment exists and belongs to user
      const comment = await db.collection('comments').findOne({
        _id: new ObjectId(id),
        userId
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      // Delete comment
      await db.collection('comments').deleteOne({ _id: new ObjectId(id) });

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ message: 'Error deleting comment' });
    }
  }

  async getFeed(req, res) {
    try {
      const db = getDB();
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      // Simple feed: recent comments across all movies
      const feedItems = await db.collection('comments')
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.json({
        items: feedItems,
        page: parseInt(page),
        hasMore: feedItems.length === parseInt(limit)
      });
    } catch (error) {
      console.error('Get feed error:', error);
      res.status(500).json({ message: 'Error fetching feed' });
    }
  }
}

module.exports = new SocialController();
```

### 7. Authentication Middleware (`src/middleware/auth.js`)
```javascript
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
```

### 8. Error Handler (`src/middleware/errorHandler.js`)
```javascript
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
```

### 9. All Routes (`src/routes/api.js`)
```javascript
const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');
const userController = require('../controllers/userController');
const socialController = require('../controllers/socialController');

// Middleware
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Movie routes (public)
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/popular', movieController.getPopularMovies);
router.get('/movies/top-rated', movieController.getTopRatedMovies);
router.get('/movies/upcoming', movieController.getUpcomingMovies);
router.get('/movies/:id', optionalAuth, movieController.getMovieDetails);

// User routes (authenticated)
router.get('/user/profile', authenticateToken, userController.getProfile);
router.get('/user/statistics', authenticateToken, userController.getUserStatistics);

// User rating routes
router.post('/user/rate', authenticateToken, userController.rateMovie);
router.get('/user/ratings', authenticateToken, userController.getUserRatings);
router.delete('/user/ratings', authenticateToken, userController.clearAllRatings);

// User favorite routes
router.post('/user/favorite', authenticateToken, userController.toggleFavorite);
router.get('/user/favorites', authenticateToken, userController.getUserFavorites);
router.delete('/user/favorites', authenticateToken, userController.clearAllFavorites);

// User watchlist routes
router.post('/user/watchlist', authenticateToken, userController.toggleWatchlist);
router.get('/user/watchlist', authenticateToken, userController.getUserWatchlist);
router.delete('/user/watchlist', authenticateToken, userController.clearAllWatchlist);

// Social routes
router.get('/comments/:tmdbId', socialController.getMovieComments);
router.post('/comments', authenticateToken, socialController.addComment);
router.put('/comments/:id', authenticateToken, socialController.updateComment);
router.delete('/comments/:id', authenticateToken, socialController.deleteComment);
router.get('/feed', socialController.getFeed);

module.exports = router;
```

### 10. Main Server (`server.js`)
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

### 11. Package.json
```json
{
  "name": "moviesocialapp-backend",
  "version": "1.0.0",
  "description": "Backend API for MovieSocialApp",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.3.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 12. Environment Variables (`.env`)
```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviesocialapp

# JWT
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# TMDB API
TMDB_API_KEY=your-tmdb-api-key

# CORS
FRONTEND_URL=http://localhost:3000
```

## API Response Examples

### Movie Details Response
```json
{
  "id": 502356,
  "title": "The Super Mario Bros. Movie",
  "posterUrl": "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mTahF68B.jpg",
  "rating": 7.8,
  "releaseDate": "2023-04-05",
  "genre": "Animation",
  "overview": "While working underground to fix a water main...",
  "userRating": 8,
  "isFavorite": true,
  "isInWatchlist": false,
  "comments": [
    {
      "_id": "...",
      "tmdbId": 502356,
      "userId": "...",
      "userName": "John Doe",
      "content": "Great movie!",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### User Statistics Response
```json
{
  "moviesRated": 15,
  "averageRating": 7.2,
  "favoriteCount": 8,
  "watchlistCount": 12,
  "memberSince": "2024-01-01"
}
```

## Frontend Integration

### Data Format Compatibility

The backend transforms all TMDB data to match the frontend's expected Movie interface:

```javascript
// Frontend expects this format:
interface Movie {
  id: number;           // ✅ TMDB ID
  title: string;        // ✅ TMDB title
  posterUrl: string;    // ✅ Full URL constructed from TMDB poster_path
  rating: number;       // ✅ TMDB vote_average
  releaseDate: string;  // ✅ TMDB release_date
  genre: string;        // ✅ First genre from TMDB genres array
  overview: string;     // ✅ TMDB overview
}
```

### API Calls from Frontend

```javascript
// Example frontend API integration
const API_BASE = 'http://localhost:5000/api';

// Get movie details with user data
const getMovieDetails = async (movieId, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE}/movies/${movieId}`, { headers });
  return response.json();
};

// Rate a movie
const rateMovie = async (tmdbId, rating, token) => {
  const response = await fetch(`${API_BASE}/user/rate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tmdbId, rating })
  });
  return response.json();
};

// Toggle favorite
const toggleFavorite = async (tmdbId, token) => {
  const response = await fetch(`${API_BASE}/user/favorite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tmdbId })
  });
  return response.json();
};
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file with:
- MongoDB Atlas connection string
- TMDB API key (get from https://www.themoviedb.org/settings/api)
- JWT secret (long random string)

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test API
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

## Summary

This complete simplified backend provides:

✅ **100% Frontend Compatibility** - All frontend data requirements covered
✅ **Real TMDB Integration** - Live movie data with proper transformation
✅ **Complete User Features** - Ratings, favorites, watchlist with statistics
✅ **Social Features** - Comments with full CRUD operations
✅ **Authentication** - JWT-based auth with proper security
✅ **Error Handling** - Comprehensive error management
✅ **Simple Architecture** - Easy to understand and maintain

The backend is production-ready for a demo/learning project while maintaining simplicity and covering all frontend needs!

## 🧪 Testing & Debugging

### Manual API Testing with curl

**Test Authentication Flow:**
```bash
# 1. Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# 2. Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Use token to access protected route
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/user/profile
```

**Test Movie Features:**
```bash
# Search movies
curl "http://localhost:5000/api/movies/search?q=fight"

# Get movie details
curl http://localhost:5000/api/movies/550

# Rate a movie (requires token)
curl -X POST http://localhost:5000/api/user/rate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tmdbId": 550, "rating": 9}'
```

### Using Postman (Recommended)
1. **Download Postman**: [getpostman.com](https://www.getpostman.com/)
2. **Import Collection**: Create requests for each endpoint
3. **Environment Variables**: Set `baseUrl` and `token` variables
4. **Test Workflows**: Register → Login → Rate Movie → Get Profile

### Common Debug Commands
```bash
# Check if server is running
curl http://localhost:5000/health

# Check MongoDB connection
# Look for "Connected to MongoDB" in server logs

# Check environment variables
node -e "console.log(process.env.TMDB_API_KEY ? 'TMDB Key OK' : 'TMDB Key Missing')"
```

## 🛡️ Security Best Practices

### 📖 **What You'll Learn**
- Essential security practices for production APIs
- How to protect user data and prevent attacks
- Common vulnerabilities and how to avoid them
- Security checklist for deployment

### 🔐 **Authentication Security**

#### **JWT Token Security**

**✅ Do This:**
```javascript
// Use strong, long JWT secrets (minimum 32 characters)
JWT_SECRET=your-super-long-random-secret-key-at-least-32-characters-long

// Set appropriate expiration times
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // Not too long, not too short
);
```

**❌ Never Do This:**
```javascript
// Weak secrets
JWT_SECRET=secret123

// No expiration
jwt.sign(payload, secret) // Token never expires

// Sensitive data in token
jwt.sign({ userId, password, email }, secret) // Don't include sensitive data
```

#### **Password Security**

**✅ Proper Password Hashing:**
```javascript
const bcrypt = require('bcrypt');

// Hash password before saving
const saltRounds = 10; // Good balance of security vs performance
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**❌ Never Store Plain Passwords:**
```javascript
// NEVER DO THIS
const user = {
  email: "user@example.com",
  password: "plaintext123" // 🚨 SECURITY BREACH
};
```

### 🔒 **Input Validation & Sanitization**

#### **Validate All Inputs**

```javascript
// ✅ Always validate input data
async rateMovie(req, res) {
  const { tmdbId, rating } = req.body;

  // Check required fields
  if (!tmdbId || !rating) {
    return res.status(400).json({ message: 'tmdbId and rating are required' });
  }

  // Validate data types and ranges
  if (typeof rating !== 'number' || rating < 1 || rating > 10) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 10' });
  }

  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    return res.status(400).json({ message: 'tmdbId must be a positive integer' });
  }

  // Continue with validated data...
}
```

#### **Sanitize User Input**

```javascript
// ✅ Sanitize text inputs
async addComment(req, res) {
  const { content } = req.body;

  // Remove dangerous characters and trim whitespace
  const sanitizedContent = content
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .substring(0, 1000); // Limit length

  if (!sanitizedContent) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  // Save sanitized content...
}
```

### 🌐 **CORS Security**

**✅ Configure CORS Properly:**
```javascript
// src/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Specific origins only
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicit methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specific headers
}));
```

**❌ Avoid Wildcard CORS in Production:**
```javascript
// DON'T DO THIS IN PRODUCTION
app.use(cors({
  origin: '*' // 🚨 Allows any website to access your API
}));
```

### 🔢 **Rate Limiting**

**Protect Against Abuse:**
```javascript
// Add to server.js
const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Stricter limits for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth attempts per windowMs
  skipSuccessfulRequests: true
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

### 🔍 **NoSQL Injection Prevention**

**✅ Validate MongoDB Queries:**
```javascript
// Safe: Use proper types
const userId = new ObjectId(req.user.userId); // Validated ObjectId

const user = await db.collection('users').findOne({
  _id: userId // Safe - ObjectId type
});

// Safe: Validate input before using in queries
const tmdbId = parseInt(req.body.tmdbId);
if (!Number.isInteger(tmdbId)) {
  return res.status(400).json({ message: 'Invalid movie ID' });
}
```

**❌ Dangerous Query Construction:**
```javascript
// DANGEROUS - Direct user input in query
const query = { email: req.body.email }; // Could be exploited
const user = await db.collection('users').findOne(query);
```

### 🔐 **Environment Security**

#### **Environment Variables**

**✅ Secure .env Management:**
```bash
# .env - Keep secure, never commit to git
NODE_ENV=production
JWT_SECRET=very-long-random-secret-key-generated-securely
MONGODB_URI=mongodb+srv://secure-user:complex-password@cluster.mongodb.net/db
TMDB_API_KEY=your-tmdb-key

# Add .env to .gitignore
echo ".env" >> .gitignore
```

**✅ Environment Validation:**
```javascript
// src/config/env.js
function validateEnvironment() {
  const required = ['JWT_SECRET', 'MONGODB_URI', 'TMDB_API_KEY'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
}

validateEnvironment();
```

### 🛡️ **HTTP Security Headers**

**Add Security Headers:**
```javascript
// Install: npm install helmet
const helmet = require('helmet');

// Add to server.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 📝 **Logging & Monitoring**

**Log Security Events:**
```javascript
// Log authentication attempts
async login(req, res) {
  const { email } = req.body;

  try {
    // ... login logic
    console.log(`✅ Successful login: ${email} from ${req.ip}`);
  } catch (error) {
    console.log(`❌ Failed login attempt: ${email} from ${req.ip}`);
    // Don't reveal if email exists
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

// Log suspicious activity
if (failedAttempts > 5) {
  console.log(`🚨 Multiple failed login attempts from ${req.ip}`);
}
```

### 🚨 **Common Vulnerabilities to Avoid**

#### **1. Exposing Sensitive Data**
```javascript
// ❌ BAD - Exposes password
const user = await db.collection('users').findOne({ email });
res.json(user); // Includes password field!

// ✅ GOOD - Exclude sensitive fields
const user = await db.collection('users').findOne(
  { email },
  { projection: { password: 0 } } // Exclude password
);
res.json(user);
```

#### **2. Information Disclosure**
```javascript
// ❌ BAD - Reveals system details
catch (error) {
  res.json({ error: error.stack }); // Exposes file paths, etc.
}

// ✅ GOOD - Generic error messages
catch (error) {
  console.error('Database error:', error); // Log for debugging
  res.status(500).json({ message: 'Internal server error' }); // Generic message
}
```

#### **3. Weak Error Handling**
```javascript
// ❌ BAD - Reveals if user exists
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
if (!bcrypt.compare(password, user.password)) {
  return res.status(401).json({ message: 'Wrong password' });
}

// ✅ GOOD - Same message for both cases
const user = await db.collection('users').findOne({ email });
const isValidPassword = user && await bcrypt.compare(password, user.password);

if (!isValidPassword) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

### ✅ **Security Checklist for Production**

**Before Deployment:**
- [ ] JWT secret is 32+ characters and randomly generated
- [ ] All passwords are hashed with bcrypt (saltRounds ≥ 10)
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] CORS configured for specific origins
- [ ] Environment variables validated
- [ ] No sensitive data in JWT tokens
- [ ] No sensitive data in logs
- [ ] Error messages don't reveal system details
- [ ] HTTPS enabled (handled by hosting platform)
- [ ] Security headers configured
- [ ] .env file not committed to git

**Monitoring:**
- [ ] Log authentication events
- [ ] Monitor failed login attempts
- [ ] Set up alerts for suspicious activity
- [ ] Regular security updates for dependencies

### 🔍 **Security Testing**

**Test Your Security:**
```bash
# Test rate limiting
for i in {1..10}; do curl http://localhost:5000/api/auth/login; done

# Test input validation
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"tmdbId": "invalid", "content": ""}'

# Test authentication
curl http://localhost:5000/api/user/profile
# Should return 401 without token

curl -H "Authorization: Bearer invalid-token" \
     http://localhost:5000/api/user/profile
# Should return 403 with invalid token
```

### 📚 **Learn More About Security**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Most critical web security risks
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### ✅ **Verification: Is Your API Secure?**

Before deploying, verify:
1. **Authentication works** and uses secure tokens
2. **Input validation** prevents malformed data
3. **Error handling** doesn't leak information
4. **Rate limiting** prevents abuse
5. **Environment variables** are properly secured

**Security confirmed? → Continue to Deployment**

## 🚀 Deployment Guide

### Environment Setup for Production

**1. Environment Variables for Production:**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/moviesocialapp
JWT_SECRET=much-longer-production-secret-key-at-least-32-characters
TMDB_API_KEY=your-tmdb-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

**2. Deployment Platforms:**

| Platform | Pros | Cons | Cost |
|----------|------|------|------|
| **Railway** | Easy, auto-deploy from Git | Limited free tier | Free → $5/month |
| **Render** | Simple, good free tier | Slow cold starts | Free → $7/month |
| **Vercel** | Great for Node.js | Functions model | Free → $20/month |
| **Heroku** | Well documented | No free tier | $7/month minimum |

**3. Quick Railway Deployment:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "Cannot connect to MongoDB"
**Symptoms**: Server crashes on startup, "MongoServerError" in logs

**Solutions**:
1. **Check connection string**: Make sure it's correct in `.env`
2. **IP Whitelist**: Add your IP to MongoDB Atlas Network Access
3. **Username/Password**: Verify database user credentials
4. **Network**: Try from different network (some ISPs block MongoDB)

```bash
# Test MongoDB connection
node -e "
const { MongoClient } = require('mongodb');
MongoClient.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connection OK'))
  .catch(err => console.log('❌ MongoDB error:', err.message));
"
```

#### ❌ "TMDB API requests failing"
**Symptoms**: Movie search returns errors, 401 Unauthorized

**Solutions**:
1. **Check API key**: Verify it's correctly set in `.env`
2. **Key activation**: TMDB keys take a few minutes to activate
3. **Rate limits**: Wait if you've hit the rate limit (40 requests/10 seconds)

```bash
# Test TMDB API key
curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY"
```

#### ❌ "JWT token invalid"
**Symptoms**: "Invalid token" errors on protected routes

**Solutions**:
1. **Token format**: Ensure header is `Authorization: Bearer YOUR_TOKEN`
2. **Token expiry**: Tokens expire after 7 days, login again
3. **Secret mismatch**: Verify `JWT_SECRET` is consistent

```bash
# Check token format
echo "YOUR_TOKEN" | base64 -d
```

#### ❌ "CORS errors in frontend"
**Symptoms**: Browser console shows CORS policy errors

**Solutions**:
1. **Frontend URL**: Update `FRONTEND_URL` in `.env`
2. **CORS setup**: Verify CORS middleware is configured
3. **Credentials**: Use `credentials: true` in frontend fetch

#### ❌ "Port already in use"
**Symptoms**: `EADDRINUSE` error on startup

**Solutions**:
```bash
# Find what's using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 PID  # Mac/Linux
taskkill /PID PID /F  # Windows

# Or use different port
PORT=5001 npm run dev
```

### Development Tips

#### 🐛 Debug Logging
Add logging to understand what's happening:
```javascript
// In any controller
console.log('Request body:', req.body);
console.log('User:', req.user);
console.log('Database query result:', result);
```

#### 🔍 MongoDB Compass
**Visual MongoDB client**: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connect with your MongoDB URI
- Browse collections and documents
- Test queries visually

#### ⚡ Hot Reload
Use nodemon for automatic restarts:
```bash
# Already in package.json
npm run dev

# Or manually
npx nodemon server.js
```

## 📚 Learning Resources

### 🎓 Beginner Resources

**JavaScript & Node.js Fundamentals:**
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Node.js Official Tutorial](https://nodejs.org/en/learn)
- [JavaScript.info - Modern JavaScript](https://javascript.info/)

**MongoDB Basics:**
- [MongoDB University (Free)](https://university.mongodb.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Compass Tutorial](https://docs.mongodb.com/compass/current/)

**Express.js Framework:**
- [Express.js Official Guide](https://expressjs.com/en/guide/routing.html)
- [Express.js Tutorial - MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

### 🔐 Authentication & Security

**JWT Tokens:**
- [JWT.io - Token Debugger](https://jwt.io/)
- [JWT Authentication Tutorial](https://auth0.com/learn/json-web-tokens/)

**Password Security:**
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [OWASP Password Guidelines](https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html)

### 🔧 Tools & Debugging

**API Testing:**
- [Postman Learning Center](https://learning.postman.com/)
- [curl Tutorial](https://curl.se/docs/tutorial.html)
- [Thunder Client (VS Code)](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)

**Database Tools:**
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Visual MongoDB client
- [Studio 3T](https://studio3t.com/) - Advanced MongoDB IDE

### 📖 Advanced Topics

**API Design:**
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [API Documentation with Swagger](https://swagger.io/docs/)

**Testing:**
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Supertest for API Testing](https://www.npmjs.com/package/supertest)

**Production Deployment:**
- [Node.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Railway Deployment Guide](https://docs.railway.app/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

### 🎬 Movie API Resources

**TMDB API:**
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [TMDB API Wrapper Libraries](https://www.npmjs.com/search?q=tmdb)

### 💡 Code Quality

**Code Style:**
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Code Formatter](https://prettier.io/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**Project Structure:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Project Structure](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/)

---
