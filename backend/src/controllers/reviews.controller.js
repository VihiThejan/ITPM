import Review from "../models/Review.js";
import BoardingListing from "../models/BoardingListing.js";

export const getReviewsByListingId = async (req, res, next) => {
  try {
    const { listingId } = req.query;

    const reviews = await Review.find({
      listingId,
      status: "approved"
    })
      .populate("studentId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const safeReviews = reviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      studentName: review.studentId?.name || "Anonymous",
      createdAt: review.createdAt
    }));

    res.status(200).json({ items: safeReviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;

    const listing = await BoardingListing.findOne({
      _id: listingId,
      moderationStatus: "approved"
    });

    if (!listing) {
      return next(Object.assign(new Error("Listing not found"), { status: 404 }));
    }

    const review = await Review.create({
      listingId,
      studentId: req.user.id,
      rating,
      comment,
      status: "approved"
    });

    res.status(201).json({
      _id: review._id,
      listingId: review.listingId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        Object.assign(new Error("You have already reviewed this listing."), {
          status: 409
        })
      );
    }
    next(error);
  }
};
