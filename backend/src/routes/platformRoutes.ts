import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { fetchImages, platformData } from "../controllers/platformController";

const router = express.Router();

router.get("/platform/data", protect as any, platformData as any);

router.post("/platformimg", fetchImages as any);

export default router;
