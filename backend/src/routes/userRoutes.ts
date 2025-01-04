import express from "express";
import {
  registerUser,
  loginUser,
  updateUsernames,
  verify,
  setUserAvatar,
  deleteUser,
  updateUserDetails,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser as any);
router.post("/login", loginUser as any);
router.put("/usernames", protect as any, updateUsernames as any);
router.put("/update", protect as any, updateUserDetails as any);

router.put("/pfp", protect as any, setUserAvatar as any);
router.get("/verify", protect as any, verify as any);

router.delete("/usernames", protect as any, deleteUser as any);
export default router;
