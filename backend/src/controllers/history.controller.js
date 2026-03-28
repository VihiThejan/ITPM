import BoardingListing from "../models/BoardingListing.js";
import RecentlyViewed from "../models/RecentlyViewed.js";

export const getRecentlyViewed = async (req, res, next) => {
  try {
    const { limit } = req.query;

    const historyEntries = await RecentlyViewed.find({
      studentId: req.user.id
    })
      .sort({ viewedAt: -1 })
      .limit(limit)
      .populate({
        path: "listingId",
        match: { moderationStatus: "approved" }
      })
      .lean();

    const items = historyEntries
      .filter((entry) => entry.listingId)
      .map((entry) => ({
        ...entry.listingId,
        viewedAt: entry.viewedAt
      }));

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const trackViewed = async (req, res, next) => {
  try {
    const { listingId } = req.body;

    const listingExists = await BoardingListing.exists({ _id: listingId });
    if (!listingExists) {
      return next(Object.assign(new Error("Listing not found"), { status: 404 }));
    }

    await RecentlyViewed.findOneAndUpdate(
      {
        studentId: req.user.id,
        listingId
      },
      {
        $set: { viewedAt: new Date() }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(201).json({ message: "Viewed listing tracked" });
  } catch (error) {
    next(error);
  }
};
