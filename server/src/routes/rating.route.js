import { Router } from "express";
import { createRating } from "../controllers/rating.controllers.js";
const router = Router();

router.post("", createRating);

export default router;
