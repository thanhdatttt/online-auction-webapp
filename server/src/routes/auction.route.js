import express from "express";

import {
  placeBid,
  addComment,
  answerComment,
  createAuction,
  rejectBidder,
  buyNow,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("", createAuction);

router.post("/:auctionId/bid", placeBid);
router.post("/:auctionId/buyout", buyNow);
router.post("/:auctionId/reject-bidder", rejectBidder);
router.post("/:auctionId/comment", addComment);
router.post("/:auctionId/comment/:commentId", answerComment);
export default router;
