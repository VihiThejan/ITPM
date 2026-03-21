import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardingListing",
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved"
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ listingId: 1, createdAt: -1 });
reviewSchema.index({ studentId: 1, listingId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
