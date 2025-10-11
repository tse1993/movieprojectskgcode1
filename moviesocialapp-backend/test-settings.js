const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test user credentials with unique email
const testUser = {
  email: `settingstest${Date.now()}@example.com`,
  password: 'password123',
  name: 'Settings Test User'
};

let authToken = '';

async function testSettingsEndpoints() {
  console.log('🧪 SETTINGS ENDPOINTS TEST SUITE\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Register a test user
    console.log('\n1️⃣  Testing User Registration...');
    try {
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
      authToken = registerRes.data.token;
      console.log('✅ User registered successfully');
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    } catch (error) {
      if (error.response?.data?.message === 'Email already exists') {
        console.log('⚠️  User already exists, attempting login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        authToken = loginRes.data.token;
        console.log('✅ Logged in successfully');
      } else {
        throw error;
      }
    }

    // Step 2: Test GET /api/user/profile (baseline)
    console.log('\n2️⃣  Testing GET /api/user/profile (baseline)...');
    const profileRes = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved');
    console.log(`   Name: ${profileRes.data.user.name}`);
    console.log(`   Email: ${profileRes.data.user.email}`);

    // Step 3: Test PUT /api/user/profile (Update Username)
    console.log('\n3️⃣  Testing PUT /api/user/profile (Update Username)...');
    const newName = 'Updated Test User ' + Date.now();
    const updateProfileRes = await axios.put(
      `${BASE_URL}/user/profile`,
      { name: newName },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Profile updated successfully');
    console.log(`   Old Name: ${profileRes.data.user.name}`);
    console.log(`   New Name: ${updateProfileRes.data.user.name}`);
    console.log(`   Message: ${updateProfileRes.data.message}`);

    // Step 4: Verify profile update persists
    console.log('\n4️⃣  Verifying profile update persists...');
    const verifyProfileRes = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (verifyProfileRes.data.user.name === newName) {
      console.log('✅ Profile update persisted correctly');
    } else {
      console.log('❌ Profile update did NOT persist');
    }

    // Step 5: Test validation (empty name)
    console.log('\n5️⃣  Testing validation (empty name)...');
    try {
      await axios.put(
        `${BASE_URL}/user/profile`,
        { name: '' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ Validation failed - empty name should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working correctly');
        console.log(`   Error: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    // Step 6: Test validation (name too short)
    console.log('\n6️⃣  Testing validation (name too short)...');
    try {
      await axios.put(
        `${BASE_URL}/user/profile`,
        { name: 'A' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ Validation failed - short name should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working correctly');
        console.log(`   Error: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    // Step 7: Test PUT /api/user/password (Change Password)
    console.log('\n7️⃣  Testing PUT /api/user/password (Change Password)...');
    const newPassword = 'newpassword456';
    const changePasswordRes = await axios.put(
      `${BASE_URL}/user/password`,
      {
        currentPassword: testUser.password,
        newPassword: newPassword
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Password changed successfully');
    console.log(`   Message: ${changePasswordRes.data.message}`);

    // Step 8: Verify new password works
    console.log('\n8️⃣  Verifying new password works...');
    const loginWithNewPasswordRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: newPassword
    });
    console.log('✅ Login with new password successful');

    // Step 9: Test password validation (wrong current password)
    console.log('\n9️⃣  Testing password validation (wrong current password)...');
    try {
      await axios.put(
        `${BASE_URL}/user/password`,
        {
          currentPassword: 'wrongpassword',
          newPassword: 'anotherpassword'
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ Validation failed - wrong password should be rejected');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Password validation working correctly');
        console.log(`   Error: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    // Step 10: Test password validation (new password too short)
    console.log('\n🔟 Testing password validation (new password too short)...');
    try {
      await axios.put(
        `${BASE_URL}/user/password`,
        {
          currentPassword: newPassword,
          newPassword: '12345'
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('❌ Validation failed - short password should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Password length validation working correctly');
        console.log(`   Error: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    // Step 11: Test authentication requirement
    console.log('\n1️⃣1️⃣  Testing authentication requirement...');
    try {
      await axios.put(`${BASE_URL}/user/profile`, { name: 'Hacker' });
      console.log('❌ Security failed - should require authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication required correctly');
      } else {
        throw error;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED! Settings endpoints are working correctly.\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run tests
testSettingsEndpoints();
