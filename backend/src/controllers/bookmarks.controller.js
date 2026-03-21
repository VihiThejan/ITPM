import Bookmark from "../models/Bookmark.js";

export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ studentId: req.user.id })
      .populate({
        path: "listingId",
        select:
          "title locationText rent roomType facilities photos availability whatsappNumber moderationStatus"
      })
      .sort({ createdAt: -1 })
      .lean();

    const items = bookmarks
      .filter((bookmark) => bookmark.listingId && bookmark.listingId.moderationStatus === "approved")
      .map((bookmark) => ({
        _id: bookmark._id,
        listing: bookmark.listingId
      }));

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const createBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create({
      studentId: req.user.id,
      listingId: req.body.listingId
    });

    res.status(201).json({
      _id: bookmark._id,
      listingId: bookmark.listingId
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(Object.assign(new Error("Listing already bookmarked."), { status: 409 }));
    }
    next(error);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    await Bookmark.findOneAndDelete({
      studentId: req.user.id,
      listingId
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
