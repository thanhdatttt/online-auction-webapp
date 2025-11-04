import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

export default router;