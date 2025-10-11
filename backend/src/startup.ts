import mongoose from 'mongoose';
import { createClient } from 'redis';

interface StartupConfig {
  maxRetries: number;
  retryDelay: number;
  startupTimeout: number;
}

class StartupManager {
  private config: StartupConfig;
  private retryCount: number = 0;

  constructor() {
    this.config = {
      maxRetries: 5,
      retryDelay: 5000,
      startupTimeout: 30000
    };
  }

  async initializeDatabase(): Promise<boolean> {
    try {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/whispr";
      console.log("🔄 Attempting to connect to MongoDB...");
      
      const options: any = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        bufferCommands: true, // Enable buffering for better reliability
        retryWrites: true,
        w: 'majority' as any,
        ssl: mongoUri.includes('mongodb.net'),
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
      };

      await mongoose.connect(mongoUri, options);
      console.log("✅ MongoDB connected successfully");
      
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('🔌 MongoDB disconnected');
      });
      
      return true;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      return false;
    }
  }

  async initializeRedis(): Promise<boolean> {
    if (process.env.REDIS_DISABLED === 'true') {
      console.log('⚠️  Redis is disabled, using memory store');
      return true;
    }

    try {
      console.log("🔄 Attempting to connect to Redis...");
      
      const redisClient = createClient({
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          connectTimeout: 5000,
        }
      });

      await redisClient.connect();
      console.log("✅ Redis connected successfully");
      
      redisClient.on('error', (err) => {
        console.error('❌ Redis error:', err);
      });
      
      return true;
    } catch (error) {
      console.error("❌ Redis connection failed:", error);
      return false;
    }
  }

  async retryConnection(connectionType: 'database' | 'redis'): Promise<boolean> {
    if (this.retryCount >= this.config.maxRetries) {
      console.error(`❌ Max retries (${this.config.maxRetries}) reached for ${connectionType}`);
      return false;
    }

    this.retryCount++;
    console.log(`🔄 Retrying ${connectionType} connection in ${this.config.retryDelay}ms... (attempt ${this.retryCount}/${this.config.maxRetries})`);
    
    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
    
    if (connectionType === 'database') {
      return await this.initializeDatabase();
    } else {
      return await this.initializeRedis();
    }
  }

  async start(): Promise<boolean> {
    console.log('🚀 Starting WhisPr application...');
    
    // Initialize database first
    let dbConnected = await this.initializeDatabase();
    if (!dbConnected && process.env.NODE_ENV === 'production') {
      console.log('🔄 Retrying database connection...');
      dbConnected = await this.retryConnection('database');
    }
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      return false;
    }
    
    // Wait a moment for database to be fully ready
    console.log('⏳ Waiting for database to be fully ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Initialize Redis (optional)
    let redisConnected = await this.initializeRedis();
    if (!redisConnected && process.env.NODE_ENV === 'production') {
      console.log('🔄 Retrying Redis connection...');
      redisConnected = await this.retryConnection('redis');
    }
    
    if (!redisConnected) {
      console.log('⚠️  Redis connection failed, continuing with memory store');
    }
    
    console.log('✅ Application startup completed successfully');
    return true;
  }
}

export default StartupManager;
