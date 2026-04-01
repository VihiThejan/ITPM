import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Otp from "../models/Otp.js";
import { findRoleUserByEmail, normalizeRole } from "../utils/roleModelResolver.js";
import { sendOtpEmail } from "../utils/emailService.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: normalizeRole(user.role),
      roleCode: user.role,
      isVerifiedStudent: normalizeRole(user.role) === "student" && Boolean(user.isVerified)
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );

export const generateAndSendOtp = async (userId, modelName, email, firstName) => {
  await Otp.deleteMany({ userId, userModel: modelName });

  const rawOtp = generateOtp();
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(rawOtp, salt);

  await Otp.create({
    userId,
    userModel: modelName,
    otp: hashedOtp
  });

  await sendOtpEmail(email, firstName, rawOtp);
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { user, modelName } = await findRoleUserByEmail(email);
    if (!user || modelName === "Admin") {
      return next(Object.assign(new Error("No account found with this email."), { status: 404 }));
    }

    if (user.isVerified) {
      return next(Object.assign(new Error("This account is already verified."), { status: 400 }));
    }

    await generateAndSendOtp(user._id, modelName, user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${user.email}. Valid for 10 minutes.`
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const { user, modelName } = await findRoleUserByEmail(email);
    if (!user || modelName === "Admin") {
      return next(Object.assign(new Error("No account found with this email."), { status: 404 }));
    }

    if (user.isVerified) {
      return next(Object.assign(new Error("Account is already verified. Please log in."), { status: 400 }));
    }

    const otpRecord = await Otp.findOne({ userId: user._id, userModel: modelName });
    if (!otpRecord) {
      return next(Object.assign(new Error("No OTP found. Please request a new one."), { status: 400 }));
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return next(Object.assign(new Error("OTP has expired. Please request a new one."), { status: 400 }));
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return next(Object.assign(new Error("Invalid OTP. Please try again."), { status: 400 }));
    }

    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: otpRecord._id });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Account verified successfully.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: normalizeRole(user.role),
        roleCode: user.role,
        isVerifiedStudent: normalizeRole(user.role) === "student"
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { user, modelName } = await findRoleUserByEmail(email);
    if (!user || modelName === "Admin") {
      return next(Object.assign(new Error("No account found with this email."), { status: 404 }));
    }

    if (user.isVerified) {
      return next(Object.assign(new Error("Account is already verified."), { status: 400 }));
    }

    const existingOtp = await Otp.findOne({ userId: user._id, userModel: modelName });
    if (existingOtp) {
      const secondsSinceCreation = (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
      if (secondsSinceCreation < 60) {
        const waitSeconds = Math.ceil(60 - secondsSinceCreation);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} second(s) before requesting a new OTP.`
        });
      }
    }

    await generateAndSendOtp(user._id, modelName, user.email, user.firstName);

    res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${user.email}.`
    });
  } catch (error) {
    next(error);
  }
};
