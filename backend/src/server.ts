import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "./config/db";
import sessionMiddleware from "./middlewares/session";
import authRouter from "./routes/authRoutes";
import messageRouter from "./routes/messageRoutes";
import { MessageScheduler } from "./utils/scheduler";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://whispr-weld.vercel.app",
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200, // ✅ Fix for some browsers
}));

// ✅ Handle preflight requests globally
app.options("*", cors());


// Initialize database
db();

// Start message cleanup scheduler
MessageScheduler.startDailyCleanup();

app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.get("/", (_req, res) => {
  res.send("Backend is working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
