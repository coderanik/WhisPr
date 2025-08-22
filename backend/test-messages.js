// Simple test script for message API
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testMessageAPI() {
  try {
    console.log('Testing Message API...\n');

    // Test 1: Get forum messages (public)
    console.log('1. Testing GET /api/messages/forum (public)');
    try {
      const forumResponse = await axios.get(`${BASE_URL}/messages/forum`);
      console.log('✅ Forum messages retrieved:', forumResponse.data);
    } catch (error) {
      console.log('❌ Forum messages error:', error.response?.data || error.message);
    }

    // Test 2: Get message count (requires auth)
    console.log('\n2. Testing GET /api/messages/count (requires auth)');
    try {
      const countResponse = await axios.get(`${BASE_URL}/messages/count`);
      console.log('✅ Message count retrieved:', countResponse.data);
    } catch (error) {
      console.log('❌ Message count error (expected):', error.response?.data?.error || error.message);
    }

    // Test 3: Create message (requires auth)
    console.log('\n3. Testing POST /api/messages/create (requires auth)');
    try {
      const createResponse = await axios.post(`${BASE_URL}/messages/create`, {
        content: 'Test message from API'
      });
      console.log('✅ Message created:', createResponse.data);
    } catch (error) {
      console.log('❌ Create message error (expected):', error.response?.data?.error || error.message);
    }

    console.log('\n✅ All tests completed!');
    console.log('\nNote: Authentication tests require a valid JWT token.');
    console.log('To test with authentication:');
    console.log('1. Register/login a user via /api/auth');
    console.log('2. Use the returned JWT token in Authorization header');
    console.log('3. Test the protected endpoints');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testMessageAPI();
}

module.exports = { testMessageAPI }; 