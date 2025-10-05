const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const HEALTH_URL = 'http://localhost:5000/health';

// Test data
let testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'Test123!@#',
  name: 'Test User'
};

let testUser2 = {
  email: `test2-${Date.now()}@example.com`,
  password: 'Test123!@#',
  name: 'Test User 2'
};

let token = '';
let token2 = '';
let commentId = '';

// Color codes for output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function logTest(name, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`✅ ${name}`, GREEN);
    if (details) log(`   ${details}`, BLUE);
  } else {
    failedTests++;
    log(`❌ ${name}`, RED);
    if (details) log(`   ${details}`, RED);
  }
}

async function testHealthCheck() {
  log('\n========================================', YELLOW);
  log('🏥 HEALTH CHECK', YELLOW);
  log('========================================\n', YELLOW);

  try {
    const res = await axios.get(HEALTH_URL);
    logTest('Health check endpoint', res.status === 200, `Status: ${res.data.status}, DB: ${res.data.database}`);
  } catch (error) {
    logTest('Health check endpoint', false, error.message);
  }
}

async function testAuthentication() {
  log('\n========================================', YELLOW);
  log('🔐 AUTHENTICATION ENDPOINTS', YELLOW);
  log('========================================\n', YELLOW);

  // Register user 1
  try {
    const res = await axios.post(`${API_URL}/auth/register`, testUser);
    token = res.data.token;
    logTest('POST /api/auth/register - User 1', res.status === 201 && token, `Token received: ${token ? 'Yes' : 'No'}`);
  } catch (error) {
    logTest('POST /api/auth/register - User 1', false, error.response?.data?.message || error.message);
  }

  // Register user 2
  try {
    const res = await axios.post(`${API_URL}/auth/register`, testUser2);
    token2 = res.data.token;
    logTest('POST /api/auth/register - User 2', res.status === 201 && token2, `Token received: ${token2 ? 'Yes' : 'No'}`);
  } catch (error) {
    logTest('POST /api/auth/register - User 2', false, error.response?.data?.message || error.message);
  }

  // Register duplicate (should fail)
  try {
    const res = await axios.post(`${API_URL}/auth/register`, testUser);
    logTest('POST /api/auth/register - Duplicate email (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('POST /api/auth/register - Duplicate email', error.response?.status === 400, `Status: ${error.response?.status}, Message: ${error.response?.data?.message}`);
  }

  // Register missing fields (should fail)
  try {
    const res = await axios.post(`${API_URL}/auth/register`, { email: 'test@test.com' });
    logTest('POST /api/auth/register - Missing fields (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('POST /api/auth/register - Missing fields', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Login
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    logTest('POST /api/auth/login - Valid credentials', res.status === 200 && res.data.token, `Token: ${res.data.token ? 'Received' : 'Missing'}`);
  } catch (error) {
    logTest('POST /api/auth/login - Valid credentials', false, error.response?.data?.message || error.message);
  }

  // Login wrong password (should fail)
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: 'wrongpassword'
    });
    logTest('POST /api/auth/login - Wrong password (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('POST /api/auth/login - Wrong password', error.response?.status === 401, `Status: ${error.response?.status}, Message: ${error.response?.data?.message}`);
  }

  // Login non-existent user (should fail)
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'nonexistent@example.com',
      password: 'password'
    });
    logTest('POST /api/auth/login - Non-existent user (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('POST /api/auth/login - Non-existent user', error.response?.status === 401, `Status: ${error.response?.status}`);
  }
}

