import mongoose from "mongoose";

const boardingListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    locationText: {
      type: String,
      required: true,
      trim: true
    },
    distanceFromSliitKm: {
      type: Number,
      min: 0,
      default: 0
    },
    rent: {
      type: Number,
      required: true,
      min: 0
    },
    roomType: {
      type: String,
      enum: ["single", "shared"],
      required: true
    },
    facilities: {
      type: [String],
      default: []
    },
    photos: {
      type: [String],
      default: []
    },
    availability: {
      type: String,
      enum: ["available", "full"],
      default: "available"
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "deactivated"],
      default: "pending"
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

boardingListingSchema.index({ moderationStatus: 1, availability: 1 });
boardingListingSchema.index({ locationText: "text", title: "text" });
boardingListingSchema.index({ rent: 1, roomType: 1 });
boardingListingSchema.index({ facilities: 1 });

export default mongoose.model("BoardingListing", boardingListingSchema);
