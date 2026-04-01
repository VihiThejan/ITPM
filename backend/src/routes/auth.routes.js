import { Router } from "express";

import { getCurrentUser, login, loginRole, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema, roleLoginSchema } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/login/role", validateRequest(roleLoginSchema), loginRole);
router.get("/me", requireAuth, getCurrentUser);

export default router;
