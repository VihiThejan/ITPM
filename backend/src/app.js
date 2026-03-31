import express from "express";
import cors from "cors";
import morgan from "morgan";

import listingsRoutes from "./routes/listings.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import bookmarksRoutes from "./routes/bookmarks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import historyRoutes from "./routes/history.routes.js";

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

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Unexpected server error";
  res.status(status).json({ message });
});

export default app;
