# Movie Pulse

A modern, full-stack movie discovery and social networking platform that combines the power of The Movie Database (TMDB) with social features, enabling users to discover movies, build personal collections, and engage with a community of movie enthusiasts.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3.0-brightgreen)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-cyan)

## Overview

Movie Pulse is a comprehensive movie platform that allows users to:
- Discover and search thousands of movies from TMDB
- Rate movies and build personal favorites and watchlist collections
- Engage with other users through comments and activity feeds
- View real-time community activity with Server-Sent Events
- Explore public user profiles and movie statistics

## Features

### Movie Discovery
- **Search & Browse**: Search movies with debounced input, browse popular, top-rated, and new releases
- **Genre Filtering**: Filter by 18 genres (Action, Drama, Sci-Fi, Comedy, Thriller, Romance, and more)
- **Detailed Information**: View comprehensive movie details including trailers, cast, crew, and ratings
- **Hero Section**: Featured movies with stunning backdrops

### Personal Collections
- **Rating System**: Rate movies on a 1-10 star scale with visual feedback
- **Favorites**: Save your favorite movies for quick access
- **Watchlist**: Keep track of movies you want to watch
- **Statistics Dashboard**: View personalized stats and analytics

### Social Features
- **Comments**: Engage in discussions on any movie with edit/delete functionality
- **Activity Feed**: Real-time feed showing community activity (ratings, comments, favorites)
- **Public Profiles**: Explore other users' profiles and their movie preferences
- **Live Updates**: Server-Sent Events (SSE) for instant activity notifications

### User Management
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Password Recovery**: Email-based password reset functionality
- **Profile Management**: Update name, change password, view personal statistics
- **Persistent Sessions**: Stay logged in with localStorage token management

## Tech Stack

### Frontend (`/client`)
- **Framework**: React 19.1.1 with modern features
- **Build Tool**: Vite 7.1.7 for lightning-fast development
- **Styling**: Tailwind CSS 4.1.13 with dark/light mode support
- **UI Components**: Shadcn/ui with Radix UI primitives (15 components)
- **Icons**: Lucide React
- **State Management**: React Context API + local component state
- **Type Safety**: JSDoc annotations throughout

### Backend (`/moviesocialapp-backend`)
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 6.3.0 (native driver)
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcrypt 5.1.1
- **External API**: TMDB API integration via axios
- **Email Service**: Nodemailer 7.0.10 (Gmail)
- **Real-time**: Server-Sent Events (SSE)

## Project Structure

```
movieprojectskgcode/
├── client/                           # Frontend React application
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── assets/
│   │   │   ├── lib/                  # Utilities (cn function)
│   │   │   ├── types/                # JSDoc type definitions
│   │   │   └── ui/                   # Shadcn/ui components (15)
│   │   ├── components/               # Feature components (19)
│   │   │   ├── Dashboard/            # Main landing page
│   │   │   ├── FeedPage/             # Real-time activity feed
│   │   │   ├── Header/               # Navigation and search
│   │   │   ├── Login/                # Authentication UI
│   │   │   ├── MovieCard/            # Movie preview card
│   │   │   ├── MovieDetails/         # Full movie modal
│   │   │   ├── UserProfile/          # User profile with tabs
│   │   │   └── ...                   # 12 more components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── services/
│   │   │   └── api.js                # Centralized API layer
│   │   ├── index.css                 # Global styles + Tailwind
│   │   └── main.jsx                  # App entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md                     # Frontend documentation
│
├── moviesocialapp-backend/           # Backend Node.js API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Registration, login, password reset
│   │   │   ├── movieController.js    # Movie search & retrieval
│   │   │   ├── socialController.js   # Comments & activity feed
│   │   │   └── userController.js     # Profile, ratings, collections
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authentication
│   │   │   └── errorHandler.js       # Global error handling
│   │   ├── routes/
│   │   │   └── api.js                # API route definitions
│   │   └── utils/
│   │       ├── emailService.js       # Email functionality
│   │       └── tmdbApi.js            # TMDB API integration
│   ├── server.js                     # Main entry point
│   ├── package.json
│   └── README.md                     # Backend documentation
│
└── README.md                         # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api)
- **Gmail Account** - For password reset emails (with App Password enabled)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movieprojectskgcode
   ```

