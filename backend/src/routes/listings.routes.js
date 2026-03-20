import { Router } from "express";

import { getListingById, getListings } from "../controllers/listings.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  listingIdParamsSchema,
  listingQuerySchema
} from "../validators/listings.validators.js";

const router = Router();

router.get("/", validateRequest(listingQuerySchema, "query"), getListings);
router.get(
  "/:listingId",
  validateRequest(listingIdParamsSchema, "params"),
  getListingById
);

export default router;
