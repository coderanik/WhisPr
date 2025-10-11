import express from "express";
import "dotenv/config";
import cors from "cors";
import StartupManager from "./startup";
import sessionMiddleware from "./middlewares/session";
import authRouter from "./routes/authRoutes";
import messageRouter from "./routes/messageRoutes";
import { MessageScheduler } from "./utils/scheduler";

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1); 

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://whispr-weld.vercel.app",
    "https://whispr-weld.vercel.app"
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200, // ✅ Fix for some browsers
}));

// ✅ Handle preflight requests globally
app.options("*", cors());


// Initialize application with startup manager
const startupManager = new StartupManager();

// Wait for startup to complete before starting the server
startupManager.start().then((success) => {
  if (success) {
    console.log('🚀 Application initialized successfully');
    
    // Start message cleanup scheduler
    try {
      MessageScheduler.startDailyCleanup();
      console.log('✅ Message cleanup scheduler started');
    } catch (error) {
      console.error('❌ Failed to start message cleanup scheduler:', error);
    }
    
    // Start the server after successful initialization
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } else {
    console.error('❌ Application startup failed');
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing with limited functionality...');
      // Start server anyway for production
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (limited functionality)`);
      });
    } else {
      console.error('❌ Exiting due to startup failure in development mode');
      process.exit(1);
    }
  }
}).catch((error) => {
  console.error('❌ Startup error:', error);
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Continuing with limited functionality...');
    // Start server anyway for production
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (limited functionality)`);
    });
  } else {
    console.error('❌ Exiting due to startup error in development mode');
    process.exit(1);
  }
});

app.use(express.json());
app.use(sessionMiddleware);

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.get("/", (_req, res) => {
  res.send("Backend is working");
});

// Remove the duplicate app.listen call here since it's now handled in the startup logic

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  MessageScheduler.stopDailyCleanup();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  MessageScheduler.stopDailyCleanup();
  process.exit(0);
});
