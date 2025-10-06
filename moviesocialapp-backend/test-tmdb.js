require('dotenv').config();
const tmdbApi = require('./src/utils/tmdbApi');

async function testTMDB() {
  try {
    console.log('🎬 Testing TMDB API...\n');
    console.log('API Key exists:', !!process.env.TMDB_API_KEY);
    console.log('');

    // Test 1: Get Popular Movies
    console.log('Test 1: Get Popular Movies');
    const popular = await tmdbApi.getPopularMovies(1);
    console.log('✅ Popular movies fetched:', popular.results.length, 'movies');
    console.log('Sample:', popular.results[0].title);
    console.log('');

    // Test 2: Search Movies
    console.log('Test 2: Search Movies');
    const search = await tmdbApi.searchMovies('Inception');
    console.log('✅ Search results:', search.results.length, 'movies');
    if (search.results.length > 0) {
      console.log('First result:', search.results[0].title);
    }
    console.log('');

    // Test 3: Get Top Rated Movies
    console.log('Test 3: Get Top Rated Movies');
    const topRated = await tmdbApi.getTopRatedMovies(1);
    console.log('✅ Top rated movies fetched:', topRated.results.length, 'movies');
    console.log('Sample:', topRated.results[0].title);
    console.log('');

    // Test 4: Get Upcoming Movies
    console.log('Test 4: Get Upcoming Movies');
    const upcoming = await tmdbApi.getUpcomingMovies(1);
    console.log('✅ Upcoming movies fetched:', upcoming.results.length, 'movies');
    console.log('Sample:', upcoming.results[0].title);
    console.log('');

    // Test 5: Get Movie Details
    console.log('Test 5: Get Movie Details');
    const movieId = popular.results[0].id;
    const details = await tmdbApi.getMovieDetails(movieId);
    console.log('✅ Movie details fetched');
    console.log('Title:', details.title);
    console.log('Rating:', details.rating);
    console.log('Release Date:', details.releaseDate);
    console.log('Genre:', details.genre);
    console.log('');

    console.log('✅ All TMDB API tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ TMDB API test failed:', error.message);
    console.error('Error details:', error.response?.data || error);
    process.exit(1);
  }
}

testTMDB();
