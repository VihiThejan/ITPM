import BoardingListing from "../models/BoardingListing.js";
import Review from "../models/Review.js";

const buildSort = (sortBy) => {
  if (sortBy === "price_asc") {
    return { rent: 1, createdAt: -1 };
  }
  if (sortBy === "price_desc") {
    return { rent: -1, createdAt: -1 };
  }
  if (sortBy === "rating_desc") {
    return { averageRating: -1, createdAt: -1 };
  }
  return { createdAt: -1 };
};

export const getListings = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      location,
      minPrice,
      maxPrice,
      roomType,
      facilities,
      sortBy
    } = req.query;

    const filter = {
      moderationStatus: "approved",
      availability: "available"
    };

    if (location) {
      filter.locationText = { $regex: location, $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.rent = {};
      if (minPrice !== undefined) {
        filter.rent.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.rent.$lte = maxPrice;
      }
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (facilities?.length) {
      filter.facilities = { $all: facilities };
    }

    const skip = (page - 1) * limit;
    const sort = buildSort(sortBy);

    const listingPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "listingId",
          as: "reviews"
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $round: [{ $avg: "$reviews.rating" }, 1] },
              0
            ]
          },
          reviewCount: { $size: "$reviews" }
        }
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          reviews: 0
        }
      }
    ];

    const [items, total] = await Promise.all([
      BoardingListing.aggregate(listingPipeline),
      BoardingListing.countDocuments(filter)
    ]);

    res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const listing = await BoardingListing.findOne({
      _id: listingId,
      moderationStatus: "approved"
    }).lean();

    if (!listing) {
      return next(Object.assign(new Error("Listing not found"), { status: 404 }));
    }

    await BoardingListing.updateOne({ _id: listingId }, { $inc: { viewCount: 1 } });

    const ratingSummary = await Review.aggregate([
      {
        $match: {
          listingId: listing._id,
          status: "approved"
        }
      },
      {
        $group: {
          _id: "$listingId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const summary = ratingSummary[0] || {
      averageRating: 0,
      reviewCount: 0
    };

    res.status(200).json({
      ...listing,
      averageRating: Number(summary.averageRating?.toFixed(1) || 0),
      reviewCount: summary.reviewCount || 0
    });
  } catch (error) {
    next(error);
  }
};
