import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardingListing",
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

recentlyViewedSchema.index({ studentId: 1, listingId: 1 }, { unique: true });
recentlyViewedSchema.index({ studentId: 1, viewedAt: -1 });

export default mongoose.model("RecentlyViewed", recentlyViewedSchema);
