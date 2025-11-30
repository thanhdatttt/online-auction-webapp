import express from "express";

import { placeBid, getAuction } from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/:auctionId/bid", bid);
router.get("/:auctionId/bid", getAuction);
export default router;