2. **Backend Setup**

   ```bash
   cd moviesocialapp-backend
   npm install
   ```

   Create `.env` file in `moviesocialapp-backend/`:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/moviesocialapp

   # Authentication
   JWT_SECRET=your_strong_jwt_secret_key_here

   # TMDB API
   TMDB_API_KEY=your_tmdb_api_key_here

   # Email Service (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password

   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   ```

   Create `.env` file in `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Usage

1. **Register an Account**
   - Navigate to `http://localhost:3000`
   - Click on "Register" and create your account
   - Log in with your credentials

2. **Discover Movies**
   - Use the search bar to find movies
   - Browse categories: Popular, Top Rated, New Releases
   - Filter by genre using the genre buttons
   - Click on any movie to view detailed information

3. **Build Your Collection**
   - Rate movies by clicking on the star rating
   - Add movies to favorites by clicking the heart icon
   - Add movies to watchlist by clicking the bookmark icon
   - Access your collections from your profile

4. **Engage with Community**
   - Comment on movies to share your thoughts
   - View the activity feed to see what others are watching
   - Click on usernames to view public profiles
   - Watch real-time updates in the feed

## Architecture

### Container/View Pattern (Frontend)
The application follows a strict separation of concerns:
- **Container components** (e.g., `DashboardPage.jsx`) handle state, logic, and data fetching
- **View components** (e.g., `DashboardView.jsx`) are pure presentational components

### Data Flow
```
User Action (Frontend)
    ↓
React Component (Container)
    ↓
API Service Layer (api.js)
    ↓
HTTP Request with JWT
    ↓
Express Route (/api/...)
    ↓
Auth Middleware (verify JWT)
    ↓
Controller (business logic)
    ↓
MongoDB (data persistence) ←→ TMDB API (movie data)
    ↓
JSON Response
    ↓
Frontend State Update
    ↓
UI Re-render (View)
```

### Database Schema

**Users Collection:**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  name: String,
  password: String (bcrypt hashed),
  createdAt: Date,
  favorites: [Number],              // TMDB movie IDs
  watchlist: [Number],              // TMDB movie IDs
  ratings: [{
    tmdbId: Number,
    rating: Number (1-10),
    ratedAt: Date
  }]
}
```

**Comments Collection:**
```javascript
{
  _id: ObjectId,
  tmdbId: Number,                   // TMDB movie ID
  userId: ObjectId,                 // Reference to users
  userName: String,                 // Denormalized for performance
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### Movies
- `GET /api/movies/search?q=query` - Search movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/top-rated` - Get top-rated movies
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/genre/:genre` - Get movies by genre
- `GET /api/movies/:id` - Get movie details

### User (Authenticated)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `GET /api/user/statistics` - Get user statistics
- `POST /api/user/rate` - Rate a movie
- `GET /api/user/ratings` - Get user ratings
- `POST /api/user/favorite` - Toggle favorite
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/watchlist` - Toggle watchlist
- `GET /api/user/watchlist` - Get watchlist

### Social
- `GET /api/comments/:tmdbId` - Get movie comments
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/feed` - Get activity feed (paginated or SSE stream)
- `GET /api/users/:userId/public-profile` - Get public profile

For detailed API documentation, see [Backend README](moviesocialapp-backend/README.md).

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day token expiration
- **Authorization Middleware**: Verify user on each protected route
- **Ownership Verification**: Users can only modify their own data
- **Input Validation**: Email, password, and data validation
- **CORS Protection**: Configurable cross-origin policies
- **Secure Headers**: No sensitive information in error responses

## Development

### Frontend Development
```bash
cd client
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd moviesocialapp-backend
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start in production mode
```

## Environment Variables

### Frontend (`.env` in `/client`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`.env` in `/moviesocialapp-backend`)
```env
MONGODB_URI=mongodb://localhost:27017/moviesocialapp
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Modern browsers with ES6+ support required.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the Container/View pattern for frontend components
4. Use JSDoc annotations for type safety
5. Test both light and dark modes
6. Ensure accessibility standards are met
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the comprehensive movie data API
- [React](https://react.dev/) for the powerful UI framework
- [Vite](https://vite.dev/) for the blazing-fast build tool
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful, accessible component system
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for the accessible UI primitives
- [Lucide](https://lucide.dev/) for the elegant icon library

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with passion for movies and code.** 🎬🍿

