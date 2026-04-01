import { Router } from "express";

import {
  createRoommatePost,
  getApprovedRoommatePosts
} from "../controllers/roommates.controller.js";
import {
  requireAuth,
  requireRole,
  requireVerifiedStudent
} from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { createRoommatePostSchema } from "../validators/roommates.validators.js";

const router = Router();

router.get("/", requireAuth, requireRole("student"), requireVerifiedStudent, getApprovedRoommatePosts);
router.post(
  "/",
  requireAuth,
  requireRole("student"),
  requireVerifiedStudent,
  validateRequest(createRoommatePostSchema),
  createRoommatePost
);

export default router;
