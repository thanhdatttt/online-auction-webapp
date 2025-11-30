import express from "express";
import { register, login, logout, refreshToken, verifyOTP, createUser, getGoogleUrl, googleCallback, getFacebookUrl, facebookCallback } from "../controllers/auth.controller.js";
import { changePassword, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { auth, authOTP } from "../middlewares/auth.js";

const router = express.Router();

// register -> verify-otp -> create-user

router.post("/register", register);
router.post("/create-user", authOTP, createUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

router.patch("/change-password", auth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authOTP, resetPassword);

router.get("/google/url", getGoogleUrl);
router.get("/google/callback", googleCallback);

router.get("/facebook/url", getFacebookUrl);
router.get("/facebook/callback", facebookCallback);

export default router;