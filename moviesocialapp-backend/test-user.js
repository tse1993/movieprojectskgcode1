require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let userId = null;

// Test configuration
const testMovie1 = { tmdbId: 550, title: 'Fight Club' }; // Fight Club
const testMovie2 = { tmdbId: 680, title: 'Pulp Fiction' }; // Pulp Fiction
const testMovie3 = { tmdbId: 13, title: 'Forrest Gump' }; // Forrest Gump

const testUser = {
  email: `test-user-${Date.now()}@example.com`,
  name: 'User Test',
  password: 'password123'
};

// Helper function to print test results
function printResult(testName, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${testName}`);
  if (details) console.log(`   ${details}`);
}

// Test 1: Register test user
async function testRegisterUser() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    authToken = response.data.token;
    userId = response.data.user.id;

    printResult('User registration',
      response.status === 201 && authToken,
      `Token received, User ID: ${userId}`
    );
    return true;
  } catch (error) {
    printResult('User registration', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 2: Get user profile
async function testGetProfile() {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.email === testUser.email &&
                   response.data.name === testUser.name &&
                   !response.data.password &&
                   Array.isArray(response.data.favorites) &&
                   Array.isArray(response.data.watchlist) &&
                   Array.isArray(response.data.ratings);

    printResult('Get user profile', passed,
      `Email: ${response.data.email}, Name: ${response.data.name}, Password excluded: ${!response.data.password}`
    );
    return passed;
  } catch (error) {
    printResult('Get user profile', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Get profile without auth (should fail)
async function testGetProfileNoAuth() {
  try {
    await axios.get(`${BASE_URL}/user/profile`);
    printResult('Get profile without auth (should fail)', false, 'Should require authentication');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    printResult('Get profile without auth (should fail)', passed,
      `Expected 401, got ${error.response?.status}`
    );
    return passed;
  }
}

// Test 4: Rate a movie
async function testRateMovie() {
  try {
    const response = await axios.post(`${BASE_URL}/user/rate`, {
      tmdbId: testMovie1.tmdbId,
      rating: 9
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.message === 'Rating saved successfully';

    printResult('Rate movie', passed,
      `Rated ${testMovie1.title} with 9/10`
    );
    return passed;
  } catch (error) {
    printResult('Rate movie', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 5: Rate multiple movies
async function testRateMultipleMovies() {
  try {
    await axios.post(`${BASE_URL}/user/rate`, {
      tmdbId: testMovie2.tmdbId,
      rating: 10
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    await axios.post(`${BASE_URL}/user/rate`, {
      tmdbId: testMovie3.tmdbId,
      rating: 8
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    printResult('Rate multiple movies', true,
      `Rated ${testMovie2.title} (10/10) and ${testMovie3.title} (8/10)`
    );
    return true;
  } catch (error) {
    printResult('Rate multiple movies', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 6: Update existing rating
async function testUpdateRating() {
  try {
    const response = await axios.post(`${BASE_URL}/user/rate`, {
      tmdbId: testMovie1.tmdbId,
      rating: 10  // Changed from 9 to 10
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200;
    printResult('Update existing rating', passed,
      `Updated ${testMovie1.title} rating from 9 to 10`
    );
    return passed;
  } catch (error) {
    printResult('Update existing rating', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 7: Rate with invalid rating (should fail)
async function testInvalidRating() {
  try {
    await axios.post(`${BASE_URL}/user/rate`, {
      tmdbId: testMovie1.tmdbId,
      rating: 11  // Invalid: out of range
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Invalid rating (should fail)', false, 'Should reject rating > 10');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Invalid rating (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 8: Get user ratings
async function testGetRatings() {
  try {
    const response = await axios.get(`${BASE_URL}/user/ratings`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length === 3 &&
                   response.data.every(r => r.tmdbId && r.rating && r.ratedAt);

    printResult('Get user ratings', passed,
      `Found ${response.data.length} ratings${response.data.length > 0 ? ': ' + response.data.map(r => `${r.movie?.title || r.tmdbId} (${r.rating}/10)`).join(', ') : ''}`
    );
    return passed;
  } catch (error) {
    printResult('Get user ratings', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 9: Toggle favorite (add)
async function testAddFavorite() {
  try {
    const response = await axios.post(`${BASE_URL}/user/favorite`, {
      tmdbId: testMovie1.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.isFavorite === true;

    printResult('Add to favorites', passed,
      `Added ${testMovie1.title} to favorites`
    );
    return passed;
  } catch (error) {
    printResult('Add to favorites', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 10: Toggle favorite (remove)
async function testRemoveFavorite() {
  try {
    const response = await axios.post(`${BASE_URL}/user/favorite`, {
      tmdbId: testMovie1.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.isFavorite === false;

    printResult('Remove from favorites', passed,
      `Removed ${testMovie1.title} from favorites`
    );
    return passed;
  } catch (error) {
    printResult('Remove from favorites', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 11: Add multiple favorites
async function testAddMultipleFavorites() {
  try {
    await axios.post(`${BASE_URL}/user/favorite`, {
      tmdbId: testMovie1.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    await axios.post(`${BASE_URL}/user/favorite`, {
      tmdbId: testMovie2.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    printResult('Add multiple favorites', true,
      `Added ${testMovie1.title} and ${testMovie2.title} to favorites`
    );
    return true;
  } catch (error) {
    printResult('Add multiple favorites', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 12: Get favorites
async function testGetFavorites() {
  try {
    const response = await axios.get(`${BASE_URL}/user/favorites`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length === 2 &&
                   response.data.every(m => m.id && m.title);

    printResult('Get favorites', passed,
      `Found ${response.data.length} favorites${response.data.length > 0 ? ': ' + response.data.map(m => m.title).join(', ') : ''}`
    );
    return passed;
  } catch (error) {
    printResult('Get favorites', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 13: Add to watchlist
async function testAddToWatchlist() {
  try {
    const response = await axios.post(`${BASE_URL}/user/watchlist`, {
      tmdbId: testMovie3.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.isInWatchlist === true;

    printResult('Add to watchlist', passed,
      `Added ${testMovie3.title} to watchlist`
    );
    return passed;
  } catch (error) {
    printResult('Add to watchlist', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 14: Remove from watchlist
async function testRemoveFromWatchlist() {
  try {
    const response = await axios.post(`${BASE_URL}/user/watchlist`, {
      tmdbId: testMovie3.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.isInWatchlist === false;

    printResult('Remove from watchlist', passed,
      `Removed ${testMovie3.title} from watchlist`
    );
    return passed;
  } catch (error) {
    printResult('Remove from watchlist', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 15: Add multiple to watchlist
async function testAddMultipleWatchlist() {
  try {
    await axios.post(`${BASE_URL}/user/watchlist`, {
      tmdbId: testMovie2.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    await axios.post(`${BASE_URL}/user/watchlist`, {
      tmdbId: testMovie3.tmdbId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    printResult('Add multiple to watchlist', true,
      `Added ${testMovie2.title} and ${testMovie3.title} to watchlist`
    );
    return true;
  } catch (error) {
    printResult('Add multiple to watchlist', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 16: Get watchlist
async function testGetWatchlist() {
  try {
    const response = await axios.get(`${BASE_URL}/user/watchlist`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length === 2 &&
                   response.data.every(m => m.id && m.title);

    printResult('Get watchlist', passed,
      `Found ${response.data.length} items${response.data.length > 0 ? ': ' + response.data.map(m => m.title).join(', ') : ''}`
    );
    return passed;
  } catch (error) {
    printResult('Get watchlist', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 17: Get user statistics
async function testGetStatistics() {
  try {
    const response = await axios.get(`${BASE_URL}/user/statistics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.moviesRated === 3 &&
                   response.data.favoriteCount === 2 &&
                   response.data.watchlistCount === 2 &&
                   response.data.averageRating > 0 &&
                   response.data.memberSince;

    printResult('Get user statistics', passed,
      `Ratings: ${response.data.moviesRated}, Avg: ${response.data.averageRating.toFixed(1)}, Favorites: ${response.data.favoriteCount}, Watchlist: ${response.data.watchlistCount}`
    );
    return passed;
  } catch (error) {
    printResult('Get user statistics', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 18: Clear all ratings
async function testClearRatings() {
  try {
    const response = await axios.delete(`${BASE_URL}/user/ratings`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200;
    printResult('Clear all ratings', passed, 'All ratings cleared');
    return passed;
  } catch (error) {
    printResult('Clear all ratings', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 19: Verify ratings cleared
async function testVerifyRatingsCleared() {
  try {
    const response = await axios.get(`${BASE_URL}/user/ratings`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length === 0;

    printResult('Verify ratings cleared', passed,
      `Ratings count: ${response.data.length}`
    );
    return passed;
  } catch (error) {
    printResult('Verify ratings cleared', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 20: Clear all favorites
async function testClearFavorites() {
  try {
    const response = await axios.delete(`${BASE_URL}/user/favorites`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200;
    printResult('Clear all favorites', passed, 'All favorites cleared');
    return passed;
  } catch (error) {
    printResult('Clear all favorites', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 21: Verify favorites cleared
async function testVerifyFavoritesCleared() {
  try {
    const response = await axios.get(`${BASE_URL}/user/favorites`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length === 0;

    printResult('Verify favorites cleared', passed,
      `Favorites count: ${response.data.length}`
    );
    return passed;
  } catch (error) {
    printResult('Verify favorites cleared', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 22: Clear all watchlist
async function testClearWatchlist() {
  try {
    const response = await axios.delete(`${BASE_URL}/user/watchlist`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200;
    printResult('Clear all watchlist', passed, 'All watchlist items cleared');
    return passed;
  } catch (error) {
    printResult('Clear all watchlist', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 23: Verify watchlist cleared
async function testVerifyWatchlistCleared() {
  try {
    const response = await axios.get(`${BASE_URL}/user/watchlist`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length === 0;

    printResult('Verify watchlist cleared', passed,
      `Watchlist count: ${response.data.length}`
    );
    return passed;
  } catch (error) {
    printResult('Verify watchlist cleared', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 24: Final statistics check
async function testFinalStatistics() {
  try {
    const response = await axios.get(`${BASE_URL}/user/statistics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.moviesRated === 0 &&
                   response.data.favoriteCount === 0 &&
                   response.data.watchlistCount === 0;

    printResult('Final statistics check', passed,
      `All cleared: Ratings: ${response.data.moviesRated}, Favorites: ${response.data.favoriteCount}, Watchlist: ${response.data.watchlistCount}`
    );
    return passed;
  } catch (error) {
    printResult('Final statistics check', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n========================================');
  console.log('🧪 USER CONTROLLER TEST SUITE');
  console.log('========================================\n');
  console.log('Testing Phase 5: User Features Implementation');
  console.log('Controller: userController.js');
  console.log('Routes: profile, statistics, ratings, favorites, watchlist\n');
  console.log('========================================\n');

  const tests = [
    { name: 'Setup', fn: testRegisterUser },
    { name: 'Profile - Get', fn: testGetProfile },
    { name: 'Profile - Get (No Auth)', fn: testGetProfileNoAuth },
    { name: 'Ratings - Rate Movie', fn: testRateMovie },
    { name: 'Ratings - Rate Multiple', fn: testRateMultipleMovies },
    { name: 'Ratings - Update Existing', fn: testUpdateRating },
    { name: 'Ratings - Invalid Rating', fn: testInvalidRating },
    { name: 'Ratings - Get All', fn: testGetRatings },
    { name: 'Favorites - Add', fn: testAddFavorite },
    { name: 'Favorites - Remove (Toggle)', fn: testRemoveFavorite },
    { name: 'Favorites - Add Multiple', fn: testAddMultipleFavorites },
    { name: 'Favorites - Get All', fn: testGetFavorites },
    { name: 'Watchlist - Add', fn: testAddToWatchlist },
    { name: 'Watchlist - Remove (Toggle)', fn: testRemoveFromWatchlist },
    { name: 'Watchlist - Add Multiple', fn: testAddMultipleWatchlist },
    { name: 'Watchlist - Get All', fn: testGetWatchlist },
    { name: 'Statistics - Get', fn: testGetStatistics },
    { name: 'Ratings - Clear All', fn: testClearRatings },
    { name: 'Ratings - Verify Cleared', fn: testVerifyRatingsCleared },
    { name: 'Favorites - Clear All', fn: testClearFavorites },
    { name: 'Favorites - Verify Cleared', fn: testVerifyFavoritesCleared },
    { name: 'Watchlist - Clear All', fn: testClearWatchlist },
    { name: 'Watchlist - Verify Cleared', fn: testVerifyWatchlistCleared },
    { name: 'Statistics - Final Check', fn: testFinalStatistics }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n========================================');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('========================================');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(2)}%`);
  console.log('========================================\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! User Controller is working correctly.\n');
    console.log('✅ Phase 5 Implementation: COMPLETE');
    console.log('✅ Matches backend.md specification');
    console.log('✅ Embedded arrays pattern working');
    console.log('✅ Profile & Statistics working');
    console.log('✅ Ratings CRUD working');
    console.log('✅ Favorites toggle working');
    console.log('✅ Watchlist toggle working');
    console.log('✅ Clear all operations working\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.\n');
  }

  process.exit(failed === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Fatal error running tests:', error);
  process.exit(1);
});
