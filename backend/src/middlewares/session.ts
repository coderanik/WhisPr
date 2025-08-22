import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

let redisClient: any;
let redisStore: any;

// Check if Redis is disabled
const isRedisDisabled = process.env.REDIS_DISABLED === 'true';

// Initialize Redis client with error handling
const initRedis = async () => {
  // If Redis is disabled, return null immediately
  if (isRedisDisabled) {
    console.log('⚠️  Redis is disabled, using memory store for sessions');
    return null;
  }

  try {
    console.log('🔄 Attempting to connect to Redis...');
    
    redisClient = createClient({
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
            console.error('❌ Redis connection failed after 3 retries, falling back to memory store');
            return false;
          }
          const delay = Math.min(retries * 100, 1000);
          console.log(`🔄 Redis reconnection attempt ${retries} in ${delay}ms...`);
          return delay;
        }
      }
    });

    redisClient.on('error', (err: any) => {
      console.error('❌ Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('🚀 Redis client ready');
    });

    // Set connection timeout
    const connectionPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Redis connection timeout')), 10000);
    });

    await Promise.race([connectionPromise, timeoutPromise]);
    
    redisStore = new RedisStore({ client: redisClient });
    console.log('✅ Redis store initialized successfully');
    
    return redisStore;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    console.log('⚠️  Falling back to memory store for sessions');
    return null;
  }
};

// Initialize Redis immediately
initRedis().catch(console.error);

const sessionMiddleware = session({
  store: redisStore || undefined, // Use Redis store if available, otherwise use memory store
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  },
  name: 'whispr-session',
});

console.log('✅ Session middleware loaded successfully');

export default sessionMiddleware;
