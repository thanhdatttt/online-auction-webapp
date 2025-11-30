import express from "express";

import {
  placeBid,
  getAuctionDetail,
  addComment,
  answerComment,
  createAuction,
  getComments,
  getBids,
  rejectBidder,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("", createAuction);
router.get("/:auctionId/bid", getBids);
router.post("/:auctionId/bid", placeBid);
router.post("/:auctionId/reject-bidder", rejectBidder);
router.get("/:auctionId", getAuctionDetail);
router.post("/:auctionId/comment", addComment);
router.get("/:auctionId/comment", getComments);
router.post("/:auctionId/comment/:commentId", answerComment);
export default router;
