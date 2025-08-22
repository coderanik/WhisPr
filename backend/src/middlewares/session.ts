import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

let redisClient: any;

// Initialize Redis client
const initRedis = async () => {
  redisClient = createClient();
  await redisClient.connect();
};

// Initialize Redis immediately
initRedis().catch(console.error);

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

console.log('✅ Redis session middleware loaded successfully');

export default sessionMiddleware;
