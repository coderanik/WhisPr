import Redis from 'ioredis'; // ✅ Correct import

// Create Redis instance with full configuration
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 2000);
    console.log(`Reconnecting to Redis in ${delay}ms...`);
    return delay;
  }
});

// Optional logging
redisClient.on('connect', () => {
  console.log('[✅ Redis] Connected successfully');
});

redisClient.on('ready', () => {
  console.log('[🚀 Redis] Client is ready to use');
});

redisClient.on('error', (err) => {
  console.error('[❌ Redis] Connection error:', err);
});

redisClient.on('close', () => {
  console.log('[⚠️ Redis] Connection closed');
});

export default redisClient;
