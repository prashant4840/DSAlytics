import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { fetchImages, platformData } from "../controllers/platformController";

const router = express.Router();

router.get("/data", protect as any, platformData as any);

router.post("/img", fetchImages as any);

export default router;
