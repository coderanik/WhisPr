import { createClient } from 'redis';

// Create Redis client with connection details
// Use local Redis for development, Redis Cloud for production
const redisClient = createClient({
  username: process.env.NODE_ENV === 'production' ? 'default' : undefined,
  password: process.env.NODE_ENV === 'production' ? '3LaIN6E2mNFBrEn1xXHgn9snIzt2Wn4f' : undefined,
  socket: {
    host: process.env.NODE_ENV === 'production' 
      ? 'redis-13091.c8.us-east-1-4.ec2.redns.redis-cloud.com' 
      : '127.0.0.1',
    port: process.env.NODE_ENV === 'production' ? 13091 : 6379,
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.error('❌ Redis connection failed after 3 retries');
        return false;
      }
      const delay = Math.min(retries * 100, 1000);
      console.log(`🔄 Redis reconnection attempt ${retries} in ${delay}ms...`);
      return delay;
    }
  }
});

// Error handling
redisClient.on('error', (err) => {
  console.error('[❌ Redis] Connection error:', err.message);
});

redisClient.on('connect', () => {
  console.log('[✅ Redis] Connected successfully');
});

redisClient.on('ready', () => {
  console.log('[🚀 Redis] Client is ready to use');
});

redisClient.on('end', () => {
  console.log('[🔌 Redis] Connection ended');
});

redisClient.on('reconnecting', () => {
  console.log('[🔄 Redis] Reconnecting...');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await redisClient.quit();
    console.log('[🔄 Redis] Gracefully shutting down...');
    process.exit(0);
  } catch (error) {
    console.error('[❌ Redis] Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await redisClient.quit();
    console.log('[🔄 Redis] Gracefully shutting down...');
    process.exit(0);
  } catch (error) {
    console.error('[❌ Redis] Error during shutdown:', error);
    process.exit(1);
  }
});

export default redisClient;
