import jwt from "jsonwebtoken";
import { normalizeRole } from "../utils/roleModelResolver.js";

const unauthorizedError = Object.assign(new Error("Unauthorized"), { status: 401 });

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(unauthorizedError);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const resolvedId = payload.sub || payload.id;
    if (!resolvedId) {
      return next(unauthorizedError);
    }

    req.user = {
      id: resolvedId,
      role: normalizeRole(payload.role),
      roleCode: payload.roleCode || payload.role,
      isVerifiedStudent: Boolean(payload.isVerifiedStudent)
    };
    return next();
  } catch (error) {
    return next(unauthorizedError);
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  const allowed = roles.map((role) => normalizeRole(role));
  if (!req.user || !allowed.includes(req.user.role)) {
    return next(Object.assign(new Error("Forbidden"), { status: 403 }));
  }
  return next();
};

export const requireSelfOrAdmin = (paramId = "id") => (req, res, next) => {
  if (!req.user) {
    return next(unauthorizedError);
  }

  const isSelf = String(req.user.id) === String(req.params[paramId]);
  const isAdmin = req.user.role === "admin";

  if (!isSelf && !isAdmin) {
    return next(Object.assign(new Error("Forbidden"), { status: 403 }));
  }

  return next();
};

export const requireVerifiedStudent = (req, res, next) => {
  const isAllowed = req.user?.role === "student" && req.user?.isVerifiedStudent;
  if (!isAllowed) {
    return next(
      Object.assign(
        new Error("Only verified students can perform this action."),
        { status: 403 }
      )
    );
  }
  return next();
};
