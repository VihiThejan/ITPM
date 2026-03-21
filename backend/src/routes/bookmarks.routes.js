import { Router } from "express";

import {
  createBookmark,
  deleteBookmark,
  getBookmarks
} from "../controllers/bookmarks.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { upsertBookmarkSchema } from "../validators/bookmarks.validators.js";
import { listingIdParamsSchema } from "../validators/listings.validators.js";

const router = Router();

router.use(requireAuth, requireRole("student"));

router.get("/", getBookmarks);
router.post("/", validateRequest(upsertBookmarkSchema), createBookmark);
router.delete(
  "/:listingId",
  validateRequest(listingIdParamsSchema, "params"),
  deleteBookmark
);

export default router;
