import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import platformRoutes from "./routes/platformRoutes";
import rateLimit from "express-rate-limit";

import {
  leaderboardController,
  previewPlatformData,
} from "./controllers/publicControllers";

dotenv.config();

// Validate critical env vars at startup
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is not set.");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: "Too many requests from this IP, please try again after 1 minute",
});

app.use(limiter);

app.get("/", (_req, res) => {
  res.send("DEVlytics API");
});

app.use("/api/user", userRoutes);

app.use("/api/platform", platformRoutes);

app.get("/preview/:userid", previewPlatformData as any);

app.post("/leaderboard/:page", leaderboardController);

app.use((_req, res) => {
  res.status(404).json({ message: "Invalid route" });
});

export default app;
