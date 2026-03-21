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
    },
    {
      title: "Comfort Single Studio - Athurugiriya Junction",
      locationText: "Athurugiriya Junction, Malabe",
      distanceFromSliitKm: 3.4,
      rent: 32000,
      roomType: "single",
      facilities: ["wifi", "security", "parking"],
      photos: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 31
    },
    {
      title: "Budget Shared Rooms - Hokandara",
      locationText: "Hokandara, Malabe",
      distanceFromSliitKm: 4.9,
      rent: 15000,
      roomType: "shared",
      facilities: ["wifi", "laundry"],
      photos: ["https://images.unsplash.com/photo-1484101403633-562f891dc89a"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 21
    },
    {
      title: "Premium Student Residence - Thalahena",
      locationText: "Thalahena, Malabe",
      distanceFromSliitKm: 1.2,
      rent: 45000,
      roomType: "single",
      facilities: ["wifi", "security", "parking", "laundry"],
      photos: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 44
    },
    {
      title: "Meals Included Shared House - Koswatta",
      locationText: "Koswatta, Battaramulla",
      distanceFromSliitKm: 6.1,
      rent: 22000,
      roomType: "shared",
      facilities: ["wifi", "meals", "security"],
      photos: ["https://images.unsplash.com/photo-1464890100898-a385f744067f"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 18
    },
    {
      title: "Quiet Single Annex - Arangala",
      locationText: "Arangala, Malabe",
      distanceFromSliitKm: 3.1,
      rent: 26000,
      roomType: "single",
      facilities: ["wifi", "parking"],
      photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 27
    },
    {
      title: "Group-Friendly Shared Boarding - Kottawa",
      locationText: "Kottawa, Colombo",
      distanceFromSliitKm: 8.3,
      rent: 17000,
      roomType: "shared",
      facilities: ["wifi", "meals", "laundry"],
      photos: ["https://images.unsplash.com/photo-1484154218962-a197022b5858"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 15
    },
    {
      title: "Secure Single Room - Battaramulla",
      locationText: "Battaramulla",
      distanceFromSliitKm: 7.4,
      rent: 30000,
      roomType: "single",
      facilities: ["wifi", "security"],
      photos: ["https://images.unsplash.com/photo-1501183638710-841dd1904471"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 23
    },
    {
      title: "Parking + Laundry Shared Rooms - Talangama",
      locationText: "Talangama North",
      distanceFromSliitKm: 5.8,
      rent: 20000,
      roomType: "shared",
      facilities: ["wifi", "parking", "laundry"],
      photos: ["https://images.unsplash.com/photo-1494526585095-c41746248156"],
      availability: "available",
      whatsappNumber: "94770001122",
      ownerId: owner._id,
      moderationStatus: "approved",
      viewCount: 20
    }
  ]);

  await Review.create([
    {
      listingId: listings[0]._id,
      studentId: student._id,
      rating: 5,
      comment: "Safe environment and fast WiFi for online lectures.",
      status: "approved"
    },
    {
      listingId: listings[2]._id,
      studentId: student._id,
      rating: 4,
      comment: "Clean place and easy bus access to campus.",
      status: "approved"
    },
    {
      listingId: listings[4]._id,
      studentId: student._id,
      rating: 5,
      comment: "Great security and very quiet for studying.",
      status: "approved"
    },
    {
      listingId: listings[7]._id,
      studentId: student._id,
      rating: 4,
      comment: "Good value with meals included.",
      status: "approved"
    }
  ]);

  await Bookmark.create([
    {
      studentId: student._id,
      listingId: listings[0]._id
    },
    {
      studentId: student._id,
      listingId: listings[4]._id
    }
  ]);

  console.log("Seed completed.");
  console.log("Student login: nimali@my.sliit.lk / Student@123");
  console.log("Owner login: kamal.owner@gmail.com / Owner@123");
  process.exit(0);
};

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
