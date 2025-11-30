import express from "express";
import { authMe } from "../controllers/user.controller.js";
import { createAuction } from "../controllers/auction.controller.js";

const router = express.Router();

router.get("/me", authMe);
router.post("/create-auction", createAuction);

export default router;