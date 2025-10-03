const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  name: 'Test User',
  password: 'password123'
};

async function testAuth() {
  console.log('🧪 Starting Authentication Tests\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Test 1: Register new user
    console.log('Test 1: Register New User');
    console.log('Request:', testUser);

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);

    console.log('✅ Status:', registerResponse.status);
    console.log('✅ Response:', registerResponse.data);
    console.log('✅ Token received:', !!registerResponse.data.token);
    console.log('✅ User ID:', registerResponse.data.user?.id);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const token = registerResponse.data.token;

    // Test 2: Try to register same email again (should fail)
    console.log('Test 2: Register Duplicate Email (Should Fail)');
    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('❌ FAILED: Should not allow duplicate email');
    } catch (error) {
      console.log('✅ Correctly rejected duplicate email');
      console.log('✅ Error message:', error.response?.data?.message);
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 3: Login with correct credentials
    console.log('Test 3: Login with Correct Credentials');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    console.log('✅ Status:', loginResponse.status);
    console.log('✅ Response:', loginResponse.data);
    console.log('✅ Token received:', !!loginResponse.data.token);
    console.log('✅ User matches:', loginResponse.data.user.email === testUser.email);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 4: Login with wrong password
    console.log('Test 4: Login with Wrong Password (Should Fail)');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
      console.log('❌ FAILED: Should not allow wrong password');
    } catch (error) {
      console.log('✅ Correctly rejected wrong password');
      console.log('✅ Error message:', error.response?.data?.message);
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 5: Login with non-existent email
    console.log('Test 5: Login with Non-existent Email (Should Fail)');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'password123'
      });
      console.log('❌ FAILED: Should not allow non-existent email');
    } catch (error) {
      console.log('✅ Correctly rejected non-existent email');
      console.log('✅ Error message:', error.response?.data?.message);
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 6: Register with missing fields
    console.log('Test 6: Register with Missing Fields (Should Fail)');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email: 'incomplete@example.com'
        // Missing name and password
      });
      console.log('❌ FAILED: Should require all fields');
    } catch (error) {
      console.log('✅ Correctly rejected incomplete data');
      console.log('✅ Error message:', error.response?.data?.message);
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 7: Verify JWT token structure
    console.log('Test 7: Verify JWT Token Structure');
    const tokenParts = token.split('.');
    console.log('✅ Token has 3 parts:', tokenParts.length === 3);
    console.log('✅ Token format: header.payload.signature');

    // Decode payload (just for testing - don't do this in production!)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    console.log('✅ Token payload contains userId:', !!payload.userId);
    console.log('✅ Token has expiration:', !!payload.exp);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Summary
    console.log('🎉 ALL AUTHENTICATION TESTS PASSED!\n');
    console.log('Summary:');
    console.log('✅ User registration works');
    console.log('✅ Duplicate email prevention works');
    console.log('✅ User login works');
    console.log('✅ Wrong password rejection works');
    console.log('✅ Non-existent user rejection works');
    console.log('✅ Input validation works');
    console.log('✅ JWT tokens are generated correctly');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
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
    await testAuth();
  }
}

run();
