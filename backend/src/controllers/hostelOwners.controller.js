import HostelOwner from "../models/HostelOwner.js";
import { generateAndSendOtp } from "./otp.controller.js";

const sanitizeOwner = (owner) => ({
  id: owner._id,
  firstName: owner.firstName,
  lastName: owner.lastName,
  name: `${owner.firstName} ${owner.lastName}`,
  email: owner.email,
  phoneNumber: owner.phoneNumber,
  address: owner.address,
  gender: owner.gender,
  rating: owner.rating,
  role: "owner",
  isVerified: Boolean(owner.isVerified)
});

export const registerHostelOwner = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, address, gender, password } = req.body;

    const existing = await HostelOwner.findOne({ email });
    if (existing) {
      return next(Object.assign(new Error("A hostel owner account with this email already exists."), { status: 409 }));
    }

    const owner = await HostelOwner.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      gender,
      password
    });

    await generateAndSendOtp(owner._id, "HostelOwner", owner.email, owner.firstName);

    res.status(201).json({
      success: true,
      message: `Registration successful. A 6-digit verification code has been sent to ${owner.email}.`,
      user: sanitizeOwner(owner)
    });
  } catch (error) {
    next(error);
  }
};

export const loginHostelOwner = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const owner = await HostelOwner.findOne({ email }).select("+password");
    if (!owner || !(await owner.matchPassword(password))) {
      return next(Object.assign(new Error("Invalid email or password."), { status: 401 }));
    }

    if (!owner.isVerified) {
      return res.status(403).json({
        success: false,
        isVerified: false,
        message: "Account not verified. Please check your email for OTP verification."
      });
    }

    req.roleUser = owner;
    return next();
  } catch (error) {
    next(error);
  }
};

export const getAllHostelOwners = async (req, res, next) => {
  try {
    const owners = await HostelOwner.find();
    res.status(200).json({ success: true, count: owners.length, data: owners.map(sanitizeOwner) });
  } catch (error) {
    next(error);
  }
};

export const getHostelOwnerById = async (req, res, next) => {
  try {
    const owner = await HostelOwner.findById(req.params.id);
    if (!owner) {
      return next(Object.assign(new Error("Hostel owner not found."), { status: 404 }));
    }
    res.status(200).json({ success: true, data: sanitizeOwner(owner) });
  } catch (error) {
    next(error);
  }
};

export const updateHostelOwner = async (req, res, next) => {
  try {
    delete req.body.role;
    delete req.body.password;
    delete req.body.rating;
    delete req.body.isVerified;

    const owner = await HostelOwner.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!owner) {
      return next(Object.assign(new Error("Hostel owner not found."), { status: 404 }));
    }

    res.status(200).json({ success: true, message: "Hostel owner updated successfully.", data: sanitizeOwner(owner) });
  } catch (error) {
    next(error);
  }
};

export const deleteHostelOwner = async (req, res, next) => {
  try {
    const owner = await HostelOwner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return next(Object.assign(new Error("Hostel owner not found."), { status: 404 }));
    }

    res.status(200).json({ success: true, message: "Hostel owner deleted successfully." });
  } catch (error) {
    next(error);
  }
};
