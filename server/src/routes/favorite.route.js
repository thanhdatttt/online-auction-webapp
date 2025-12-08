import express from "express";
import {addToFavorite, removeFromFavorite, getFavorites, checkFavorite} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/:auctionId", addToFavorite);
router.put("/:auctionId", removeFromFavorite);
router.get("/", getFavorites);
router.get("/:auctionId", checkFavorite);
export default router;