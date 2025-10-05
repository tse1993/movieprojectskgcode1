require('dotenv').config();
const axios = require('axios');
<<<<<<< HEAD
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
=======

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let userId = null;
let commentId = null;
let secondUserToken = null;

// Test configuration
const testMovie = {
  tmdbId: 550, // Fight Club
  title: 'Fight Club'
};

const testUser = {
  email: `test-social-${Date.now()}@example.com`,
  name: 'Social Test User',
  password: 'password123'
};

const secondTestUser = {
  email: `test-social-2-${Date.now()}@example.com`,
  name: 'Second Test User',
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
      `Token received: ${authToken ? 'Yes' : 'No'}`
    );
    return true;
  } catch (error) {
    printResult('User registration', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 2: Register second user (for authorization tests)
async function testRegisterSecondUser() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, secondTestUser);
    secondUserToken = response.data.token;

    printResult('Second user registration',
      response.status === 201 && secondUserToken,
      `Token received: ${secondUserToken ? 'Yes' : 'No'}`
    );
    return true;
  } catch (error) {
    printResult('Second user registration', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Add comment (authenticated)
async function testAddComment() {
  try {
    const commentData = {
      tmdbId: testMovie.tmdbId,
      content: 'This is a test comment for Fight Club!'
    };

    const response = await axios.post(`${BASE_URL}/comments`, commentData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    commentId = response.data._id;

    const passed = response.status === 201 &&
                   response.data.tmdbId === testMovie.tmdbId &&
                   response.data.content === commentData.content &&
                   response.data.userName === testUser.name &&
                   response.data._id &&
                   response.data.createdAt &&
                   response.data.updatedAt;

    printResult('Add comment (authenticated)', passed,
      `Comment ID: ${commentId}, User: ${response.data.userName}`
    );
    return passed;
  } catch (error) {
    printResult('Add comment (authenticated)', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Add comment without authentication (should fail)
async function testAddCommentNoAuth() {
  try {
    const commentData = {
      tmdbId: testMovie.tmdbId,
      content: 'This should fail without auth'
    };

    await axios.post(`${BASE_URL}/comments`, commentData);
    printResult('Add comment without auth (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    printResult('Add comment without auth (should fail)', passed,
      `Expected 401, got ${error.response?.status}`
    );
    return passed;
  }
}

// Test 5: Add comment with missing tmdbId
async function testAddCommentMissingTmdbId() {
  try {
    const commentData = {
      content: 'This comment has no tmdbId'
    };

    await axios.post(`${BASE_URL}/comments`, commentData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Add comment missing tmdbId (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Add comment missing tmdbId (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 6: Add comment with missing content
async function testAddCommentMissingContent() {
  try {
    const commentData = {
      tmdbId: testMovie.tmdbId
    };

    await axios.post(`${BASE_URL}/comments`, commentData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Add comment missing content (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Add comment missing content (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 7: Add comment with invalid tmdbId (non-numeric)
async function testAddCommentInvalidTmdbId() {
  try {
    const commentData = {
      tmdbId: 'invalid',
      content: 'This has invalid tmdbId'
    };

    await axios.post(`${BASE_URL}/comments`, commentData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Add comment with invalid tmdbId (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Add comment with invalid tmdbId (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 8: Get movie comments (public - no auth required)
async function testGetMovieComments() {
  try {
    const response = await axios.get(`${BASE_URL}/comments/${testMovie.tmdbId}`);

    const passed = response.status === 200 &&
                   Array.isArray(response.data) &&
                   response.data.length > 0 &&
                   response.data.some(comment => comment._id === commentId);

    printResult('Get movie comments (public)', passed,
      `Found ${response.data.length} comments, includes test comment: ${response.data.some(c => c._id === commentId)}`
    );
    return passed;
  } catch (error) {
    printResult('Get movie comments (public)', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 9: Get comments with invalid tmdbId
async function testGetCommentsInvalidTmdbId() {
  try {
    await axios.get(`${BASE_URL}/comments/invalid`);
    printResult('Get comments invalid tmdbId (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Get comments invalid tmdbId (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 10: Update comment (authenticated, own comment)
async function testUpdateComment() {
  try {
    const updatedContent = {
      content: 'This is an UPDATED test comment!'
    };

    const response = await axios.put(`${BASE_URL}/comments/${commentId}`, updatedContent, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.message === 'Comment updated successfully';

    printResult('Update comment (own comment)', passed,
      `Message: ${response.data.message}`
    );
    return passed;
  } catch (error) {
    printResult('Update comment (own comment)', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 11: Verify comment was updated
async function testVerifyCommentUpdate() {
  try {
    const response = await axios.get(`${BASE_URL}/comments/${testMovie.tmdbId}`);
    const updatedComment = response.data.find(c => c._id === commentId);

    const passed = updatedComment &&
                   updatedComment.content === 'This is an UPDATED test comment!' &&
                   new Date(updatedComment.updatedAt) > new Date(updatedComment.createdAt);

    printResult('Verify comment update', passed,
      `Content updated: ${updatedComment?.content === 'This is an UPDATED test comment!'}, updatedAt > createdAt: ${updatedComment ? new Date(updatedComment.updatedAt) > new Date(updatedComment.createdAt) : false}`
    );
    return passed;
  } catch (error) {
    printResult('Verify comment update', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 12: Update comment without authentication (should fail)
async function testUpdateCommentNoAuth() {
  try {
    const updatedContent = {
      content: 'This should fail'
    };

    await axios.put(`${BASE_URL}/comments/${commentId}`, updatedContent);
    printResult('Update comment without auth (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    printResult('Update comment without auth (should fail)', passed,
      `Expected 401, got ${error.response?.status}`
    );
    return passed;
  }
}

// Test 13: Update someone else's comment (should fail)
async function testUpdateOthersComment() {
  try {
    const updatedContent = {
      content: 'Trying to update someone else\'s comment'
    };

    await axios.put(`${BASE_URL}/comments/${commentId}`, updatedContent, {
      headers: { Authorization: `Bearer ${secondUserToken}` }
    });
    printResult('Update other user\'s comment (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 404;
    printResult('Update other user\'s comment (should fail)', passed,
      `Expected 404, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 14: Update comment with invalid ID
async function testUpdateCommentInvalidId() {
  try {
    const updatedContent = {
      content: 'Update with invalid ID'
    };

    await axios.put(`${BASE_URL}/comments/invalid-id`, updatedContent, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Update comment invalid ID (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Update comment invalid ID (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 15: Update comment with missing content
async function testUpdateCommentMissingContent() {
  try {
    await axios.put(`${BASE_URL}/comments/${commentId}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Update comment missing content (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Update comment missing content (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 16: Get activity feed (public)
async function testGetFeed() {
  try {
    const response = await axios.get(`${BASE_URL}/feed`);

    const passed = response.status === 200 &&
                   response.data.items &&
                   Array.isArray(response.data.items) &&
                   response.data.page === 1 &&
                   typeof response.data.hasMore === 'boolean';

    printResult('Get activity feed (public)', passed,
      `Items: ${response.data.items?.length}, Page: ${response.data.page}, HasMore: ${response.data.hasMore}`
    );
    return passed;
  } catch (error) {
    printResult('Get activity feed (public)', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 17: Get feed with pagination
async function testGetFeedPagination() {
  try {
    const response = await axios.get(`${BASE_URL}/feed?page=2&limit=5`);

    const passed = response.status === 200 &&
                   response.data.page === 2 &&
                   Array.isArray(response.data.items) &&
                   response.data.items.length <= 5;

    printResult('Get feed with pagination', passed,
      `Page: ${response.data.page}, Items: ${response.data.items?.length}, Limit respected: ${response.data.items?.length <= 5}`
    );
    return passed;
  } catch (error) {
    printResult('Get feed with pagination', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 18: Delete comment without authentication (should fail)
async function testDeleteCommentNoAuth() {
  try {
    await axios.delete(`${BASE_URL}/comments/${commentId}`);
    printResult('Delete comment without auth (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 401;
    printResult('Delete comment without auth (should fail)', passed,
      `Expected 401, got ${error.response?.status}`
    );
    return passed;
  }
}

// Test 19: Delete someone else's comment (should fail)
async function testDeleteOthersComment() {
  try {
    await axios.delete(`${BASE_URL}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${secondUserToken}` }
    });
    printResult('Delete other user\'s comment (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 404;
    printResult('Delete other user\'s comment (should fail)', passed,
      `Expected 404, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 20: Delete comment with invalid ID
async function testDeleteCommentInvalidId() {
  try {
    await axios.delete(`${BASE_URL}/comments/invalid-id`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    printResult('Delete comment invalid ID (should fail)', false, 'Request should have failed');
    return false;
  } catch (error) {
    const passed = error.response?.status === 400;
    printResult('Delete comment invalid ID (should fail)', passed,
      `Expected 400, got ${error.response?.status}: ${error.response?.data?.message}`
    );
    return passed;
  }
}

// Test 21: Delete comment (authenticated, own comment)
async function testDeleteComment() {
  try {
    const response = await axios.delete(`${BASE_URL}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const passed = response.status === 200 &&
                   response.data.message === 'Comment deleted successfully';

    printResult('Delete comment (own comment)', passed,
      `Message: ${response.data.message}`
    );
    return passed;
  } catch (error) {
    printResult('Delete comment (own comment)', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 22: Verify comment was deleted
async function testVerifyCommentDeletion() {
  try {
    const response = await axios.get(`${BASE_URL}/comments/${testMovie.tmdbId}`);
    const deletedComment = response.data.find(c => c._id === commentId);

    const passed = !deletedComment;

    printResult('Verify comment deletion', passed,
      `Comment still exists: ${!!deletedComment}`
    );
    return passed;
  } catch (error) {
    printResult('Verify comment deletion', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n========================================');
  console.log('🧪 SOCIAL CONTROLLER TEST SUITE');
  console.log('========================================\n');
  console.log('Testing Phase 6: Social Features Implementation');
  console.log('Controller: socialController.js');
  console.log('Routes: comments & feed\n');
  console.log('========================================\n');

  const tests = [
    { name: 'Setup', fn: testRegisterUser },
    { name: 'Setup (Second User)', fn: testRegisterSecondUser },
    { name: 'Comments - Add', fn: testAddComment },
    { name: 'Comments - Add (No Auth)', fn: testAddCommentNoAuth },
    { name: 'Comments - Add (Missing tmdbId)', fn: testAddCommentMissingTmdbId },
    { name: 'Comments - Add (Missing Content)', fn: testAddCommentMissingContent },
    { name: 'Comments - Add (Invalid tmdbId)', fn: testAddCommentInvalidTmdbId },
    { name: 'Comments - Get (Public)', fn: testGetMovieComments },
    { name: 'Comments - Get (Invalid tmdbId)', fn: testGetCommentsInvalidTmdbId },
    { name: 'Comments - Update', fn: testUpdateComment },
    { name: 'Comments - Verify Update', fn: testVerifyCommentUpdate },
    { name: 'Comments - Update (No Auth)', fn: testUpdateCommentNoAuth },
    { name: 'Comments - Update (Other User)', fn: testUpdateOthersComment },
    { name: 'Comments - Update (Invalid ID)', fn: testUpdateCommentInvalidId },
    { name: 'Comments - Update (Missing Content)', fn: testUpdateCommentMissingContent },
    { name: 'Feed - Get (Public)', fn: testGetFeed },
    { name: 'Feed - Pagination', fn: testGetFeedPagination },
    { name: 'Comments - Delete (No Auth)', fn: testDeleteCommentNoAuth },
    { name: 'Comments - Delete (Other User)', fn: testDeleteOthersComment },
    { name: 'Comments - Delete (Invalid ID)', fn: testDeleteCommentInvalidId },
    { name: 'Comments - Delete', fn: testDeleteComment },
    { name: 'Comments - Verify Deletion', fn: testVerifyCommentDeletion }
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
    console.log('🎉 ALL TESTS PASSED! Social Controller is working correctly.\n');
    console.log('✅ Phase 6 Implementation: COMPLETE');
    console.log('✅ Matches backend.md specification');
    console.log('✅ All CRUD operations working');
    console.log('✅ Authentication & Authorization working');
    console.log('✅ Input validation working');
    console.log('✅ Feed pagination working\n');
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
>>>>>>> a0aeed12dbeb28328fba9ee9149c07688a54d598
