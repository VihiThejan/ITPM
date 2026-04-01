import jwt from "jsonwebtoken";
import { normalizeRole } from "../utils/roleModelResolver.js";

const unauthorizedError = Object.assign(new Error("Unauthorized"), { status: 401 });

const decodeTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const resolvedId = payload.sub || payload.id;
  if (!resolvedId) {
    return null;
  }

  return {
    id: resolvedId,
    role: normalizeRole(payload.role),
    roleCode: payload.roleCode || payload.role,
    isVerifiedStudent: Boolean(payload.isVerifiedStudent)
  };
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    const user = decodeTokenFromHeader(authHeader);
    if (!user) {
      return next(unauthorizedError);
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(unauthorizedError);
  }
};

export const attachOptionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  try {
    const user = decodeTokenFromHeader(authHeader);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Ignore invalid optional auth and continue as guest.
  }

  return next();
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
