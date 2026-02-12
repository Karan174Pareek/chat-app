import express from "express";
import {
  login,
  logout,
  resendOtp,
  signup,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);

router.put("/Update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
export default router;
