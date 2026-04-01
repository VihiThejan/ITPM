import dotenv from "dotenv";

import { connectDb } from "../config/db.js";
import Admin from "../models/Admin.js";
import HostelOwner from "../models/HostelOwner.js";
import Student from "../models/Student.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required for seeding role users.");
}

const run = async () => {
  await connectDb(MONGODB_URI);

  await Promise.all([
    Student.deleteMany({ email: { $in: ["it22990000@my.sliit.lk"] } }),
    HostelOwner.deleteMany({ email: { $in: ["owner.demo@gmail.com"] } }),
    Admin.deleteMany({ email: { $in: ["admin.demo@gmail.com"] } })
  ]);

  await Student.create({
    firstName: "Demo",
    lastName: "Student",
    email: "it22990000@my.sliit.lk",
    phoneNumber: "0771234567",
    emergencyContact: "0771234568",
    address: "Malabe",
    gender: "Male",
    age: 22,
    password: "Student@123",
    isVerified: true
  });

  await HostelOwner.create({
    firstName: "Demo",
    lastName: "Owner",
    email: "owner.demo@gmail.com",
    phoneNumber: "0772234567",
    address: "Kaduwela",
    gender: "Female",
    password: "Owner@123",
    isVerified: true
  });

  await Admin.create({
    firstName: "System",
    lastName: "Admin",
    email: "admin.demo@gmail.com",
    password: "Admin@123"
  });

  console.log("Role user seed completed.");
  console.log("Student login: it22990000@my.sliit.lk / Student@123");
  console.log("Owner login: owner.demo@gmail.com / Owner@123");
  console.log("Admin login: admin.demo@gmail.com / Admin@123");
  process.exit(0);
};

run().catch((error) => {
  console.error("Role user seed failed", error);
  process.exit(1);
});
