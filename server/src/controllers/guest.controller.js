import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import Comment from "../models/Comment.js";
import RejectedBidder from "../models/RejectedBidder.js";

export const getAuctionDetail = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    if (!auction) return res.status(404).json({ message: "NOT FOUND" });

    const seller = await User.findById(auction.sellerId);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const winner = auction.winnerId
      ? await User.findById(auction.winnerId)
      : null;

    const highestPrice = auction.highestPrice;

    res.status(200).json({
      auction: auction,
      seller: seller,
      dataWinner: { winner: winner, highestPrice: highestPrice },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHistoryBid = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    const historyInfo = await Bid.find({ auctionId: auctionId })
      .populate("bidderId", "firstName lastName avatar_url")
      .sort({ bidTime: -1 });

    const rejectedBidderIds = await RejectedBidder.find({
      auctionId: auctionId,
    }).distinct("bidderId");

    res
      .status(200)
      .json({ history: historyInfo, rejectedBidderIds: rejectedBidderIds });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    const comments = await Comment.find({ auctionId: auctionId })
      .sort({
        questionTime: -1,
      })
      .populate("userId", "firstName lastName avatar_url");

    res
      .status(200)
      .json({ message: "Get comments successfully.", comments: comments });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "System error.",
      error: err.message,
    });
  }
};
