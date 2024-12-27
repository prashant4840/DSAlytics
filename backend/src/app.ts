import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import platformRoutes from "./routes/platformRoutes";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

app.get("/", (_req, res) => {
  res.send("DSA Stat API");
});

app.use("/api/user", userRoutes);
app.use("/api", platformRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Invalid route" });
});

export default app;
