import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import Comment from "../models/Comment.js";
import RejectedBidder from "../models/RejectedBidder.js";
import AuctionConfig from "../models/AuctionConfig.js";
import {
  sendAnswerEmail,
  sendQuestionEmail,
  sendRejectedBidderEmail,
} from "../utils/auction.utils.js";
import mongoose from "mongoose";
export const createAuction = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { name, description, imageUrls, mainImageId = null } = req.body;

    const images = imageUrls.map((url) => ({
      _id: new mongoose.Types.ObjectId(),
      url: url,
    }));

    console.log("HERE");

    const product = {
      name: name,
      description: description,
      images: images,
      mainImageId: mainImageId,
    };

    if (!mainImageId && images.length > 0) {
      product.mainImageId = product.images[0]._id;
    }

    const { startPrice, buyNowPrice = null, gapPrice, endTime } = req.body;

    const auction = new Auction({
      product: product,
      sellerId: sellerId,
      startPrice: startPrice,
      buyNowPrice: buyNowPrice,
      gapPrice: gapPrice,
      endTime: endTime,
    });

    await auction.save();

    res.status(201).json({
      message: "Auction created successfully",
      product: product,
      auction: auction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Auction created failed", error: error.message });
  }
};

export const placeBid = async (req, res) => {
  try {
    const now = new Date();

    const userId = req.user.id;

    const { bidMaxAmount } = req.body;

    const { auctionId } = req.params;

    const io = req.app.get("io");

    const auction = await Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    if (userId === auction.sellerId.toString())
      return res
        .status(409)
        .json({ message: "Sellers must not bid to their auctions." });

    if (now > auction.endTime) {
      return res
        .status(400)
        .json({ message: "This auction is already closed." });
    }

    // if (auction.minPositiveRatingPercent != null && auction.minPositiveRatingPercent)

    const rejectedBidder = await RejectedBidder.findOne({
      bidderId: userId,
      auctionId: auctionId,
    });

    if (rejectBidder)
      return res
        .status(409)
        .json({ message: "You can not bid to this auction anymore." });

    const minBidMaxAmount = auction.winnerId
      ? auction.currentPrice + auction.gapPrice
      : auction.startPrice + auction.gapPrice;

    if (!bidMaxAmount || bidMaxAmount < minBidMaxAmount)
      return res
        .status(400)
        .json({ message: `Invalid bid. Min amount is ${minBidMaxAmount}` });

    if (auction.buyNowPrice && bidMaxAmount >= auction.buyNowPrice)
      return res
        .status(409)
        .json({ message: "Bidder should purchase outright now." });

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

    if (!auction.winnerId) {
      auction.winnerId = userId;
      auction.highestPrice = bidMaxAmount;
      auction.currentPrice = auction.startPrice + auction.gapPrice;
      bidEntryAmount = auction.currentPrice;
    } else {
      if (userId === auction.winnerId.toString()) {
        const minHighestPrice = auction.highestPrice + auction.gapPrice;

        if (bidMaxAmount < minHighestPrice)
          return res.status(409).json({
            message: `Invalid bid. Min highest price is ${minHighestPrice}`,
          });
        else {
          auction.highestPrice = bidMaxAmount;
          auction.currentPrice = Math.min(
            auction.currentPrice + auction.gapPrice,
            bidMaxAmount
          );
          bidEntryAmount = auction.currentPrice;
        }
      } else {
        const currentMax = auction.highestPrice;
        const gap = auction.gapPrice;
        const minToWin = currentMax + gap;

        if (bidMaxAmount >= minToWin) {
          auction.currentPrice = minToWin;
          auction.highestPrice = bidMaxAmount;
          auction.winnerId = userId;
          bidEntryAmount = auction.currentPrice;
        } else {
          if (bidMaxAmount > currentMax) {
            auction.currentPrice = currentMax;
          } else {
            const potentialPrice = bidMaxAmount + gap;
            auction.currentPrice = Math.min(potentialPrice, currentMax);
          }
          bidEntryAmount = bidMaxAmount;
        }
      }
    }

    console.log(bidEntryAmount);

    const newBid = await Bid.create({
      auctionId: auctionId,
      bidderId: userId,
      bidEntryAmount: bidEntryAmount,
      bidMaxAmount: bidMaxAmount,
      bidTime: Date.now(),
      curWinnerId: auction.winnerId,
    });

    io.to(`auction_${auctionId}`).emit("priceUpdate", {
      currentPrice: auction.currentPrice,
      nextMinBid: auction.currentPrice + auction.gapPrice,
    });

    await auction.save();

    io.to(`auction_${auctionId}`).emit("historyUpdate", newBid);

    res.status(201).json({ message: "Place bid successfully.", newBid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuctionDetail = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const now = new Date();

    const userId = req.user.id;

    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    if (auction.status === "ended" || now > auction.endTime) {
      return res
        .status(409)
        .json({ message: "This auction is already closed." });
    }

    const { question } = req.body;

    if (question == null || question.length === 0)
      return res.status(400).json({ message: "Comment must not be blank." });

    // create
    const newComment = await Comment.create({
      auctionId: auctionId,
      userId: userId,
      question: question,
      answer: null,
      questionTime: now,
    });

    // proceed to send mail

    const seller = await User.findById(auction.sellerId);
    if (seller && seller.email) {
      const link = `https://localhost:5173/auction/${auctionId}`;
      sendQuestionEmail(seller, link, question);
    }

    res
      .status(201)
      .json({ message: "Commented successfully", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const answerComment = async (req, res) => {
  try {
    const now = new Date();

    const userId = req.user.id;

    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    if (auction == null)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    if (auction.status === "ended" || now > auction.endTime) {
      return res
        .status(409)
        .json({ message: "This auction is already closed." });
    }

    const sellerId = auction.sellerId.toString();

    if (userId !== sellerId)
      return res
        .status(403)
        .json({ message: "You are not allowed to answer." });

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ message: "This comment no longer exists." });

    const { answer } = req.body;

    if (!answer || answer.length === 0)
      return res.status(400).json({ message: "Answer must not be blank." });

    comment.answer = answer;

    comment.answerTime = now;

    const bidderIds = await Bid.find({ auctionId: auctionId }).distinct(
      "bidderId"
    );

    const bidders = await User.find({ _id: { $in: bidderIds } }).select(
      "email firstName lastName"
    );

    for (const bidder of bidders) {
      console.log(bidder.email);

      if (bidder.email) {
        sendAnswerEmail(bidder, link, comment.question, comment.answer);
      }
    }

    await comment.save();

    res
      .status(200)
      .json({ message: "Answered successfully", comment: comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBids = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    const bids = await Bid.find({ auctionId: auctionId }).sort({ bidTime: -1 });

    res.status(200).json({ message: "Get bids successfully.", bids: bids });
  } catch (err) {
    res.status(500).json({
      message: "System error.",
      error: err.message,
    });
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

    const comments = await Comment.find({ auctionId: auctionId }).sort({
      questionTime: -1,
    });

    res
      .status(200)
      .json({ message: "Get comments successfully.", comments: comments });
  } catch (err) {
    res.status(500).json({
      message: "System error.",
      error: err.message,
    });
  }
};

export const rejectBidder = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const userId = req.user.id;

    const { bidderId } = req.body;

    const bidder = await User.findById(bidderId).select(
      "email firstName lastName"
    );

    console.log(bidder);

    const auction = await Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    if (userId !== auction.sellerId.toString())
      return res
        .status(403)
        .json({ message: "You are not allowed to reject this bidder." });

    const existRejectedBidder = await RejectedBidder.findOne({
      auctionId: auctionId,
      bidderId: bidderId,
    });

    if (existRejectedBidder)
      return res
        .status(409)
        .json({ message: "You have already rejected this bidder." });

    const rejectedBidder = await RejectedBidder.create({
      auctionId: auctionId,
      bidderId: bidderId,
    });

    const link = `https://localhost:5173/auction/${auctionId}`;

    if (bidder.email)
      sendRejectedBidderEmail(bidder, auction.product.name, link);

    res.status(201).json({
      message: "Reject this bidder successfully.",
      rejectedBidder: rejectedBidder,
    });
  } catch (err) {
    res.status(500).json({ message: "System error", error: err.message });
  }
};
