import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import platformRoutes from "./routes/platformRoutes";
import rateLimit from "express-rate-limit";

import {
  leaderboardController,
  previewPlatformData,
} from "./controllers/publicControllers";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://dsastats.zreo.xyz",
      "https://dsastats.fun",
      "https://www.dsastats.fun",
      "https://dsastat.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 30 * 1000, // 1 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

// let requestCounter = 0;

// // Middleware to log all incoming requests
// app.use((req, res, next) => {
//   requestCounter++;
//   console.log(`Request #${requestCounter} - ${req.method} ${req.originalUrl}`);
//   next();
// });

app.get("/", (_req, res) => {
  res.send("DSAStats API");
});

app.use("/api/user", userRoutes);

app.use("/api/platform", platformRoutes);

app.get("/preview/:userid", previewPlatformData as any);

app.post("/leaderboard/:page", leaderboardController);

app.use((_req, res) => {
  res.status(404).json({ message: "Invalid route" });
});

export default app;
