import { Router } from "express";

import {
  createReview,
  getReviewsByListingId
} from "../controllers/reviews.controller.js";
import {
  attachOptionalAuth,
  requireAuth,
  requireRole,
  requireVerifiedStudent
} from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createReviewSchema,
  reviewQuerySchema
} from "../validators/reviews.validators.js";

const router = Router();

router.get(
  "/",
  attachOptionalAuth,
  validateRequest(reviewQuerySchema, "query"),
  getReviewsByListingId
);
router.post(
  "/",
  requireAuth,
  requireRole("student"),
  requireVerifiedStudent,
  validateRequest(createReviewSchema),
  createReview
);

export default router;
