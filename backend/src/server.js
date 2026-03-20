import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Please check backend/.env.");
}

const startServer = async () => {
  await connectDb(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
