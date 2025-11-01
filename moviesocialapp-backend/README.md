# MovieSocialApp Backend

A robust REST API backend for a movie social networking platform built with Node.js, Express, and MongoDB. This backend integrates with The Movie Database (TMDB) API to provide comprehensive movie data while managing user authentication, personalized collections, and social interactions.

## Features

### Core Functionality
- **User Authentication** - Secure JWT-based authentication with password hashing
- **Movie Discovery** - Search and browse movies (popular, top-rated, upcoming, by genre)
- **Personal Collections** - Manage favorites, watchlist, and ratings
- **Social Features** - Comment on movies, view activity feeds, explore public profiles
- **Real-time Updates** - Server-Sent Events (SSE) for live activity feed
- **Password Recovery** - Email-based password reset with temporary passwords

### Key Capabilities
- Integration with TMDB API for real-time movie data
- User profile management and statistics
- Public user profiles with activity history
- Movie ratings system (1-10 scale)
- Comment system with edit/delete functionality
- Activity feed with pagination and streaming

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB v6.3.0 (native driver)
- **Authentication**: JWT (jsonwebtoken v9.0.2) + bcrypt v5.1.1
- **External APIs**: TMDB API (via axios v1.6.2)
- **Email Service**: Nodemailer v7.0.10 (Gmail)
- **Other**: CORS, dotenv

## Project Structure

```
moviesocialapp-backend/
├── server.js                      # Main entry point & server configuration
├── package.json                   # Dependencies & scripts
├── .env                          # Environment variables (not tracked)
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js     # Registration, login, password reset
│   │   ├── movieController.js    # Movie search & retrieval
│   │   ├── socialController.js   # Comments & activity feed
│   │   └── userController.js     # Profile, ratings, favorites, watchlist
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication & authorization
│   │   └── errorHandler.js       # Global error handling
│   ├── routes/
│   │   └── api.js                # API route definitions
│   └── utils/
│       ├── emailService.js       # Email sending functionality
│       └── tmdbApi.js            # TMDB API integration
└── test-*.js                      # Test files
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))
- Gmail account for email service (with App Password enabled)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moviesocialapp-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/moviesocialapp

   # Authentication
   JWT_SECRET=your_jwt_secret_key_here

   # TMDB API
   TMDB_API_KEY=your_tmdb_api_key_here

   # Email Service (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password

   # Server Configuration (optional)
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**

   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

5. **Verify the server is running**
   ```bash
   curl http://localhost:5000/health
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

---

### Movie Endpoints

#### Search Movies
```http
GET /api/movies/search?q=inception&page=1
```

#### Get Popular Movies
```http
GET /api/movies/popular?page=1
```

#### Get Top Rated Movies
```http
GET /api/movies/top-rated?page=1
```

#### Get Upcoming Movies
```http
GET /api/movies/upcoming?page=1
```

#### Get Movies by Genre
```http
GET /api/movies/genre/action?page=1
```
Available genres: action, adventure, animation, comedy, crime, documentary, drama, family, fantasy, history, horror, music, mystery, romance, sci-fi, thriller, war, western

#### Get Movie Details
```http
GET /api/movies/:id
Authorization: Bearer <token> (optional - provides user-specific data if authenticated)
```

---

### User Endpoints (Authenticated)

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

#### Change Password
```http
PUT /api/user/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

#### Get User Statistics
```http
GET /api/user/statistics
Authorization: Bearer <token>
```

#### Rate a Movie
```http
POST /api/user/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdbId": 27205,
  "rating": 8.5
}
```

#### Get Ratings
```http
GET /api/user/ratings
Authorization: Bearer <token>
```

#### Clear All Ratings
```http
DELETE /api/user/ratings
Authorization: Bearer <token>
```

#### Toggle Favorite
```http
POST /api/user/favorite
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdbId": 27205
}
```

#### Get Favorites
```http
GET /api/user/favorites
Authorization: Bearer <token>
```

#### Clear All Favorites
```http
DELETE /api/user/favorites
Authorization: Bearer <token>
```

#### Toggle Watchlist
```http
POST /api/user/watchlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdbId": 27205
}
```

#### Get Watchlist
```http
GET /api/user/watchlist
Authorization: Bearer <token>
```

#### Clear Watchlist
```http
DELETE /api/user/watchlist
Authorization: Bearer <token>
```

---

### Social Endpoints

#### Get Comments for Movie
```http
GET /api/comments/:tmdbId
```

#### Add Comment
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdbId": 27205,
  "content": "Great movie!"
}
```

