import { Router } from "express";

import {
  deleteHostelOwner,
  getAllHostelOwners,
  getHostelOwnerById,
  registerHostelOwner,
  updateHostelOwner
} from "../controllers/hostelOwners.controller.js";
import { requireAuth, requireRole, requireSelfOrAdmin } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { ownerRegisterSchema } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", validateRequest(ownerRegisterSchema), registerHostelOwner);
router.get("/", requireAuth, requireRole("admin"), getAllHostelOwners);
router.get("/:id", requireAuth, requireSelfOrAdmin(), getHostelOwnerById);
router.put("/:id", requireAuth, requireSelfOrAdmin(), updateHostelOwner);
router.delete("/:id", requireAuth, requireRole("admin"), deleteHostelOwner);

export default router;
