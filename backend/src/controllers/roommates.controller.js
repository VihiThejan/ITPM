import RoommatePost from "../models/RoommatePost.js";

export const getApprovedRoommatePosts = async (req, res, next) => {
  try {
    const items = await RoommatePost.find({ moderationStatus: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export const createRoommatePost = async (req, res, next) => {
  try {
    const post = await RoommatePost.create({
      ...req.body,
      studentId: req.user.id,
      moderationStatus: "pending"
    });

    res.status(201).json({
      item: post,
      message: "Roommate post submitted and awaiting moderation."
    });
  } catch (error) {
    next(error);
  }
};
