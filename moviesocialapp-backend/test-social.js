require('dotenv').config();
const axios = require('axios');
const { connectDB, getDB } = require('./src/config/db');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function testSocialController() {
  let db;
  let testUserId1;
  let testUserId2;
  let testToken1;
  let testToken2;
  let testCommentId;
  const testTmdbId = 550; // Fight Club

  try {
    console.log('🔄 Testing Social Controller (Comments & Feed)...\n');

    // Setup: Connect to database and create test users
    console.log('Setup: Preparing test environment');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await connectDB();
    db = getDB();

    // Create two test users (to test ownership)
    testUserId1 = new ObjectId();
    testUserId2 = new ObjectId();

    await db.collection('users').insertMany([
      {
        _id: testUserId1,
        name: 'Social Test User 1',
        email: 'social1@example.com',
        password: 'hashed_password',
        createdAt: new Date()
      },
      {
        _id: testUserId2,
        name: 'Social Test User 2',
        email: 'social2@example.com',
        password: 'hashed_password',
        createdAt: new Date()
      }
    ]);

    // Generate auth tokens
    testToken1 = jwt.sign(
      { userId: testUserId1.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    testToken2 = jwt.sign(
      { userId: testUserId2.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Test users created');
    console.log('✅ Auth tokens generated\n');

    // ==========================================
    // COMMENTS TESTS
    // ==========================================
    console.log('💬 COMMENTS TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 1: Get empty comments
    console.log('Test 1: Get Empty Comments for Movie');
    try {
      const res = await axios.get(BASE_URL + `/comments/${testTmdbId}`);
      console.log(`✅ GET /comments/${testTmdbId}`);
      console.log(`   Status: ${res.status}, Comments: ${res.data.length}`);
      if (res.data.length !== 0) {
        console.log('   ⚠️  Expected empty array');
      }
    } catch (err) {
      console.log(`❌ GET /comments/${testTmdbId}: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 2: Add comment without auth (should fail)
    console.log('Test 2: Try Adding Comment Without Auth');
    try {
      await axios.post(BASE_URL + '/comments', {
        tmdbId: testTmdbId,
        content: 'This should fail'
      });
      console.log('❌ Should require authentication');
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('✅ Correctly requires authentication (401)');
      } else {
        console.log(`⚠️  Unexpected status: ${err.response?.status}`);
      }
    }
    console.log('');

    // Test 3: Add first comment
    console.log('Test 3: Add First Comment (User 1)');
    try {
      const res = await axios.post(
        BASE_URL + '/comments',
        {
          tmdbId: testTmdbId,
          content: 'First comment from user 1'
        },
        { headers: { Authorization: `Bearer ${testToken1}` } }
      );
      testCommentId = res.data._id;
      console.log(`✅ POST /comments`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Comment ID: ${testCommentId}`);
      console.log(`   User: ${res.data.userName}`);
      console.log(`   Content: "${res.data.content}"`);
    } catch (err) {
      console.log(`❌ POST /comments: ${err.response?.status || err.message}`);
      if (err.response?.data) {
        console.log(`   Message: ${err.response.data.message}`);
      }
    }
    console.log('');

    // Test 4: Add more comments
    console.log('Test 4: Add More Comments');
    try {
      await axios.post(
        BASE_URL + '/comments',
        { tmdbId: testTmdbId, content: 'Second comment from user 1' },
        { headers: { Authorization: `Bearer ${testToken1}` } }
      );
      console.log('✅ Added second comment from User 1');

      await axios.post(
        BASE_URL + '/comments',
        { tmdbId: testTmdbId, content: 'Comment from user 2' },
        { headers: { Authorization: `Bearer ${testToken2}` } }
      );
      console.log('✅ Added comment from User 2');
    } catch (err) {
      console.log(`❌ Error adding comments: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 5: Get all comments
    console.log('Test 5: Get All Comments for Movie');
    try {
      const res = await axios.get(BASE_URL + `/comments/${testTmdbId}`);
      console.log(`✅ GET /comments/${testTmdbId}`);
      console.log(`   Total comments: ${res.data.length}`);
      res.data.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.userName}: "${c.content}"`);
      });
    } catch (err) {
      console.log(`❌ GET /comments: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 6: Validate comment data
    console.log('Test 6: Validate Comment in Database');
    if (testCommentId) {
      try {
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(testCommentId) });
        if (comment) {
          console.log('✅ Comment found in database');
          console.log(`   tmdbId: ${comment.tmdbId} (type: ${typeof comment.tmdbId})`);
          console.log(`   userId: ${comment.userId} (type: ${comment.userId.constructor.name})`);
          console.log(`   userName: ${comment.userName}`);
          console.log(`   Has createdAt: ${!!comment.createdAt}`);
          console.log(`   Has updatedAt: ${!!comment.updatedAt}`);
        } else {
          console.log('❌ Comment not found in database');
        }
      } catch (err) {
        console.log(`❌ Database query error: ${err.message}`);
      }
    }
    console.log('');

    // Test 7: Update own comment
    console.log('Test 7: Update Own Comment');
    if (testCommentId) {
      try {
        const res = await axios.put(
          BASE_URL + `/comments/${testCommentId}`,
          { content: 'Updated comment text' },
          { headers: { Authorization: `Bearer ${testToken1}` } }
        );
        console.log(`✅ PUT /comments/${testCommentId}`);
        console.log(`   Status: ${res.status}`);
        console.log(`   Message: ${res.data.message}`);
      } catch (err) {
        console.log(`❌ PUT /comments: ${err.response?.status || err.message}`);
        if (err.response?.data) {
          console.log(`   Error: ${err.response.data.message}`);
        }
      }
    }
    console.log('');

    // Test 8: Verify update
    console.log('Test 8: Verify Comment Was Updated');
    if (testCommentId) {
      try {
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(testCommentId) });
        if (comment && comment.content === 'Updated comment text') {
          console.log('✅ Comment successfully updated in database');
          console.log(`   New content: "${comment.content}"`);
        } else {
          console.log('❌ Comment not updated correctly');
        }
      } catch (err) {
        console.log(`❌ Database verification failed: ${err.message}`);
      }
    }
    console.log('');

    // Test 9: Try to update another user's comment (should fail)
    console.log('Test 9: Try Updating Another User\'s Comment');
    if (testCommentId) {
      try {
        await axios.put(
          BASE_URL + `/comments/${testCommentId}`,
          { content: 'Trying to hack' },
          { headers: { Authorization: `Bearer ${testToken2}` } }
        );
        console.log('❌ Should not allow updating another user\'s comment');
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('✅ Correctly prevents updating another user\'s comment (404)');
        } else {
          console.log(`⚠️  Unexpected status: ${err.response?.status}`);
        }
      }
    }
    console.log('');

    // Test 10: Invalid comment validations
    console.log('Test 10: Test Invalid Comment Data');
    
    // Empty content
    try {
      await axios.post(
        BASE_URL + '/comments',
        { tmdbId: testTmdbId, content: '   ' },
        { headers: { Authorization: `Bearer ${testToken1}` } }
      );
      console.log('❌ Should reject empty content');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Correctly rejects empty content (400)');
      }
    }

    // Invalid tmdbId
    try {
      await axios.post(
        BASE_URL + '/comments',
        { tmdbId: 'invalid', content: 'Test' },
        { headers: { Authorization: `Bearer ${testToken1}` } }
      );
      console.log('❌ Should reject invalid tmdbId');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Correctly rejects invalid tmdbId (400)');
      }
    }

    // Invalid comment ID for update
    try {
      await axios.put(
        BASE_URL + '/comments/invalid-id',
        { content: 'Test' },
        { headers: { Authorization: `Bearer ${testToken1}` } }
      );
      console.log('❌ Should reject invalid comment ID');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Correctly rejects invalid comment ID (400)');
      }
    }
    console.log('');

    // ==========================================
    // FEED TESTS
    // ==========================================
    console.log('📰 FEED TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 11: Get feed (should show all comments)
    console.log('Test 11: Get Activity Feed');
    try {
      const res = await axios.get(BASE_URL + '/feed');
      console.log(`✅ GET /feed`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Items: ${res.data.items.length}`);
      console.log(`   Page: ${res.data.page}`);
      console.log(`   Has More: ${res.data.hasMore}`);
      
      if (res.data.items.length > 0) {
        console.log('   Latest comments:');
        res.data.items.slice(0, 3).forEach((item, i) => {
          console.log(`     ${i + 1}. ${item.userName}: "${item.content}"`);
        });
      }
    } catch (err) {
      console.log(`❌ GET /feed: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 12: Test feed pagination
    console.log('Test 12: Test Feed Pagination');
    try {
      const res = await axios.get(BASE_URL + '/feed?page=1&limit=2');
      console.log(`✅ GET /feed?page=1&limit=2`);
      console.log(`   Items: ${res.data.items.length}`);
      console.log(`   Page: ${res.data.page}`);
      console.log(`   Has More: ${res.data.hasMore}`);
    } catch (err) {
      console.log(`❌ GET /feed with pagination: ${err.response?.status || err.message}`);
    }
    console.log('');

    // Test 13: Test feed sorting (newest first)
    console.log('Test 13: Verify Feed Sorting (Newest First)');
    try {
      const res = await axios.get(BASE_URL + '/feed');
      if (res.data.items.length > 1) {
        const dates = res.data.items.map(item => new Date(item.createdAt));
        let sorted = true;
        for (let i = 1; i < dates.length; i++) {
          if (dates[i] > dates[i - 1]) {
            sorted = false;
            break;
          }
        }
        if (sorted) {
          console.log('✅ Feed correctly sorted (newest first)');
        } else {
          console.log('❌ Feed not sorted correctly');
        }
      } else {
        console.log('⚠️  Not enough items to verify sorting');
      }
    } catch (err) {
      console.log(`❌ Error verifying sorting: ${err.message}`);
    }
    console.log('');

    // ==========================================
    // DELETE TESTS
    // ==========================================
    console.log('🗑️  DELETE TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 14: Try to delete another user's comment (should fail)
    console.log('Test 14: Try Deleting Another User\'s Comment');
    if (testCommentId) {
      try {
        await axios.delete(
          BASE_URL + `/comments/${testCommentId}`,
          { headers: { Authorization: `Bearer ${testToken2}` } }
        );
        console.log('❌ Should not allow deleting another user\'s comment');
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('✅ Correctly prevents deleting another user\'s comment (404)');
        }
      }
    }
    console.log('');

    // Test 15: Delete own comment
    console.log('Test 15: Delete Own Comment');
    if (testCommentId) {
      try {
        const res = await axios.delete(
          BASE_URL + `/comments/${testCommentId}`,
          { headers: { Authorization: `Bearer ${testToken1}` } }
        );
        console.log(`✅ DELETE /comments/${testCommentId}`);
        console.log(`   Status: ${res.status}`);
        console.log(`   Message: ${res.data.message}`);
      } catch (err) {
        console.log(`❌ DELETE /comments: ${err.response?.status || err.message}`);
      }
    }
    console.log('');

    // Test 16: Verify deletion
    console.log('Test 16: Verify Comment Was Deleted');
    if (testCommentId) {
      try {
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(testCommentId) });
        if (!comment) {
          console.log('✅ Comment successfully deleted from database');
        } else {
          console.log('❌ Comment still exists in database');
        }
      } catch (err) {
        console.log(`❌ Database verification failed: ${err.message}`);
      }
    }
    console.log('');

    // Test 17: Try to delete non-existent comment
    console.log('Test 17: Try Deleting Non-Existent Comment');
    try {
      await axios.delete(
        BASE_URL + `/comments/${new ObjectId()}`,
        { headers: { Authorization: `Bearer ${testToken1}` } }
      );
      console.log('❌ Should return 404 for non-existent comment');
    } catch (err) {
      if (err.response?.status === 404) {
        console.log('✅ Correctly returns 404 for non-existent comment');
      }
    }
    console.log('');

    // ==========================================
    // FINAL STATS
    // ==========================================
    console.log('📊 FINAL STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      const commentCount = await db.collection('comments').countDocuments({});
      console.log(`Total comments in database: ${commentCount}`);
      
      const res = await axios.get(BASE_URL + '/feed');
      console.log(`Total comments in feed: ${res.data.items.length}`);
    } catch (err) {
      console.log('Could not fetch final stats');
    }
    console.log('');

    // ==========================================
    // CLEANUP
    // ==========================================
    console.log('Cleanup: Removing test data');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await db.collection('users').deleteMany({ 
      _id: { $in: [testUserId1, testUserId2] } 
    });
    await db.collection('comments').deleteMany({ 
      userId: { $in: [testUserId1, testUserId2] } 
    });
    console.log('✅ All test data removed');
    console.log('');

    console.log('✅ All Social Controller tests completed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Social Controller test failed:', error.message);
    
    // Cleanup on error
    if (db && (testUserId1 || testUserId2)) {
      try {
        await db.collection('users').deleteMany({ 
          _id: { $in: [testUserId1, testUserId2].filter(Boolean) } 
        });
        await db.collection('comments').deleteMany({ 
          userId: { $in: [testUserId1, testUserId2].filter(Boolean) } 
        });
        console.log('✅ Cleaned up test data');
      } catch (cleanupErr) {
        console.error('⚠️  Cleanup failed:', cleanupErr.message);
      }
    }
    
    process.exit(1);
  }
}

testSocialController();