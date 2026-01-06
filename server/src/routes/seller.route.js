import express from "express";

import { appendDescription } from "../controllers/auction.controller.js";

const router = express.Router();

router.put("/auctions/:auctionId/description", appendDescription);

export default router;
