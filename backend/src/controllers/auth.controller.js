import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import HostelOwner from "../models/HostelOwner.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import { normalizeRole } from "../utils/roleModelResolver.js";

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: normalizeRole(user.role),
      roleCode: user.role,
      isVerifiedStudent: user.isVerifiedStudent
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: "7d"
    }
  );

const signRoleToken = (roleUser) =>
  jwt.sign(
    {
      id: roleUser._id.toString(),
      role: normalizeRole(roleUser.role),
      roleCode: roleUser.role,
      isVerifiedStudent:
        normalizeRole(roleUser.role) === "student" && Boolean(roleUser.isVerified)
    },
    process.env.JWT_SECRET,
    {
      subject: roleUser._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );

const toAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerifiedStudent: user.isVerifiedStudent
});

const toRoleAuthResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  role: normalizeRole(user.role),
  roleCode: user.role,
  isVerifiedStudent: normalizeRole(user.role) === "student" && Boolean(user.isVerified)
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(Object.assign(new Error("Email is already in use."), { status: 409 }));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      phone,
      isVerifiedStudent: role === "student"
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: toAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(Object.assign(new Error("Invalid email or password."), { status: 401 }));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(Object.assign(new Error("Invalid email or password."), { status: 401 }));
    }

    const token = signToken(user);

    res.status(200).json({
      token,
      user: toAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const loginRole = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const roleKey = String(role || "").toLowerCase();
    const roleModelMap = {
      student: Student,
      owner: HostelOwner,
      admin: Admin
    };

    const Model = roleModelMap[roleKey];
    if (!Model) {
      return next(Object.assign(new Error("Invalid role."), { status: 400 }));
    }

    const user = await Model.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return next(Object.assign(new Error("Invalid email or password."), { status: 401 }));
    }

    if (roleKey !== "admin" && !user.isVerified) {
      return res.status(403).json({
        success: false,
        isVerified: false,
        message: "Account not verified. Please verify your OTP first."
      });
    }

    const token = signRoleToken(user);

    res.status(200).json({
      success: true,
      token,
      user: toRoleAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (user) {
      res.status(200).json({ user: toAuthResponse(user) });
      return;
    }

    const roleModelMap = {
      student: Student,
      owner: HostelOwner,
      admin: Admin
    };

    const Model = roleModelMap[req.user.role];
    if (!Model) {
      return next(Object.assign(new Error("User not found."), { status: 404 }));
    }

    const roleUser = await Model.findById(req.user.id).lean();
    if (!roleUser) {
      return next(Object.assign(new Error("User not found."), { status: 404 }));
    }

    res.status(200).json({ user: toRoleAuthResponse(roleUser) });
  } catch (error) {
    next(error);
  }
};
