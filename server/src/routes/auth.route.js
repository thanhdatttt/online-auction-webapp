import express from "express";
import { register, login, logout, refreshToken, verifyAndSave } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyAndSave);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;