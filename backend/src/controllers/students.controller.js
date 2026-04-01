import Student from "../models/Student.js";
import { generateAndSendOtp } from "./otp.controller.js";

const sanitizeStudent = (student) => ({
  id: student._id,
  firstName: student.firstName,
  lastName: student.lastName,
  name: `${student.firstName} ${student.lastName}`,
  email: student.email,
  phoneNumber: student.phoneNumber,
  address: student.address,
  gender: student.gender,
  age: student.age,
  emergencyContact: student.emergencyContact,
  role: "student",
  isVerifiedStudent: Boolean(student.isVerified)
});

export const registerStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, address, gender, age, password, emergencyContact } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return next(Object.assign(new Error("A student with this email already exists."), { status: 409 }));
    }

    const student = await Student.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      gender,
      age,
      password,
      emergencyContact
    });

    await generateAndSendOtp(student._id, "Student", student.email, student.firstName);

    res.status(201).json({
      success: true,
      message: `Registration successful. A 6-digit verification code has been sent to ${student.email}.`,
      user: sanitizeStudent(student)
    });
  } catch (error) {
    next(error);
  }
};

export const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select("+password");
    if (!student || !(await student.matchPassword(password))) {
      return next(Object.assign(new Error("Invalid email or password."), { status: 401 }));
    }

    if (!student.isVerified) {
      return res.status(403).json({
        success: false,
        isVerified: false,
        message: "Account not verified. Please check your email for OTP verification."
      });
    }

    req.roleUser = student;
    return next();
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, count: students.length, data: students.map(sanitizeStudent) });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(Object.assign(new Error("Student not found."), { status: 404 }));
    }
    res.status(200).json({ success: true, data: sanitizeStudent(student) });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    delete req.body.role;
    delete req.body.password;

    const student = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!student) {
      return next(Object.assign(new Error("Student not found."), { status: 404 }));
    }

    res.status(200).json({ success: true, message: "Student updated successfully.", data: sanitizeStudent(student) });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return next(Object.assign(new Error("Student not found."), { status: 404 }));
    }
    res.status(200).json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    next(error);
  }
};
