import { Request, Response } from "express";
import Message from "../models/Message";
import User from "../models/User";
import { MessageEncryption } from "../utils/encryption";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    anonymousName: string;
  };
}

export const messageControllers = {
  /**
   * Create a new message
   */
  async createMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { content } = req.body as { content: string };

      // Validate content
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Message content is required" });
      }

      if (content.length > 1000) {
        return res.status(400).json({ error: "Message cannot exceed 1000 characters" });
      }

      if (content.trim().length === 0) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      // Check rate limit: 5 messages per minute per user
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentMessages = await Message.countDocuments({
        userId: req.user._id,
        createdAt: { $gte: oneMinuteAgo }
      });

      if (recentMessages >= 5) {
        return res.status(429).json({ 
          error: "Rate limit exceeded. You can only post 5 messages per minute.",
          retryAfter: 60
        });
      }

      // Use the user's anonymous name from database
      const displayName = req.user.anonymousName;

      // Encrypt the message content
      const encryptedContent = MessageEncryption.encrypt(content);

      // Create the message
      const message = new Message({
        userId: req.user._id,
        encryptedContent,
        userDisplayName: displayName,
        messageDate: new Date()
      });

      await message.save();

      res.status(201).json({
        message: "Message posted successfully",
        displayName,
        messageId: message._id
      });

    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * Get all messages for the forum (show display names and decrypted content)
   */
  async getForumMessages(req: Request, res: Response) {
    try {
      // Get messages from the last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const messages = await Message.find({
        messageDate: { $gte: oneDayAgo },
        isActive: true
      })
      .select('_id userDisplayName encryptedContent messageDate createdAt')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent overwhelming response

      res.json({
        messages: messages.map((msg: any) => ({
          id: msg._id,
          displayName: msg.userDisplayName,
          content: MessageEncryption.decrypt(msg.encryptedContent),
          postedAt: msg.createdAt,
          messageDate: msg.messageDate
        }))
      });

    } catch (error) {
      console.error("Error fetching forum messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * Get user's own messages (decrypted)
   */
  async getUserMessages(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get user's messages from the last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const messages = await Message.find({
        userId: req.user._id,
        messageDate: { $gte: oneDayAgo },
        isActive: true
      })
      .sort({ createdAt: -1 });

      // Decrypt messages for the user
      const decryptedMessages = messages.map((msg: any) => ({
        id: msg._id,
        content: MessageEncryption.decrypt(msg.encryptedContent),
        displayName: msg.userDisplayName,
        postedAt: msg.createdAt
      }));

      res.json({
        messages: decryptedMessages
      });

    } catch (error) {
      console.error("Error fetching user messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * Get user's message count for rate limiting
   */
  async getMessageCount(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const count = await Message.countDocuments({
        userId: req.user._id,
        createdAt: { $gte: oneMinuteAgo }
      });

      res.json({
        messageCount: count,
        limit: 5,
        remaining: Math.max(0, 5 - count)
      });

    } catch (error) {
      console.error("Error getting message count:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * Get community statistics
   */
  async getCommunityStats(req: Request, res: Response) {
    try {
      // Get total number of registered users (members)
      const totalMembers = await User.countDocuments();

      // Get number of users who have logged in within the last hour (online)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const onlineUsers = await User.countDocuments({
        updatedAt: { $gte: oneHourAgo }
      });

      // Get total number of messages posted
      const totalMessages = await Message.countDocuments({ isActive: true });

      // Get messages posted today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const messagesToday = await Message.countDocuments({
        createdAt: { $gte: today },
        isActive: true
      });

      // Get creation date of the first user (community creation date)
      const firstUser = await User.findOne().sort({ createdAt: 1 });
      const communityCreated = firstUser ? firstUser.createdAt : new Date();

      res.json({
        totalMembers,
        onlineUsers,
        totalMessages,
        messagesToday,
        communityCreated
      });

    } catch (error) {
      console.error("Error getting community stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * Toggle like on a message
   */
  async toggleLike(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { messageId } = req.params;
      const userId = req.user._id;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      // Check if user already liked this message
      const isLiked = message.likedBy?.includes(userId) || false;

      if (isLiked) {
        // Unlike: remove user from likedBy array
        await Message.findByIdAndUpdate(messageId, {
          $pull: { likedBy: userId },
          $inc: { likeCount: -1 }
        });
      } else {
        // Like: add user to likedBy array
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { likedBy: userId },
          $inc: { likeCount: 1 }
        });
      }

      res.json({
        liked: !isLiked,
        message: !isLiked ? "Message liked" : "Message unliked"
      });

    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  /**
   * Report a message
   */
  async reportMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { messageId } = req.params;
      const userId = req.user._id;
      const { reason } = req.body;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      // Check if user already reported this message
      const alreadyReported = message.reportedBy?.includes(userId) || false;
      if (alreadyReported) {
        return res.status(400).json({ error: "Message already reported by you" });
      }

      // Add report
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { reportedBy: userId },
        $push: { reports: { userId, reason: reason || "No reason provided", reportedAt: new Date() } },
        $inc: { reportCount: 1 }
      });

      res.json({
        message: "Message reported successfully"
      });

    } catch (error) {
      console.error("Error reporting message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}; 