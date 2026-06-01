import express from "express";
import {
  registerUser,
  loginUser,
  updateUsernames,
  verify,
  setUserAvatar,
  deleteUser,
  updateUserDetails,
  userId,
  setTotalSolved,
  syncAllStats,
  getAnalytics,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/usernames", protect, updateUsernames);
router.put("/update", protect, updateUserDetails);
router.put("/pfp", protect, setUserAvatar);
router.put("/totalsolved", protect, setTotalSolved);

router.get("/verify", protect, verify);
router.get("/id", protect, userId);
router.get("/analytics", protect, getAnalytics);

router.post("/sync", protect, syncAllStats);

router.delete("/usernames", protect, deleteUser);
export default router;
