import express from "express";
import cors from "cors";
import morgan from "morgan";

import listingsRoutes from "./routes/listings.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import bookmarksRoutes from "./routes/bookmarks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import historyRoutes from "./routes/history.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import hostelOwnersRoutes from "./routes/hostelOwners.routes.js";
import adminsRoutes from "./routes/admins.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import moderationRoutes from "./routes/moderation.routes.js";
import roommatesRoutes from "./routes/roommates.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*"
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/listings", listingsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/hostel-owners", hostelOwnersRoutes);
app.use("/api/admin", adminsRoutes);
app.use("/api/admin/moderation", moderationRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/roommates", roommatesRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Unexpected server error";
  res.status(status).json({ message });
});

export default app;
