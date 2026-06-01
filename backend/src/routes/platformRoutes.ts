import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { fetchImages, platformData } from "../controllers/platformController";

const router = express.Router();

router.get("/data", protect, platformData);

router.post("/img", protect, fetchImages);

export default router;
