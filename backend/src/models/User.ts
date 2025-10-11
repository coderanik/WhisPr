import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    anonymousName: {
      type: String,
      unique: true,
      required: true,
    },
    regNoHash: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    loginAttempts: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true }
);

// Pre-save hook removed - no longer needed for debugging

// Force clear any cached models
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
