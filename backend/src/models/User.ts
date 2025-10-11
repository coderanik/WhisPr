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

// Add pre-save hook to debug what's being saved
UserSchema.pre('save', function(next) {
  console.log('🔍 Pre-save hook - Document data:', this.toObject());
  next();
});

// Force clear any cached models
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
