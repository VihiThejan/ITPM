import { Router } from "express";

import {
  deleteStudent,
  getAllStudents,
  getStudentById,
  registerStudent,
  updateStudent
} from "../controllers/students.controller.js";
import { requireAuth, requireRole, requireSelfOrAdmin } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { studentRegisterSchema } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", validateRequest(studentRegisterSchema), registerStudent);
router.get("/", requireAuth, requireRole("admin"), getAllStudents);
router.get("/:id", requireAuth, requireSelfOrAdmin(), getStudentById);
router.put("/:id", requireAuth, requireSelfOrAdmin(), updateStudent);
router.delete("/:id", requireAuth, requireRole("admin"), deleteStudent);

export default router;
