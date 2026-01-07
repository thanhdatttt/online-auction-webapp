import express from "express";

import {
    createAuction,
    rejectBidder,
    answerComment,
    appendDescription,
 } from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/auctions/", createAuction);
router.post("/auctions/:auctionId/reject-bidder", rejectBidder);
router.post("/auctions/:auctionId/comment/:commentId", answerComment);
router.put("/auctions/:auctionId/description", appendDescription);

export default router;
