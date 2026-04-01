import mongoose from "mongoose";

const roommatePostSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    preferredLocation: {
      type: String,
      trim: true,
      maxlength: 120
    },
    budgetMin: {
      type: Number,
      min: 0,
      default: 0
    },
    budgetMax: {
      type: Number,
      min: 0,
      default: 0
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: 30
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "deactivated"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

roommatePostSchema.index({ moderationStatus: 1, createdAt: -1 });
roommatePostSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model("RoommatePost", roommatePostSchema);
