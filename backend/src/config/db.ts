import mongoose from "mongoose";

const db = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/Whispr";
    console.log("🔄 Attempting to connect to MongoDB...");
    
    // MongoDB connection options for better reliability
    const options: any = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: true, // Enable buffering for better reliability
      retryWrites: true,
      w: 'majority' as any,
      // For MongoDB Atlas
      ssl: mongoUri.includes('mongodb.net'),
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    };

    await mongoose.connect(mongoUri, options);
    console.log("✅ MongoDB connected successfully");
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    
    // Don't exit immediately in production, try to reconnect
    if (process.env.NODE_ENV === 'production') {
      console.log("🔄 Attempting to reconnect in 5 seconds...");
      setTimeout(() => db(), 5000);
    } else {
      process.exit(1);
    }
  }
};

export default db;
