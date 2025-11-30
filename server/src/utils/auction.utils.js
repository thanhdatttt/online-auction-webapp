import mongoose from "mongoose";
import AuctionConfig from "../models/AuctionConfig.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
// singleton....
export const initAuctionConfig = async () => {
  try {
    let config = await AuctionConfig.findOne();
    if (!config) {
      config = new AuctionConfig({
        extendThreshold: 300,
        extendDuration: 600,
      });
      await config.save();
    }
  } catch (err) {
    throw err;
  }
};

export const historyBidding = async (newBid, curWinnerId) => {
  const fullBidInfo = await newBid.populate("bidderId", "firstName lastName");

  console.log(fullBidInfo.bidMaxAmount);

  const user = fullBidInfo.bidderId;

  return {
    _id: fullBidInfo._id,
    bidderId: user ? user._id : null,
    fullName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
    bidEntryAmount: fullBidInfo.bidEntryAmount,
    bidTime: fullBidInfo.bidTime,
    curWinnerId: curWinnerId,
  };
};