async function testMovieEndpoints() {
  log('\n========================================', YELLOW);
  log('🎬 MOVIE ENDPOINTS (PUBLIC)', YELLOW);
  log('========================================\n', YELLOW);

  // Search movies
  try {
    const res = await axios.get(`${API_URL}/movies/search?q=fight club`);
    logTest('GET /api/movies/search', res.status === 200 && res.data.results?.length > 0, `Found ${res.data.results?.length || 0} movies`);
  } catch (error) {
    logTest('GET /api/movies/search', false, error.message);
  }

  // Search with pagination
  try {
    const res = await axios.get(`${API_URL}/movies/search?q=matrix&page=2`);
    logTest('GET /api/movies/search - Pagination', res.status === 200 && res.data.page === 2, `Page: ${res.data.page}`);
  } catch (error) {
    logTest('GET /api/movies/search - Pagination', false, error.message);
  }

  // Search missing query (should fail)
  try {
    const res = await axios.get(`${API_URL}/movies/search`);
    logTest('GET /api/movies/search - Missing query (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('GET /api/movies/search - Missing query', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Popular movies
  try {
    const res = await axios.get(`${API_URL}/movies/popular`);
    logTest('GET /api/movies/popular', res.status === 200 && res.data.results?.length > 0, `Found ${res.data.results?.length || 0} movies`);
  } catch (error) {
    logTest('GET /api/movies/popular', false, error.message);
  }

  // Top rated movies
  try {
    const res = await axios.get(`${API_URL}/movies/top-rated`);
    logTest('GET /api/movies/top-rated', res.status === 200 && res.data.results?.length > 0, `Found ${res.data.results?.length || 0} movies`);
  } catch (error) {
    logTest('GET /api/movies/top-rated', false, error.message);
  }

  // Upcoming movies
  try {
    const res = await axios.get(`${API_URL}/movies/upcoming`);
    logTest('GET /api/movies/upcoming', res.status === 200 && res.data.results?.length > 0, `Found ${res.data.results?.length || 0} movies`);
  } catch (error) {
    logTest('GET /api/movies/upcoming', false, error.message);
  }

  // Movie details (guest mode - no auth)
  try {
    const res = await axios.get(`${API_URL}/movies/550`);
    logTest('GET /api/movies/:id - Guest mode', res.status === 200 && res.data.id === 550, `Movie: ${res.data.title}`);
  } catch (error) {
    logTest('GET /api/movies/:id - Guest mode', false, error.message);
  }

  // Movie details (authenticated mode)
  try {
    const res = await axios.get(`${API_URL}/movies/550`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const hasUserFields = 'userRating' in res.data && 'isFavorite' in res.data && 'isInWatchlist' in res.data;
    logTest('GET /api/movies/:id - Authenticated mode', res.status === 200 && hasUserFields, `Has user fields: ${hasUserFields}`);
  } catch (error) {
    logTest('GET /api/movies/:id - Authenticated mode', false, error.message);
  }

  // Movie details invalid ID (should fail)
  try {
    const res = await axios.get(`${API_URL}/movies/999999999`);
    logTest('GET /api/movies/:id - Invalid ID (should fail)', false, 'Should have returned 404');
  } catch (error) {
    logTest('GET /api/movies/:id - Invalid ID', error.response?.status === 404, `Status: ${error.response?.status}`);
  }
}

async function testUserEndpoints() {
  log('\n========================================', YELLOW);
  log('👤 USER ENDPOINTS (AUTHENTICATED)', YELLOW);
  log('========================================\n', YELLOW);

  const headers = { Authorization: `Bearer ${token}` };

  // Get profile
  try {
    const res = await axios.get(`${API_URL}/user/profile`, { headers });
    const passwordExcluded = !('password' in res.data);
    logTest('GET /api/user/profile', res.status === 200 && passwordExcluded, `Email: ${res.data.email}, Password excluded: ${passwordExcluded}`);
  } catch (error) {
    logTest('GET /api/user/profile', false, error.message);
  }

  // Get profile without auth (should fail)
  try {
    const res = await axios.get(`${API_URL}/user/profile`);
    logTest('GET /api/user/profile - No auth (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('GET /api/user/profile - No auth', error.response?.status === 401, `Status: ${error.response?.status}`);
  }

  // Get statistics (initial - empty)
  try {
    const res = await axios.get(`${API_URL}/user/statistics`, { headers });
    logTest('GET /api/user/statistics - Initial', res.status === 200, `Ratings: ${res.data.moviesRated}, Favorites: ${res.data.favoriteCount}, Watchlist: ${res.data.watchlistCount}`);
  } catch (error) {
    logTest('GET /api/user/statistics - Initial', false, error.message);
  }

  // Rate movie
  try {
    const res = await axios.post(`${API_URL}/user/rate`, {
      tmdbId: 550,
      rating: 9
    }, { headers });
    logTest('POST /api/user/rate', res.status === 200, 'Rated Fight Club 9/10');
  } catch (error) {
    logTest('POST /api/user/rate', false, error.message);
  }

  // Rate another movie
  try {
    const res = await axios.post(`${API_URL}/user/rate`, {
      tmdbId: 680,
      rating: 10
    }, { headers });
    logTest('POST /api/user/rate - Second movie', res.status === 200, 'Rated Pulp Fiction 10/10');
  } catch (error) {
    logTest('POST /api/user/rate - Second movie', false, error.message);
  }

  // Update existing rating
  try {
    const res = await axios.post(`${API_URL}/user/rate`, {
      tmdbId: 550,
      rating: 10
    }, { headers });
    logTest('POST /api/user/rate - Update rating', res.status === 200, 'Updated Fight Club to 10/10');
  } catch (error) {
    logTest('POST /api/user/rate - Update rating', false, error.message);
  }

  // Rate with invalid rating (should fail)
  try {
    const res = await axios.post(`${API_URL}/user/rate`, {
      tmdbId: 550,
      rating: 11
    }, { headers });
    logTest('POST /api/user/rate - Invalid rating (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('POST /api/user/rate - Invalid rating', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Rate without auth (should fail)
  try {
    const res = await axios.post(`${API_URL}/user/rate`, {
      tmdbId: 550,
      rating: 9
    });
    logTest('POST /api/user/rate - No auth (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('POST /api/user/rate - No auth', error.response?.status === 401, `Status: ${error.response?.status}`);
  }

  // Get user ratings
  try {
    const res = await axios.get(`${API_URL}/user/ratings`, { headers });
    logTest('GET /api/user/ratings', res.status === 200 && res.data.length === 2, `Found ${res.data.length} ratings`);
  } catch (error) {
    logTest('GET /api/user/ratings', false, error.message);
  }

  // Add to favorites
  try {
    const res = await axios.post(`${API_URL}/user/favorite`, {
      tmdbId: 550
    }, { headers });
    logTest('POST /api/user/favorite - Add', res.status === 200 && res.data.isFavorite === true, 'Added Fight Club to favorites');
  } catch (error) {
    logTest('POST /api/user/favorite - Add', false, error.message);
  }

  // Add another favorite
  try {
    const res = await axios.post(`${API_URL}/user/favorite`, {
      tmdbId: 680
    }, { headers });
    logTest('POST /api/user/favorite - Add second', res.status === 200, 'Added Pulp Fiction to favorites');
  } catch (error) {
    logTest('POST /api/user/favorite - Add second', false, error.message);
  }

  // Toggle favorite (remove)
  try {
    const res = await axios.post(`${API_URL}/user/favorite`, {
      tmdbId: 550
    }, { headers });
    logTest('POST /api/user/favorite - Remove (toggle)', res.status === 200 && res.data.isFavorite === false, 'Removed Fight Club from favorites');
  } catch (error) {
    logTest('POST /api/user/favorite - Remove (toggle)', false, error.message);
  }

  // Get favorites
  try {
    const res = await axios.get(`${API_URL}/user/favorites`, { headers });
    logTest('GET /api/user/favorites', res.status === 200 && res.data.length === 1, `Found ${res.data.length} favorite(s)`);
  } catch (error) {
    logTest('GET /api/user/favorites', false, error.message);
  }

  // Add to watchlist
  try {
    const res = await axios.post(`${API_URL}/user/watchlist`, {
      tmdbId: 13
    }, { headers });
    logTest('POST /api/user/watchlist - Add', res.status === 200 && res.data.isInWatchlist === true, 'Added Forrest Gump to watchlist');
  } catch (error) {
    logTest('POST /api/user/watchlist - Add', false, error.message);
  }

  // Toggle watchlist (remove)
  try {
    const res = await axios.post(`${API_URL}/user/watchlist`, {
      tmdbId: 13
    }, { headers });
    logTest('POST /api/user/watchlist - Remove (toggle)', res.status === 200 && res.data.isInWatchlist === false, 'Removed Forrest Gump from watchlist');
  } catch (error) {
    logTest('POST /api/user/watchlist - Remove (toggle)', false, error.message);
  }

  // Add back to watchlist
  try {
    const res = await axios.post(`${API_URL}/user/watchlist`, {
      tmdbId: 13
    }, { headers });
    logTest('POST /api/user/watchlist - Add again', res.status === 200, 'Added Forrest Gump back to watchlist');
  } catch (error) {
    logTest('POST /api/user/watchlist - Add again', false, error.message);
  }

  // Get watchlist
  try {
    const res = await axios.get(`${API_URL}/user/watchlist`, { headers });
    logTest('GET /api/user/watchlist', res.status === 200 && res.data.length === 1, `Found ${res.data.length} item(s)`);
  } catch (error) {
    logTest('GET /api/user/watchlist', false, error.message);
  }

  // Get statistics (after adding data)
  try {
    const res = await axios.get(`${API_URL}/user/statistics`, { headers });
    const hasData = res.data.moviesRated === 2 && res.data.favoriteCount === 1 && res.data.watchlistCount === 1;
    logTest('GET /api/user/statistics - After updates', res.status === 200 && hasData, `Ratings: ${res.data.moviesRated}, Avg: ${res.data.averageRating}, Favorites: ${res.data.favoriteCount}, Watchlist: ${res.data.watchlistCount}`);
  } catch (error) {
    logTest('GET /api/user/statistics - After updates', false, error.message);
  }

  // Clear all ratings
  try {
    const res = await axios.delete(`${API_URL}/user/ratings`, { headers });
    logTest('DELETE /api/user/ratings', res.status === 200, 'All ratings cleared');
  } catch (error) {
    logTest('DELETE /api/user/ratings', false, error.message);
  }

  // Verify ratings cleared
  try {
    const res = await axios.get(`${API_URL}/user/ratings`, { headers });
    logTest('GET /api/user/ratings - After clear', res.status === 200 && res.data.length === 0, `Ratings count: ${res.data.length}`);
  } catch (error) {
    logTest('GET /api/user/ratings - After clear', false, error.message);
  }

  // Clear all favorites
  try {
    const res = await axios.delete(`${API_URL}/user/favorites`, { headers });
    logTest('DELETE /api/user/favorites', res.status === 200, 'All favorites cleared');
  } catch (error) {
    logTest('DELETE /api/user/favorites', false, error.message);
  }

  // Clear all watchlist
  try {
    const res = await axios.delete(`${API_URL}/user/watchlist`, { headers });
    logTest('DELETE /api/user/watchlist', res.status === 200, 'All watchlist items cleared');
  } catch (error) {
    logTest('DELETE /api/user/watchlist', false, error.message);
  }

  // Final statistics check
  try {
    const res = await axios.get(`${API_URL}/user/statistics`, { headers });
    const allCleared = res.data.moviesRated === 0 && res.data.favoriteCount === 0 && res.data.watchlistCount === 0;
    logTest('GET /api/user/statistics - After clear all', res.status === 200 && allCleared, `All cleared: Ratings: ${res.data.moviesRated}, Favorites: ${res.data.favoriteCount}, Watchlist: ${res.data.watchlistCount}`);
  } catch (error) {
    logTest('GET /api/user/statistics - After clear all', false, error.message);
  }
}

async function testSocialEndpoints() {
  log('\n========================================', YELLOW);
  log('💬 SOCIAL ENDPOINTS (COMMENTS & FEED)', YELLOW);
  log('========================================\n', YELLOW);

  const headers = { Authorization: `Bearer ${token}` };
  const headers2 = { Authorization: `Bearer ${token2}` };

  // Add comment (authenticated)
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      tmdbId: 550,
      content: 'This is a great movie!'
    }, { headers });
    commentId = res.data._id;
    logTest('POST /api/comments', res.status === 201 && commentId, `Comment ID: ${commentId}`);
  } catch (error) {
    logTest('POST /api/comments', false, error.message);
  }

  // Add second comment by user 2
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      tmdbId: 550,
      content: 'I agree, amazing film!'
    }, { headers: headers2 });
    logTest('POST /api/comments - User 2', res.status === 201, `Comment by: ${res.data.userName}`);
  } catch (error) {
    logTest('POST /api/comments - User 2', false, error.message);
  }

  // Add comment without auth (should fail)
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      tmdbId: 550,
      content: 'Test comment'
    });
    logTest('POST /api/comments - No auth (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('POST /api/comments - No auth', error.response?.status === 401, `Status: ${error.response?.status}`);
  }

  // Add comment missing tmdbId (should fail)
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      content: 'Test comment'
    }, { headers });
    logTest('POST /api/comments - Missing tmdbId (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('POST /api/comments - Missing tmdbId', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Add comment missing content (should fail)
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      tmdbId: 550
    }, { headers });
    logTest('POST /api/comments - Missing content (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('POST /api/comments - Missing content', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Add comment with invalid tmdbId (should fail)
  try {
    const res = await axios.post(`${API_URL}/comments`, {
      tmdbId: 'invalid',
      content: 'Test'
    }, { headers });
    logTest('POST /api/comments - Invalid tmdbId (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('POST /api/comments - Invalid tmdbId', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Get movie comments (public)
  try {
    const res = await axios.get(`${API_URL}/comments/550`);
    logTest('GET /api/comments/:tmdbId - Public', res.status === 200 && res.data.length >= 2, `Found ${res.data.length} comments`);
  } catch (error) {
    logTest('GET /api/comments/:tmdbId - Public', false, error.message);
  }

  // Get comments with invalid tmdbId (should fail)
  try {
    const res = await axios.get(`${API_URL}/comments/invalid`);
    logTest('GET /api/comments/:tmdbId - Invalid ID (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('GET /api/comments/:tmdbId - Invalid ID', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Update comment (own comment)
  try {
    const res = await axios.put(`${API_URL}/comments/${commentId}`, {
      content: 'Updated comment: This movie is absolutely fantastic!'
    }, { headers });
    logTest('PUT /api/comments/:id - Own comment', res.status === 200, 'Comment updated successfully');
  } catch (error) {
    logTest('PUT /api/comments/:id - Own comment', false, error.message);
  }

  // Verify comment update
  try {
    const res = await axios.get(`${API_URL}/comments/550`);
    const updatedComment = res.data.find(c => c._id === commentId);
    const isUpdated = updatedComment?.content.includes('Updated comment');
    logTest('GET /api/comments/:tmdbId - Verify update', isUpdated, `Content updated: ${isUpdated}`);
  } catch (error) {
    logTest('GET /api/comments/:tmdbId - Verify update', false, error.message);
  }

  // Update comment without auth (should fail)
  try {
    const res = await axios.put(`${API_URL}/comments/${commentId}`, {
      content: 'Test'
    });
    logTest('PUT /api/comments/:id - No auth (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('PUT /api/comments/:id - No auth', error.response?.status === 401, `Status: ${error.response?.status}`);
  }

  // Update other user's comment (should fail)
  try {
    const res = await axios.put(`${API_URL}/comments/${commentId}`, {
      content: 'Trying to update other user comment'
    }, { headers: headers2 });
    logTest('PUT /api/comments/:id - Other user (should fail)', false, 'Should have returned 404');
  } catch (error) {
    logTest('PUT /api/comments/:id - Other user', error.response?.status === 404, `Status: ${error.response?.status}`);
  }

  // Update with invalid comment ID (should fail)
  try {
    const res = await axios.put(`${API_URL}/comments/invalid`, {
      content: 'Test'
    }, { headers });
    logTest('PUT /api/comments/:id - Invalid ID (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('PUT /api/comments/:id - Invalid ID', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Update missing content (should fail)
  try {
    const res = await axios.put(`${API_URL}/comments/${commentId}`, {}, { headers });
    logTest('PUT /api/comments/:id - Missing content (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('PUT /api/comments/:id - Missing content', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Get activity feed (public)
  try {
    const res = await axios.get(`${API_URL}/feed`);
    logTest('GET /api/feed - Public', res.status === 200 && res.data.items?.length >= 2, `Items: ${res.data.items?.length}, Page: ${res.data.page}`);
  } catch (error) {
    logTest('GET /api/feed - Public', false, error.message);
  }

  // Get feed with pagination
  try {
    const res = await axios.get(`${API_URL}/feed?page=1&limit=1`);
    logTest('GET /api/feed - Pagination', res.status === 200 && res.data.items?.length === 1, `Items: ${res.data.items?.length}, Limit: 1`);
  } catch (error) {
    logTest('GET /api/feed - Pagination', false, error.message);
  }

  // Delete comment without auth (should fail)
  try {
    const res = await axios.delete(`${API_URL}/comments/${commentId}`);
    logTest('DELETE /api/comments/:id - No auth (should fail)', false, 'Should have returned 401');
  } catch (error) {
    logTest('DELETE /api/comments/:id - No auth', error.response?.status === 401, `Status: ${error.response?.status}`);
  }

  // Delete other user's comment (should fail)
  try {
    const res = await axios.delete(`${API_URL}/comments/${commentId}`, { headers: headers2 });
    logTest('DELETE /api/comments/:id - Other user (should fail)', false, 'Should have returned 404');
  } catch (error) {
    logTest('DELETE /api/comments/:id - Other user', error.response?.status === 404, `Status: ${error.response?.status}`);
  }

  // Delete with invalid ID (should fail)
  try {
    const res = await axios.delete(`${API_URL}/comments/invalid`, { headers });
    logTest('DELETE /api/comments/:id - Invalid ID (should fail)', false, 'Should have returned 400');
  } catch (error) {
    logTest('DELETE /api/comments/:id - Invalid ID', error.response?.status === 400, `Status: ${error.response?.status}`);
  }

  // Delete comment (own comment)
  try {
    const res = await axios.delete(`${API_URL}/comments/${commentId}`, { headers });
    logTest('DELETE /api/comments/:id - Own comment', res.status === 200, 'Comment deleted successfully');
  } catch (error) {
    logTest('DELETE /api/comments/:id - Own comment', false, error.message);
  }

  // Verify deletion
  try {
    const res = await axios.get(`${API_URL}/comments/550`);
    const commentExists = res.data.some(c => c._id === commentId);
    logTest('GET /api/comments/:tmdbId - Verify deletion', !commentExists, `Comment still exists: ${commentExists}`);
  } catch (error) {
    logTest('GET /api/comments/:tmdbId - Verify deletion', false, error.message);
  }
}

async function runAllTests() {
  log('\n========================================', BLUE);
  log('🚀 COMPLETE API ENDPOINT TEST SUITE', BLUE);
  log('========================================\n', BLUE);
  log(`Testing all endpoints at: ${API_URL}`, BLUE);
  log(`Health check at: ${HEALTH_URL}\n`, BLUE);

  await testHealthCheck();
  await testAuthentication();
  await testMovieEndpoints();
  await testUserEndpoints();
  await testSocialEndpoints();

  // Final summary
  log('\n========================================', YELLOW);
  log('📊 FINAL TEST RESULTS', YELLOW);
  log('========================================\n', YELLOW);
  log(`Total Tests: ${totalTests}`);
  log(`✅ Passed: ${passedTests}`, GREEN);
  log(`❌ Failed: ${failedTests}`, failedTests > 0 ? RED : GREEN);
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`, failedTests > 0 ? RED : GREEN);
  log('========================================\n', YELLOW);

  if (failedTests === 0) {
    log('🎉 ALL TESTS PASSED! All endpoints working correctly.\n', GREEN);
  } else {
    log('⚠️  Some tests failed. Please review the errors above.\n', RED);
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run all tests
runAllTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, RED);
  process.exit(1);
});
