import { response } from "express";
import Rating from "../models/Rating.js";

export const createRating = async (req, res) => {
  try {
    const rater = req.user;

    const { auctionId, ratedUserId, reviewContent, rateType } = req.body;

    const rating = await Rating.create({
      raterId: rater._id,
      ratedUserId: ratedUserId,
      auctionId: auctionId,
      reviewContent: reviewContent,
      rateType: rateType,
    });

    return res
      .status(200)
      .json({ message: "Rated successfully.", rating: rating });
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
