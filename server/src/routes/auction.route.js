import express from "express";

import {
  placeBid,
  addComment,
  buyNow,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/:auctionId/bid", placeBid);
router.post("/:auctionId/buyout", buyNow);

router.post("/:auctionId/comment", addComment);

export default router;
