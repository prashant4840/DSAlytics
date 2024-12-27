import express from "express";
import { protect } from "../middlewares/authMiddleware";
import pfpAggrigate from "../controllers/platformController";

const router = express.Router();

router.get("/platform/pfp", protect as any, pfpAggrigate as any);

export default router;
