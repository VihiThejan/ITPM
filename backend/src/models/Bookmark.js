import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);

bookmarkSchema.index({ studentId: 1, listingId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
