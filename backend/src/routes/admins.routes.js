import { Router } from "express";

import { deleteAdmin, getAdminById, getAllAdmins } from "../controllers/admins.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), getAllAdmins);
router.get("/:id", requireAuth, requireRole("admin"), getAdminById);
router.delete("/:id", requireAuth, requireRole("admin"), deleteAdmin);

export default router;
