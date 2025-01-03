import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { fetchImage, platformData } from "../controllers/platformController";

const router = express.Router();

router.get("/platform/data", protect as any, platformData as any);
router.get("/fetchimg", fetchImage as any);

export default router;
