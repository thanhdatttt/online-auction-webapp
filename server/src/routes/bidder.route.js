import express from "express";
import { auth } from "../middlewares/auth";
import { requestRole } from "../controllers/bidder.controller";

const router = express.Router();

router.post("/requestRole", auth, requestRole);

export default router;