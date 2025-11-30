import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import AuctionConfig from "../models/AuctionConfig.js";
import { historyBidding } from "../utils/auction.utils.js";
import mongoose from "mongoose";
export const bid = async (req, res) => {
  try {
    const now = new Date();

    const userId = req.user.id;

    const { bidMaxAmount } = req.body;

    const { auctionId } = req.params;

    const io = req.app.get("io");

    const auction = await Auction.findById(auctionId);

    if (!auction) throw new Error("Auction not found");

    if (auction.status === "ended" || now > auction.endTime) {
      throw new Error("This auction is already closed.");
    }

    const minBidMaxAmount = auction.winnerId
      ? auction.currentPrice + auction.gapPrice
      : auction.currentPrice;

    if (!bidMaxAmount || bidMaxAmount < minBidMaxAmount)
      return res
        .status(400)
        .json({ error: `Invalid bid. Min amount is ${minBidMaxAmount}` });

    if (auction.buyNowPrice && bidMaxAmount >= auction.buyNowPrice)
      return res
        .status(409)
        .json({ error: "Bidder should purchase outright now." });

    const auctionConfig = await AuctionConfig.findOne();

    if (
      auctionConfig &&
      auction.endTime - now <= auctionConfig.extendThreshold
    ) {
      auction.endTime = new Date(
        auction.endTime.getTime() + auctionConfig.extendDuration
      );
      io.to(`auction_${auctionId}`).emit("auctionExtended", auction.endTime);
    }

    let bidEntryAmount;
    let isNewWinner = false;

    if (!auction.winnerId) {
      isNewWinner = true;
      auction.winnerId = userId;
      auction.highestPrice = bidMaxAmount;
      auction.currentPrice = auction.currentPrice;
      bidEntryAmount = auction.currentPrice;
    } else {
      const currentMax = auction.highestPrice;
      const gap = auction.gapPrice;
      const minToWin = currentMax + gap;

      if (bidMaxAmount >= minToWin) {
        isNewWinner = true;
        auction.currentPrice = minToWin;
        auction.highestPrice = bidMaxAmount;
        auction.winnerId = userId;
        bidEntryAmount = auction.currentPrice;
      } else {
        isNewWinner = false;
        if (bidMaxAmount > currentMax) {
          auction.currentPrice = currentMax;
        } else {
          let potentialPrice = bidMaxAmount + gap;
          auction.currentPrice = Math.min(potentialPrice, currentMax);
        }
        bidEntryAmount = bidMaxAmount;
      }
    }

    const newBid = await Bid.create({
      auctionId: auctionId,
      bidderId: userId,
      bidEntryAmount: bidEntryAmount,
      bidMaxAmount: bidMaxAmount,
      bidTime: Date.now(),
      isWinner: isNewWinner,
    });

    io.to(`auction_${auctionId}`).emit("priceUpdate", {
      currentPrice: auction.currentPrice,
      winnerId: auction.winnerId,
      nextMinBid: auction.currentPrice + auction.gapPrice,
    });

    await auction.save();

    const historyData = await historyBidding(newBid, auction.winnerId);

    io.to(`auction_${auctionId}`).emit("historyUpdate", historyData);

    res
      .status(201)
      .json({ message: "Place bid successfully.", historyData: historyData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
