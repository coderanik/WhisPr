import express from "express";
import { messageControllers } from "../controllers/messageControllers";
import { authenticateUser } from "../middlewares/auth";
import { checkDatabaseConnection } from "../middlewares/dbCheck";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting middleware: 5 requests per minute per IP
const messageRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many message requests from this IP, please try again later.",
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to message creation
router.post("/create", messageRateLimit, checkDatabaseConnection, authenticateUser, messageControllers.createMessage);

// Get forum messages (public, no authentication required)
router.get("/forum", checkDatabaseConnection, messageControllers.getForumMessages);

// Get user's own messages (requires authentication)
router.get("/my-messages", checkDatabaseConnection, authenticateUser, messageControllers.getUserMessages);



// Get message count for rate limiting (requires authentication)
router.get("/count", authenticateUser, messageControllers.getMessageCount);

export default router; 