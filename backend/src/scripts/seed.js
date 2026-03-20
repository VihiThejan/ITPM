import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { connectDb } from "../config/db.js";
import User from "../models/User.js";
import BoardingListing from "../models/BoardingListing.js";
import Review from "../models/Review.js";
import Bookmark from "../models/Bookmark.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required for seeding.");
}

const run = async () => {
  await connectDb(MONGODB_URI);

  await Promise.all([
    User.deleteMany({}),
    BoardingListing.deleteMany({}),
    Review.deleteMany({}),
    Bookmark.deleteMany({})
  ]);

  const studentPasswordHash = await bcrypt.hash("Student@123", 10);
  const ownerPasswordHash = await bcrypt.hash("Owner@123", 10);

  const [student, owner] = await User.create([
    {
      name: "Nimali Perera",
      email: "nimali@my.sliit.lk",
      passwordHash: studentPasswordHash,
      role: "student",
      isVerifiedStudent: true,
      phone: "+94771234567"
    },
    {
      name: "Kamal Silva",
      email: "kamal.owner@gmail.com",
      passwordHash: ownerPasswordHash,
      role: "owner",
      isVerifiedStudent: false,
      phone: "+94770001122"
    }
  ]);

  const listings = await BoardingListing.create([
    {
      title: "Serene Single Room - Kaduwela Road",
      locationText: "Kaduwela Road, Malabe",
      distanceFromSliitKm: 1.8,
      rent: 28000,
      roomType: "single",
      facilities: ["wifi", "security", "laundry"],
      photos: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 19
    },
    {
      title: "Shared Student Annex - New Kandy Road",
      locationText: "New Kandy Road, Malabe",
      distanceFromSliitKm: 2.6,
      rent: 18000,
      roomType: "shared",
      facilities: ["wifi", "meals", "parking"],
      photos: ["https://images.unsplash.com/photo-1493666438817-866a91353ca9"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 12
    }
  ]);

  await Review.create([
    {
      listingId: listings[0]._id,
      studentId: student._id,
      rating: 5,
      comment: "Safe environment and fast WiFi for online lectures.",
      status: "approved"
    }
  ]);

  await Bookmark.create({
    studentId: student._id,
    listingId: listings[0]._id
  });

  console.log("Seed completed.");
  console.log("Student login: nimali@my.sliit.lk / Student@123");
  console.log("Owner login: kamal.owner@gmail.com / Owner@123");
  process.exit(0);
};

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
