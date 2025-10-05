require('dotenv').config();
const axios = require('axios');
const { connectDB, getDB } = require('./src/config/db');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Test movie data
const testMovies = [
  { tmdbId: 550, title: 'Fight Club', posterPath: '/path1.jpg', releaseDate: '1999-10-15' },
  { tmdbId: 155, title: 'The Dark Knight', posterPath: '/path2.jpg', releaseDate: '2008-07-18' },
  { tmdbId: 13, title: 'Forrest Gump', posterPath: '/path3.jpg', releaseDate: '1994-07-06' }
];

async function testUserController() {
  let db;
  let testUserId;
  let testToken;

  try {
    console.log('🔄 Testing User Controller (Ratings, Favorites, Watchlist)...\n');

    // Setup: Connect to database and create test user
    console.log('Setup: Preparing test environment');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await connectDB();
    db = getDB();

    // Create a test user
    testUserId = new ObjectId();
    await db.collection('users').insertOne({
      _id: testUserId,
      name: 'User Test User',
      email: 'usertest@example.com',
      password: 'hashed_password',
      createdAt: new Date()
    });

    // Generate auth token
    testToken = jwt.sign(
      { userId: testUserId.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Test user created');
    console.log('✅ Auth token generated\n');

    // ==========================================
    // RATINGS TESTS
    // ==========================================
    console.log('📊 RATINGS TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 1: Get empty ratings list
    console.log('Test 1: Get Empty Ratings List');
    try {
      const res = await axios.get(BASE_URL + '/user/ratings', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/ratings`);
      console.log(`   Status: ${res.status}, Ratings: ${res.data.length}`);
      if (res.data.length !== 0) {
        console.log('   ⚠️  Expected empty array');
      }
    } catch (err) {
      console.log(`❌ GET /user/ratings: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 2: Add first rating
    console.log('Test 2: Add Rating for Fight Club');
    try {
      const res = await axios.post(
        BASE_URL + '/user/ratings',
        {
          tmdbId: testMovies[0].tmdbId,
          rating: 9.5,
          review: 'Amazing movie! Mind-blowing plot twist.'
        },
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ POST /user/ratings`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Movie: ${testMovies[0].title}`);
      console.log(`   Rating: ${res.data.rating.rating}/10`);
      console.log(`   Review: "${res.data.rating.review}"`);
    } catch (err) {
      console.log(`❌ POST /user/ratings: ${err.response?.status || err.message}`);
      if (err.response?.data) console.log(`   ${err.response.data.message}`);
    }
    console.log('');

    // Test 3: Add more ratings
    console.log('Test 3: Add More Ratings');
    try {
      await axios.post(
        BASE_URL + '/user/ratings',
        { tmdbId: testMovies[1].tmdbId, rating: 10, review: 'Perfect superhero movie' },
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ Added rating for ${testMovies[1].title}: 10/10`);

      await axios.post(
        BASE_URL + '/user/ratings',
        { tmdbId: testMovies[2].tmdbId, rating: 8.5 },
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ Added rating for ${testMovies[2].title}: 8.5/10 (no review)`);
    } catch (err) {
      console.log(`❌ Error adding ratings: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 4: Update existing rating
    console.log('Test 4: Update Existing Rating');
    try {
      const res = await axios.post(
        BASE_URL + '/user/ratings',
        {
          tmdbId: testMovies[0].tmdbId,
          rating: 10,
          review: 'Changed my mind - this is a 10/10!'
        },
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ POST /user/ratings (update)`);
      console.log(`   Updated ${testMovies[0].title}`);
      console.log(`   New rating: ${res.data.rating.rating}/10`);
      console.log(`   New review: "${res.data.rating.review}"`);
    } catch (err) {
      console.log(`❌ Update rating failed: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 5: Get all ratings
    console.log('Test 5: Get All User Ratings');
    try {
      const res = await axios.get(BASE_URL + '/user/ratings', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/ratings`);
      console.log(`   Total ratings: ${res.data.length}`);
      res.data.forEach((r, i) => {
        console.log(`   ${i + 1}. Rating: ${r.rating}/10, Review: ${r.review ? '"' + r.review + '"' : 'None'}`);
      });
    } catch (err) {
      console.log(`❌ GET /user/ratings: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 6: Get specific rating
    console.log('Test 6: Get Rating for Specific Movie');
    try {
      const res = await axios.get(BASE_URL + `/user/ratings/${testMovies[1].tmdbId}`, {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/ratings/${testMovies[1].tmdbId}`);
      console.log(`   Movie ID: ${res.data.tmdbId}`);
      console.log(`   Rating: ${res.data.rating}/10`);
    } catch (err) {
      console.log(`❌ GET specific rating: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 7: Invalid rating value
    console.log('Test 7: Test Invalid Rating Values');
    try {
      await axios.post(
        BASE_URL + '/user/ratings',
        { tmdbId: 999, rating: 15 }, // Invalid: > 10
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log('❌ Should reject rating > 10');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Correctly rejects rating > 10 (400)');
      }
    }

    try {
      await axios.post(
        BASE_URL + '/user/ratings',
        { tmdbId: 999, rating: 0 }, // Invalid: < 1
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log('❌ Should reject rating < 1');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Correctly rejects rating < 1 (400)');
      }
    }
    console.log('');

    // ==========================================
    // FAVORITES TESTS
    // ==========================================
    console.log('⭐ FAVORITES TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 8: Get empty favorites
    console.log('Test 8: Get Empty Favorites List');
    try {
      const res = await axios.get(BASE_URL + '/user/favorites', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/favorites`);
      console.log(`   Status: ${res.status}, Favorites: ${res.data.length}`);
    } catch (err) {
      console.log(`❌ GET /user/favorites: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 9: Add to favorites
    console.log('Test 9: Add Movies to Favorites');
    for (let i = 0; i < 2; i++) {
      try {
        const res = await axios.post(
          BASE_URL + '/user/favorites',
          testMovies[i],
          { headers: { Authorization: `Bearer ${testToken}` } }
        );
        console.log(`✅ Added "${testMovies[i].title}" to favorites`);
      } catch (err) {
        console.log(`❌ Add to favorites failed: ${err.response?.status || err.message}`);
      }
    }
    console.log('');

    // Test 10: Try to add duplicate
    console.log('Test 10: Try Adding Duplicate to Favorites');
    try {
      await axios.post(
        BASE_URL + '/user/favorites',
        testMovies[0],
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log('❌ Should reject duplicate favorite');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Correctly rejects duplicate (400)');
        console.log(`   Message: "${err.response.data.message}"`);
      }
    }
    console.log('');

    // Test 11: Get all favorites
    console.log('Test 11: Get All Favorites');
    try {
      const res = await axios.get(BASE_URL + '/user/favorites', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/favorites`);
      console.log(`   Total favorites: ${res.data.length}`);
      res.data.forEach((f, i) => {
        console.log(`   ${i + 1}. ${f.title} (${f.releaseDate})`);
      });
    } catch (err) {
      console.log(`❌ GET /user/favorites: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 12: Check if movie is favorite
    console.log('Test 12: Check if Movie is Favorite');
    try {
      const res1 = await axios.get(BASE_URL + `/user/favorites/${testMovies[0].tmdbId}`, {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ ${testMovies[0].title}: isFavorite = ${res1.data.isFavorite}`);

      const res2 = await axios.get(BASE_URL + `/user/favorites/${testMovies[2].tmdbId}`, {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ ${testMovies[2].title}: isFavorite = ${res2.data.isFavorite}`);
    } catch (err) {
      console.log(`❌ Check favorite: ${err.response?.status || err.message}`);
    }
    console.log('');

    // ==========================================
    // WATCHLIST TESTS
    // ==========================================
    console.log('📺 WATCHLIST TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 13: Get empty watchlist
    console.log('Test 13: Get Empty Watchlist');
    try {
      const res = await axios.get(BASE_URL + '/user/watchlist', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/watchlist`);
      console.log(`   Status: ${res.status}, Items: ${res.data.length}`);
    } catch (err) {
      console.log(`❌ GET /user/watchlist: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 14: Add to watchlist
    console.log('Test 14: Add Movies to Watchlist');
    for (const movie of testMovies) {
      try {
        await axios.post(
          BASE_URL + '/user/watchlist',
          movie,
          { headers: { Authorization: `Bearer ${testToken}` } }
        );
        console.log(`✅ Added "${movie.title}" to watchlist`);
      } catch (err) {
        console.log(`❌ Add to watchlist failed: ${err.response?.status || err.message}`);
      }
    }
    console.log('');

    // Test 15: Get all watchlist
    console.log('Test 15: Get All Watchlist Items');
    try {
      const res = await axios.get(BASE_URL + '/user/watchlist', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/watchlist`);
      console.log(`   Total items: ${res.data.length}`);
      res.data.forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.title}`);
      });
    } catch (err) {
      console.log(`❌ GET /user/watchlist: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 16: Check if in watchlist
    console.log('Test 16: Check if Movie is in Watchlist');
    try {
      const res = await axios.get(BASE_URL + `/user/watchlist/${testMovies[1].tmdbId}`, {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ ${testMovies[1].title}: isInWatchlist = ${res.data.isInWatchlist}`);
    } catch (err) {
      console.log(`❌ Check watchlist: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 17: Remove from watchlist
    console.log('Test 17: Remove from Watchlist');
    try {
      const res = await axios.delete(
        BASE_URL + `/user/watchlist/${testMovies[0].tmdbId}`,
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ Removed "${testMovies[0].title}" from watchlist`);
      console.log(`   Message: ${res.data.message}`);
    } catch (err) {
      console.log(`❌ Remove from watchlist: ${err.response?.status || err.message}`);
    }
    console.log('');

    // ==========================================
    // USER STATISTICS
    // ==========================================
    console.log('📈 USER STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 18: Get user stats
    console.log('Test 18: Get User Statistics');
    try {
      const res = await axios.get(BASE_URL + '/user/stats', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log(`✅ GET /user/stats`);
      console.log(`   📊 Total Ratings: ${res.data.ratingsCount}`);
      console.log(`   ⭐ Total Favorites: ${res.data.favoritesCount}`);
      console.log(`   📺 Total Watchlist: ${res.data.watchlistCount}`);
      console.log(`   📈 Average Rating: ${res.data.averageRating.toFixed(2)}/10`);
    } catch (err) {
      console.log(`❌ GET /user/stats: ${err.response?.status || err.message}`);
    }
    console.log('');

    // ==========================================
    // DELETE OPERATIONS
    // ==========================================
    console.log('🗑️  DELETE OPERATIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 19: Delete rating
    console.log('Test 19: Delete a Rating');
    try {
      const res = await axios.delete(
        BASE_URL + `/user/ratings/${testMovies[2].tmdbId}`,
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ Deleted rating for ${testMovies[2].title}`);
      console.log(`   Message: ${res.data.message}`);
    } catch (err) {
      console.log(`❌ Delete rating: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 20: Delete favorite
    console.log('Test 20: Delete from Favorites');
    try {
      const res = await axios.delete(
        BASE_URL + `/user/favorites/${testMovies[1].tmdbId}`,
        { headers: { Authorization: `Bearer ${testToken}` } }
      );
      console.log(`✅ Removed ${testMovies[1].title} from favorites`);
    } catch (err) {
      console.log(`❌ Delete favorite: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 21: Verify deletions
    console.log('Test 21: Verify Deletions in Database');
    try {
      const rating = await db.collection('ratings').findOne({
        userId: new ObjectId(testUserId),
        tmdbId: testMovies[2].tmdbId
      });
      if (!rating) {
        console.log('✅ Rating successfully deleted from database');
      } else {
        console.log('❌ Rating still exists in database');
      }

      const favorite = await db.collection('favorites').findOne({
        userId: new ObjectId(testUserId),
        tmdbId: testMovies[1].tmdbId
      });
      if (!favorite) {
        console.log('✅ Favorite successfully deleted from database');
      } else {
        console.log('❌ Favorite still exists in database');
      }
    } catch (err) {
      console.log(`❌ Database verification failed: ${err.message}`);
    }
    console.log('');

    // ==========================================
    // AUTHENTICATION TESTS
    // ==========================================
    console.log('🔒 AUTHENTICATION TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 22: Access without token
    console.log('Test 22: Access Without Authentication');
    const protectedEndpoints = [
      '/user/ratings',
      '/user/favorites',
      '/user/watchlist',
      '/user/stats'
    ];

    for (const endpoint of protectedEndpoints) {
      try {
        await axios.get(BASE_URL + endpoint);
        console.log(`❌ ${endpoint}: Should require authentication`);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log(`✅ ${endpoint}: Correctly requires auth (401)`);
        } else {
          console.log(`⚠️  ${endpoint}: Unexpected status ${err.response?.status}`);
        }
      }
    }
    console.log('');

    // ==========================================
    // FINAL STATS
    // ==========================================
    console.log('📊 FINAL STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const res = await axios.get(BASE_URL + '/user/stats', {
        headers: { Authorization: `Bearer ${testToken}` }
      });
      console.log('Final user statistics:');
      console.log(`  Ratings: ${res.data.ratingsCount}`);
      console.log(`  Favorites: ${res.data.favoritesCount}`);
      console.log(`  Watchlist: ${res.data.watchlistCount}`);
      console.log(`  Avg Rating: ${res.data.averageRating.toFixed(2)}/10`);
    } catch (err) {
      console.log('Could not fetch final stats');
    }
    console.log('');

    // ==========================================
    // CLEANUP
    // ==========================================
    console.log('Cleanup: Removing test data');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await db.collection('users').deleteOne({ _id: testUserId });
    await db.collection('ratings').deleteMany({ userId: testUserId });
    await db.collection('favorites').deleteMany({ userId: testUserId });
    await db.collection('watchlist').deleteMany({ userId: testUserId });
    console.log('✅ All test data removed');
    console.log('');

    console.log('✅ All User Controller tests completed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ User Controller test failed:', error.message);
    
    // Cleanup on error
    if (db && testUserId) {
      try {
        await db.collection('users').deleteOne({ _id: testUserId });
        await db.collection('ratings').deleteMany({ userId: testUserId });
        await db.collection('favorites').deleteMany({ userId: testUserId });
        await db.collection('watchlist').deleteMany({ userId: testUserId });
        console.log('✅ Cleaned up test data');
      } catch (cleanupErr) {
        console.error('⚠️  Cleanup failed:', cleanupErr.message);
      }
    }
    
    process.exit(1);
  }
}

testUserController();