import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    {
      role: user.role,
      isVerifiedStudent: user.isVerifiedStudent
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: "7d"
    }
  );

const toAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerifiedStudent: user.isVerifiedStudent
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

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return next(Object.assign(new Error("User not found."), { status: 404 }));
    }

    res.status(200).json({ user: toAuthResponse(user) });
  } catch (error) {
    next(error);
  }
};
