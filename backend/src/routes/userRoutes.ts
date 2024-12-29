import express from "express";
import {
  registerUser,
  loginUser,
  updateUsernames,
  verify,
  setUserAvatar,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser as any);
router.post("/login", loginUser as any);
router.put("/usernames", protect as any, updateUsernames as any);

router.put("/pfp", protect as any, setUserAvatar as any);
router.post("/verify", protect as any, verify as any);

export default router;