#### Update Comment
```http
PUT /api/comments/:commentId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Amazing movie!"
}
```

#### Delete Comment
```http
DELETE /api/comments/:commentId
Authorization: Bearer <token>
```

#### Get Activity Feed (Paginated)
```http
GET /api/feed?page=1&limit=20
```

#### Get Activity Feed (Real-time Stream)
```http
GET /api/feed?stream=true
Accept: text/event-stream
```

#### Get Public User Profile
```http
GET /api/users/:userId/public-profile
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  name: String,
  password: String (bcrypt hashed),
  createdAt: Date,
  passwordChangedAt: Date (optional),
  favorites: [Number],              // Array of TMDB movie IDs
  watchlist: [Number],              // Array of TMDB movie IDs
  ratings: [
    {
      tmdbId: Number,
      rating: Number (1-10),
      ratedAt: Date
    }
  ]
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  tmdbId: Number,                   // TMDB movie ID
  userId: ObjectId,                 // Reference to users collection
  userName: String,                 // Denormalized for performance
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:
- `users`: email (unique)
- `comments`: createdAt (descending), tmdbId

---

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration, signed with secret key
- **Authorization**: User verification on each authenticated request
- **Input Validation**: Email, password, and data validation
- **CORS**: Configurable cross-origin policies
- **Error Handling**: No sensitive information leaked in errors
- **Ownership Checks**: Users can only modify their own data

---

## Available Scripts

```bash
npm start          # Start the server in production mode
npm run dev        # Start the server with nodemon (auto-restart)
```

---

## Error Handling

The API uses conventional HTTP response codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

---

## Testing

Test files are included for various endpoints:
- `test-auth.js` - Authentication endpoints
- `test-comments.js` - Comment functionality
- `test-feed.js` - Activity feed
- `test-movies.js` - Movie endpoints
- `test-social.js` - Social features
- `test-users.js` - User endpoints

Run tests by executing individual test files:
```bash
node test-auth.js
node test-movies.js
# etc.
```

---

## Architecture Decisions

### Why Native MongoDB Driver?
- Lightweight and fast
- Direct control over queries
- No ORM overhead
- Suitable for the relatively simple schema

### Why Embedded Data?
User data (favorites, watchlist, ratings) is embedded in the user document for:
- Faster queries (single document read)
- Atomic updates
- Simpler data model for this use case

### Why SSE for Real-time Feed?
- Simpler than WebSockets for one-way data flow
- Built-in reconnection handling
- Works well with HTTP infrastructure
- Fallback to REST API available

### Why TMDB Integration?
- No need to maintain a movie database
- Always up-to-date movie information
- Rich metadata (cast, crew, trailers, images)
- Free tier available for development

---

## Environment Configuration

### Development
- Uses nodemon for auto-restart
- Permissive CORS for localhost
- Detailed logging
- MongoDB on localhost

### Production Considerations
- Set `NODE_ENV=production`
- Configure `FRONTEND_URL` for CORS
- Use MongoDB Atlas or similar cloud database
- Set strong `JWT_SECRET`
- Enable Gmail App Password for email service
- Consider rate limiting middleware
- Add request logging (Morgan, Winston)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- Express.js community for excellent documentation
- MongoDB for a flexible NoSQL database solution

---

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Happy Coding!** 🎬🍿
