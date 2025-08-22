import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
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

export default mongoose.model("User", UserSchema);
