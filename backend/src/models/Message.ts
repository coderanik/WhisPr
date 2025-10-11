import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    encryptedContent: {
      type: String,
      required: true,
    },
    userDisplayName: {
      type: String,
      required: true,
    },
    messageDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    likeCount: {
      type: Number,
      default: 0,
    },
    reportedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    reports: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reason: String,
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }],
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
    // Auto-delete messages older than 24 hours
    expireAfterSeconds: 86400 // 24 hours
  }
);

// Index for efficient querying by date and active status
MessageSchema.index({ messageDate: 1, isActive: 1 });

export default mongoose.model("Message", MessageSchema); 