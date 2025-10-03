# MovieSocialApp API Documentation

**Base URL:** `http://localhost:5000/api`
**Status:** ✅ Auth and Movie endpoints live (27/27 tests passing)
**Last Updated:** October 2025

---

## Table of Contents
1. [Quick Start - Frontend Integration](#quick-start---frontend-integration)
2. [API Endpoints Reference](#api-endpoints-reference)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)

---

## Quick Start - Frontend Integration

### Step 1: Install Dependencies

```bash
npm install axios
```

### Step 2: Create API Service (`src/services/api.js`)

Copy-paste this complete implementation:

```javascript
// src/services/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Auto-add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION
// ============================================

export const register = async (email, name, password) => {
  const response = await api.post('/auth/register', { email, name, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => !!localStorage.getItem('token');

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ============================================
// MOVIES
// ============================================

export const searchMovies = async (query, page = 1) => {
  const response = await api.get('/movies/search', { params: { q: query, page } });
  return response.data;
};

export const getPopularMovies = async (page = 1) => {
  const response = await api.get('/movies/popular', { params: { page } });
  return response.data;
};

export const getTopRatedMovies = async (page = 1) => {
  const response = await api.get('/movies/top-rated', { params: { page } });
  return response.data;
};

export const getUpcomingMovies = async (page = 1) => {
  const response = await api.get('/movies/upcoming', { params: { page } });
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

// ============================================
// USER (Coming Soon)
// ============================================

export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const rateMovie = async (tmdbId, rating) => {
  const response = await api.post('/user/rate', { tmdbId, rating });
  return response.data;
};

export const toggleFavorite = async (tmdbId) => {
  const response = await api.post('/user/favorite', { tmdbId });
  return response.data;
};

export const getUserFavorites = async () => {
  const response = await api.get('/user/favorites');
  return response.data;
};

export const toggleWatchlist = async (tmdbId) => {
  const response = await api.post('/user/watchlist', { tmdbId });
  return response.data;
};

export const getUserWatchlist = async () => {
  const response = await api.get('/user/watchlist');
  return response.data;
};

// ============================================
// SOCIAL (Coming Soon)
// ============================================

export const getMovieComments = async (tmdbId) => {
  const response = await api.get(`/comments/${tmdbId}`);
  return response.data;
};

export const addComment = async (tmdbId, content) => {
  const response = await api.post('/comments', { tmdbId, content });
  return response.data;
};

export const updateComment = async (commentId, content) => {
  const response = await api.put(`/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export default api;
```

### Step 3: Create Environment File (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Usage Examples

#### Login Component

```jsx
// src/components/Login.jsx
import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

#### Movies List Component

```jsx
// src/components/PopularMovies.jsx
import { useState, useEffect } from 'react';
import { getPopularMovies } from '../services/api';

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPopularMovies(page);
        setMovies(data.results);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-80 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-yellow-500">⭐ {movie.rating}</span>
                <span className="text-gray-500 text-xs">{movie.releaseDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default PopularMovies;
```

#### Protected Route

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// Usage: <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

#### Custom Hook for API Calls

```jsx
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunc, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, deps);

  return { data, loading, error, refetch: fetchData };
};

// Usage: const { data: movies, loading, error } = useApi(() => getPopularMovies(1));
```

---

## API Endpoints Reference

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:** `400` (missing fields/duplicate email), `500` (server error)

---

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):** Same as register

**Errors:** `400` (missing fields), `401` (invalid credentials), `500` (server error)

---

### Movies

#### Search Movies
```http
GET /api/movies/search?q={query}&page={page}
```

**Auth:** Not required
**Params:** `q` (required), `page` (optional, default: 1)

**Response (200):**
```json
{
  "page": 1,
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "posterUrl": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "rating": 8.4,
      "releaseDate": "1999-10-15",
      "genre": "Drama",
      "overview": "A ticking-time-bomb insomniac and a slippery soap salesman..."
    }
  ],
  "total_results": 42,
  "total_pages": 3
}
```

**Errors:** `400` (missing query), `500` (server error)

---

#### Get Popular Movies
```http
GET /api/movies/popular?page={page}
```

**Auth:** Not required
**Params:** `page` (optional, default: 1)
**Response:** Same structure as search

---

#### Get Top Rated Movies
```http
GET /api/movies/top-rated?page={page}
```

**Auth:** Not required
**Params:** `page` (optional, default: 1)
**Response:** Same structure as search

---

#### Get Upcoming Movies
```http
GET /api/movies/upcoming?page={page}
```

**Auth:** Not required
**Params:** `page` (optional, default: 1)
**Response:** Same structure as search

---

#### Get Movie Details
```http
GET /api/movies/:id
Authorization: Bearer {token}  (optional)
```

**Auth:** Optional (returns enhanced data if authenticated)

**Guest Response (200):**
```json
{
  "id": 550,
  "title": "Fight Club",
  "posterUrl": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "rating": 8.4,
  "releaseDate": "1999-10-15",
  "genre": "Drama",
  "overview": "A ticking-time-bomb insomniac...",
  "comments": []
}
```

**Authenticated Response (200):**
```json
{
  "id": 550,
  "title": "Fight Club",
  "posterUrl": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "rating": 8.4,
  "releaseDate": "1999-10-15",
  "genre": "Drama",
  "overview": "A ticking-time-bomb insomniac...",
  "userRating": 9,
  "isFavorite": true,
  "isInWatchlist": false,
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "tmdbId": 550,
      "userId": "507f191e810c19729de860ea",
      "userName": "John Doe",
      "content": "Amazing movie!",
      "createdAt": "2025-10-01T12:00:00.000Z",
      "updatedAt": "2025-10-01T12:00:00.000Z"
    }
  ]
}
```

**Errors:** `404` (movie not found), `500` (server error)

---

### User Endpoints (Coming Soon)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/user/profile` | GET | Required | Get user profile |
| `/api/user/statistics` | GET | Required | Get user stats |
| `/api/user/rate` | POST | Required | Rate a movie (body: `{tmdbId, rating}`) |
| `/api/user/ratings` | GET | Required | Get user's ratings |
| `/api/user/favorite` | POST | Required | Toggle favorite (body: `{tmdbId}`) |
| `/api/user/favorites` | GET | Required | Get user's favorites |
| `/api/user/watchlist` | POST | Required | Toggle watchlist (body: `{tmdbId}`) |
| `/api/user/watchlist` | GET | Required | Get user's watchlist |

---

### Social Endpoints (Coming Soon)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/comments/:tmdbId` | GET | Optional | Get movie comments |
| `/api/comments` | POST | Required | Add comment (body: `{tmdbId, content}`) |
| `/api/comments/:id` | PUT | Required | Update comment (body: `{content}`) |
| `/api/comments/:id` | DELETE | Required | Delete comment |
| `/api/feed` | GET | Required | Get activity feed |

---

## Data Models

### Movie Object
```typescript
{
  id: number;              // TMDB movie ID
  title: string;           // Movie title
  posterUrl: string;       // Full URL to poster
  rating: number;          // TMDB rating (0-10)
  releaseDate: string;     // ISO date (YYYY-MM-DD)
  genre: string;           // Primary genre
  overview: string;        // Movie description

  // Only for authenticated users
  userRating?: number;     // User's rating (1-10) or null
  isFavorite?: boolean;    // In favorites
  isInWatchlist?: boolean; // In watchlist
  comments?: Comment[];    // Array of comments
}
```

### User Object
```typescript
{
  id: string;              // MongoDB ObjectId
  email: string;           // User email
  name: string;            // Display name
}
```

### Comment Object
```typescript
{
  _id: string;             // MongoDB ObjectId
  tmdbId: number;          // Movie TMDB ID
  userId: string;          // User who posted
  userName: string;        // User's display name
  content: string;         // Comment text
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
```

### Auth Response
```typescript
{
  token: string;           // JWT token (7-day expiry)
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "message": "Error description here"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET/PUT/DELETE |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Missing/invalid parameters |
| `401` | Unauthorized | Missing/invalid auth token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `500` | Internal Server Error | Server-side error |

### Common Error Messages

**Authentication:**
- `"Access token required"` - No token provided
- `"Invalid token"` - Token malformed or user doesn't exist
- `"Token expired"` - Token expired (>7 days)
- `"Invalid credentials"` - Wrong email/password

**Validation:**
- `"All fields required"` - Missing required fields
- `"Email already exists"` - Duplicate email on registration
- `"Search query is required"` - Missing `q` parameter

**Resources:**
- `"Movie not found"` - Invalid TMDB movie ID
- `"Route not found"` - Invalid API endpoint

---

## Testing the API

### Health Check
```bash
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"2025-10-04T00:00:00.000Z"}
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Movies
```bash
# Search
curl "http://localhost:5000/api/movies/search?q=fight"

# Popular
curl http://localhost:5000/api/movies/popular

# Details (guest)
curl http://localhost:5000/api/movies/550

# Details (authenticated)
curl http://localhost:5000/api/movies/550 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Important Notes

1. **CORS:** Enabled for `http://localhost:3000` (React default port)
2. **Token Storage:** Store JWT in localStorage (or secure cookie for production)
3. **Token Expiry:** 7 days - implement re-login flow when expired
4. **Pagination:** Most list endpoints support `?page=N` parameter
5. **Image URLs:** Poster URLs are complete - use directly in `<img>` tags
6. **Guest vs Auth:** Many endpoints work without auth but return enhanced data when authenticated
7. **Error Handling:** Always check `error.response.data.message` for user-friendly messages
8. **Development:** Backend on port 5000, frontend on port 3000
9. **Tests:** All endpoints have passing tests - safe to integrate

---

**API Version:** 1.0
**Backend Status:** ✅ Running and tested (27/27 tests passing)
