import express from "express";
import { register, login, logout, refreshToken, getGoogleUrl, googleCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.get("/google/url", getGoogleUrl);
router.get("/google/callback", googleCallback);

export default router;