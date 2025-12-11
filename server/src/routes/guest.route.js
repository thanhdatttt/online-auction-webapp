import express from "express";
import {
  getAuctionDetail,
  getComments,
  getHistoryBid,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.get("/auctions/:auctionId", getAuctionDetail);

router.get("/auctions/:auctionId/history", getHistoryBid);

router.get("/auctions/:auctionId/comment", getComments);
export default router;
