import express from "express";
import { register, login, logout, refreshToken, getGoogleUrl, googleCallback, getFacebookUrl, facebookCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.get("/google/url", getGoogleUrl);
router.get("/google/callback", googleCallback);

router.get("/facebook/url", getFacebookUrl);
router.get("/facebook/callback", facebookCallback);

export default router;