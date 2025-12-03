import express from "express";
import {addToFavorite, removeFromFavorite, getUserFavorites} from "../controllers/list.controller.js";

const router = express.Router();

router.post("/me/favorites", addToFavorite);
export default router;