import express from "express";

import {
  placeBid,
  addComment,
  answerComment,
  createAuction,
  rejectBidder,
  buyNow,
  getAuctions,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/create", createAuction);
router.get("", getAuctions);
router.get("/:auctionId/bid", getBids);

router.post("/:auctionId/bid", placeBid);
router.post("/:auctionId/buyout", buyNow);
router.post("/:auctionId/reject-bidder", rejectBidder);
router.post("/:auctionId/comment", addComment);
router.post("/:auctionId/comment/:commentId", answerComment);
export default router;
