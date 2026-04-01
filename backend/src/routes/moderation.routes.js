import { Router } from "express";

import {
  getPendingListings,
  getPendingRoommatePosts,
  getPendingReviews,
  moderateListing,
  moderateRoommatePost,
  moderateReview
} from "../controllers/moderation.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/listings/pending", getPendingListings);
router.patch("/listings/:listingId", moderateListing);
router.get("/reviews/pending", getPendingReviews);
router.patch("/reviews/:reviewId", moderateReview);
router.get("/roommates/pending", getPendingRoommatePosts);
router.patch("/roommates/:postId", moderateRoommatePost);

export default router;
