import express from "express";
import {
  getAuctionDetail,
  getComments,
  getHistoryBid,
  getSimilarItems,
} from "../controllers/auction.controller.js";

import { getAuctions } from "../controllers/auction.controller.js";

import { getCategories } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/auctions", getAuctions);

router.get("/categories", getCategories);

router.get("/auctions/:auctionId", getAuctionDetail);

router.get("/auctions/:auctionId/history", getHistoryBid);

router.get("/auctions/:auctionId/comment", getComments);

router.get("/auctions/:auctionId/similar-items", getSimilarItems);

export default router;
