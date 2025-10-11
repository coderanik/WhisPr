// Test setup script for local development
const { spawn } = require('child_process');

// Set environment variables for local testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MONGO_URI = 'mongodb://localhost:27017/whispr_test';
process.env.REDIS_DISABLED = 'true'; // Use memory store for testing
process.env.JWT_SECRET = 'test-jwt-secret-key-for-development-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-long';

console.log('🧪 Setting up local test environment...');
console.log('Environment variables set:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI:', process.env.MONGO_URI);
console.log('- REDIS_DISABLED:', process.env.REDIS_DISABLED);

// Check if MongoDB is running locally
const { exec } = require('child_process');
exec('mongod --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ MongoDB not found locally. Please install MongoDB or use Docker.');
    console.log('💡 To install MongoDB on macOS: brew install mongodb-community');
    console.log('💡 To start MongoDB: brew services start mongodb-community');
    return;
  }
  
  console.log('✅ MongoDB found:', stdout.trim());
  
  // Check if MongoDB service is running
  exec('brew services list | grep mongodb', (error, stdout, stderr) => {
    if (error || !stdout.includes('started')) {
      console.log('⚠️  MongoDB service not running. Starting it...');
      exec('brew services start mongodb-community', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Failed to start MongoDB service:', error.message);
          console.log('💡 Please start MongoDB manually: brew services start mongodb-community');
        } else {
          console.log('✅ MongoDB service started');
          console.log('\n🚀 Ready to test! Run: node test-anonymous-auth.js');
        }
      });
    } else {
      console.log('✅ MongoDB service is running');
      console.log('\n🚀 Ready to test! Run: node test-anonymous-auth.js');
    }
  });
});
