import express from "express";

import {
  placeBid,
  getAuctionDetail,
  addComment,
  answerComment,
  createAuction,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/", createAuction);
router.post("/:auctionId/bid", placeBid);
router.get("/:auctionId", getAuctionDetail);
router.post("/:auctionId/comment", addComment);
router.post("/:auctionId/comment/:commentId", answerComment);
export default router;
