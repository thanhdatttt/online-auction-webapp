import express from "express";
import {addToFavorite, removeFromFavorite, getFavorites, checkFavorite} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/", addToFavorite);
router.post("/:auctionId", removeFromFavorite);
router.get("/", getFavorites);
router.get("/:auctionId", checkFavorite);
export default router;