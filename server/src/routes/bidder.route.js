import express from "express";
import { requestRole } from "../controllers/bidder.controller.js";

const router = express.Router();

router.post("/requestRole", requestRole);

export default router;