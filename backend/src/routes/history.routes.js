import { Router } from "express";

import { getRecentlyViewed, trackViewed } from "../controllers/history.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { historyQuerySchema, trackViewedSchema } from "../validators/history.validators.js";

const router = Router();

router.get(
  "/viewed",
  requireAuth,
  requireRole("student"),
  validateRequest(historyQuerySchema, "query"),
  getRecentlyViewed
);

router.post(
  "/viewed",
  requireAuth,
  requireRole("student"),
  validateRequest(trackViewedSchema),
  trackViewed
);

export default router;
