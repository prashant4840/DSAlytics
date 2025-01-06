import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import platformRoutes from "./routes/platformRoutes";
import rateLimit from "express-rate-limit";
import { previewPlatformData } from "./controllers/platformController";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 25, // limit each IP to 25 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

app.get("/", (_req, res) => {
  res.send("DSAStats API");
});

app.use("/api/user", userRoutes);
app.use("/api", platformRoutes);
app.get("/preview/:userid", previewPlatformData as any);

app.use((_req, res) => {
  res.status(404).json({ message: "Invalid route" });
});

export default app;
