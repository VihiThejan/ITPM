import BoardingListing from "../models/BoardingListing.js";
import RoommatePost from "../models/RoommatePost.js";
import Review from "../models/Review.js";

const listingStatuses = ["approved", "rejected", "deactivated"];
const reviewStatuses = ["approved", "rejected"];

export const getPendingListings = async (req, res, next) => {
  try {
    const items = await BoardingListing.find({ moderationStatus: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const getPendingReviews = async (req, res, next) => {
  try {
    const items = await Review.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("listingId", "title locationText")
      .populate("studentId", "name firstName lastName email")
      .lean();

    const normalized = items.map((review) => ({
      ...review,
      studentName:
        review.studentId?.name ||
        `${review.studentId?.firstName || ""} ${review.studentId?.lastName || ""}`.trim() ||
        "Anonymous"
    }));

    res.status(200).json({ items: normalized });
  } catch (error) {
    next(error);
  }
};

export const moderateListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { status } = req.body;

    if (!listingStatuses.includes(status)) {
      return next(Object.assign(new Error("Invalid listing moderation status."), { status: 400 }));
    }

    const listing = await BoardingListing.findByIdAndUpdate(
      listingId,
      { moderationStatus: status },
      { new: true }
    ).lean();

    if (!listing) {
      return next(Object.assign(new Error("Listing not found."), { status: 404 }));
    }

    res.status(200).json({ item: listing });
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!reviewStatuses.includes(status)) {
      return next(Object.assign(new Error("Invalid review moderation status."), { status: 400 }));
    }

    const review = await Review.findByIdAndUpdate(reviewId, { status }, { new: true }).lean();

    if (!review) {
      return next(Object.assign(new Error("Review not found."), { status: 404 }));
    }

    res.status(200).json({ item: review });
  } catch (error) {
    next(error);
  }
};

export const getPendingRoommatePosts = async (req, res, next) => {
  try {
    const items = await RoommatePost.find({ moderationStatus: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const moderateRoommatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    if (!listingStatuses.includes(status)) {
      return next(Object.assign(new Error("Invalid roommate post moderation status."), { status: 400 }));
    }

    const item = await RoommatePost.findByIdAndUpdate(
      postId,
      { moderationStatus: status },
      { new: true }
    ).lean();

    if (!item) {
      return next(Object.assign(new Error("Roommate post not found."), { status: 404 }));
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
};
