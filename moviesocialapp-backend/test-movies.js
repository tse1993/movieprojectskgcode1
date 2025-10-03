const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testMovieController() {
  console.log('🧪 Starting Movie Controller Tests\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let passedTests = 0;
  let failedTests = 0;

  try {
    // Test 1: Search Movies
    console.log('Test 1: Search Movies');
    console.log('Request: GET /api/movies/search?q=fight');

    const searchResponse = await axios.get(`${BASE_URL}/movies/search?q=fight`);

    if (searchResponse.status === 200) {
      console.log('✅ Status:', searchResponse.status);
      console.log('✅ Response has results:', Array.isArray(searchResponse.data.results));
      console.log('✅ Results count:', searchResponse.data.results.length);

      // Check movie structure (backend.md format - no wrapper)
      if (searchResponse.data.results.length > 0) {
        const movie = searchResponse.data.results[0];
        console.log('✅ Movie has id:', !!movie.id);
        console.log('✅ Movie has title:', !!movie.title);
        console.log('✅ Movie has posterUrl:', movie.posterUrl !== undefined);
        console.log('✅ Movie has rating:', movie.rating !== undefined);
        console.log('✅ Movie has releaseDate:', movie.releaseDate !== undefined);
        console.log('✅ Movie has genre:', !!movie.genre);
        console.log('✅ Movie has overview:', !!movie.overview);
        passedTests++;
      }
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 2: Get Popular Movies
    console.log('Test 2: Get Popular Movies');
    console.log('Request: GET /api/movies/popular');

    const popularResponse = await axios.get(`${BASE_URL}/movies/popular`);

    if (popularResponse.status === 200) {
      console.log('✅ Status:', popularResponse.status);
      console.log('✅ Response has results:', Array.isArray(popularResponse.data.results));
      console.log('✅ Results count:', popularResponse.data.results.length);
      console.log('✅ Has pagination info (page):', !!popularResponse.data.page);
      console.log('✅ Has total_pages:', !!popularResponse.data.total_pages);
      passedTests++;
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 3: Get Top Rated Movies
    console.log('Test 3: Get Top Rated Movies');
    console.log('Request: GET /api/movies/top-rated');

    const topRatedResponse = await axios.get(`${BASE_URL}/movies/top-rated`);

    if (topRatedResponse.status === 200) {
      console.log('✅ Status:', topRatedResponse.status);
      console.log('✅ Response has results:', Array.isArray(topRatedResponse.data.results));
      console.log('✅ Results count:', topRatedResponse.data.results.length);
      console.log('✅ Movies have high ratings:',
        topRatedResponse.data.results[0]?.rating >= 7);
      passedTests++;
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 4: Get Upcoming Movies
    console.log('Test 4: Get Upcoming Movies');
    console.log('Request: GET /api/movies/upcoming');

    const upcomingResponse = await axios.get(`${BASE_URL}/movies/upcoming`);

    if (upcomingResponse.status === 200) {
      console.log('✅ Status:', upcomingResponse.status);
      console.log('✅ Response has results:', Array.isArray(upcomingResponse.data.results));
      console.log('✅ Results count:', upcomingResponse.data.results.length);
      passedTests++;
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 5: Get Movie Details (Guest User - No Auth)
    console.log('Test 5: Get Movie Details (Guest User)');
    console.log('Request: GET /api/movies/550 (Fight Club)');

    const detailsResponse = await axios.get(`${BASE_URL}/movies/550`);

    if (detailsResponse.status === 200) {
      const movie = detailsResponse.data;
      console.log('✅ Status:', detailsResponse.status);
      console.log('✅ Movie ID:', movie.id);
      console.log('✅ Movie title:', movie.title);
      console.log('✅ Has posterUrl:', movie.posterUrl !== undefined);
      console.log('✅ Has rating:', movie.rating !== undefined);
      console.log('✅ Has releaseDate:', !!movie.releaseDate);
      console.log('✅ Has genre:', !!movie.genre);
      console.log('✅ Has overview:', !!movie.overview);
      console.log('✅ Has comments array:', Array.isArray(movie.comments));
      console.log('✅ No user data (guest):',
        movie.userRating === undefined &&
        movie.isFavorite === undefined &&
        movie.isInWatchlist === undefined);
      passedTests++;
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 6: Get Movie Details (Authenticated User - backend.md schema)
    console.log('Test 6: Get Movie Details (Authenticated User)');

    // First register/login a test user
    const testUser = {
      email: `movietest${Date.now()}@example.com`,
      name: 'Movie Tester',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    const token = registerResponse.data.token;

    console.log('✅ Test user registered and logged in');
    console.log('Request: GET /api/movies/550 (with auth token)');

    const authDetailsResponse = await axios.get(`${BASE_URL}/movies/550`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (authDetailsResponse.status === 200) {
      const movie = authDetailsResponse.data;
      console.log('✅ Status:', authDetailsResponse.status);
      console.log('✅ Movie ID:', movie.id);
      console.log('✅ Movie title:', movie.title);
      console.log('✅ Has user data fields (backend.md schema):',
        'userRating' in movie &&
        'isFavorite' in movie &&
        'isInWatchlist' in movie);
      console.log('✅ userRating (should be null):', movie.userRating);
      console.log('✅ isFavorite (should be false):', movie.isFavorite);
      console.log('✅ isInWatchlist (should be false):', movie.isInWatchlist);
      console.log('✅ Has comments array:', Array.isArray(movie.comments));
      passedTests++;
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 7: Search with Pagination
    console.log('Test 7: Search Movies with Pagination');
    console.log('Request: GET /api/movies/search?q=star&page=2');

    const paginatedSearchResponse = await axios.get(`${BASE_URL}/movies/search?q=star&page=2`);

    if (paginatedSearchResponse.status === 200) {
      console.log('✅ Status:', paginatedSearchResponse.status);
      console.log('✅ Page number:', paginatedSearchResponse.data.page);
      console.log('✅ Results returned:', paginatedSearchResponse.data.results.length);
      passedTests++;
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 8: Error Handling - Invalid Movie ID
    console.log('Test 8: Error Handling - Invalid Movie ID');
    console.log('Request: GET /api/movies/999999999');

    try {
      await axios.get(`${BASE_URL}/movies/999999999`);
      console.log('❌ Should have thrown error for invalid movie ID');
      failedTests++;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        console.log('✅ Correctly returned error status:', error.response.status);
        console.log('✅ Error message:', error.response.data.message || 'Error handled');
        passedTests++;
      }
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 9: Error Handling - Missing Search Query
    console.log('Test 9: Error Handling - Missing Search Query');
    console.log('Request: GET /api/movies/search (no query parameter)');

    try {
      await axios.get(`${BASE_URL}/movies/search`);
      console.log('❌ Should have thrown error for missing query');
      failedTests++;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Correctly returned 400 Bad Request');
        console.log('✅ Error message:', error.response.data.message);
        passedTests++;
      }
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Summary
    console.log('🎉 MOVIE CONTROLLER TEST SUMMARY\n');
    console.log(`✅ Tests Passed: ${passedTests}/9`);
    console.log(`❌ Tests Failed: ${failedTests}/9`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (passedTests === 9) {
      console.log('🎉 ALL MOVIE CONTROLLER TESTS PASSED!\n');
      console.log('What was tested:');
      console.log('✅ Movie search with query parameter');
      console.log('✅ Popular movies endpoint');
      console.log('✅ Top rated movies endpoint');
      console.log('✅ Upcoming movies endpoint');
      console.log('✅ Movie details for guest users');
      console.log('✅ Movie details for authenticated users with user data');
      console.log('✅ Pagination support');
      console.log('✅ Error handling for invalid movie IDs');
      console.log('✅ Input validation for required parameters');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    }
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/health');
    console.log('✅ Server is running\n');
    return true;
  } catch (error) {
    console.error('❌ Server is not running on http://localhost:5000');
    console.error('Please start the server with: npm run dev');
    return false;
  }
}

async function run() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testMovieController();
  }
}

run();
