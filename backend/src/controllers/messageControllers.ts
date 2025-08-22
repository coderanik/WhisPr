import { Request, Response } from "express";
import Message from "../models/Message";
import { MessageEncryption } from "../utils/encryption";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
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

      // Use the user's registered name from database
      const displayName = req.user.name;

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
      .select('userDisplayName encryptedContent messageDate createdAt')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent overwhelming response

      res.json({
        messages: messages.map((msg: any) => ({
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
  }
}; 