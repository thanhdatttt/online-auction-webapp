import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import Comment from "../models/Comment.js";
import RejectedBidder from "../models/RejectedBidder.js";
import AuctionConfig from "../models/AuctionConfig.js";
import {
  sendAnswerEmail,
  sendPlaceBidEmail,
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

    if (rejectedBidder)
      return res
        .status(409)
        .json({ message: "You can not bid to this auction anymore." });

    const minBidMaxAmount = auction.winnerId
      ? auction.currentPrice + auction.gapPrice
      : auction.startPrice + auction.gapPrice;

    if (bidMaxAmount % auction.gapPrice !== 0) {
      return res.status(400).json({
        message: `Min valid bid should be ${
          auction.currentPrice + auction.gapPrice
        } or higher can divide by ${auction.gapPrice}`,
      });
    }

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

    const realTimeHistory = {};

    let autoBid;

    let hasAutoBid = false;

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
        hasAutoBid = true;

        const minToWin = auction.highestPrice + auction.gapPrice;

        if (bidMaxAmount >= minToWin) {
          autoBid = await Bid.create({
            auctionId: auctionId,
            bidderId: auction.winnerId,
            bidEntryAmount: auction.highestPrice,
            bidMaxAmount: auction.highestPrice,
            bidTime: now - 1000,
            curWinnerId: userId,
          });

          auction.currentPrice = auction.highestPrice + auction.gapPrice;

          console.log(auction.currentPrice);

          auction.highestPrice = bidMaxAmount;
          auction.winnerId = userId;
          bidEntryAmount = auction.currentPrice;
        } else {
          const potentialPrice = Math.min(
            bidMaxAmount + auction.gapPrice,
            auction.highestPrice
          );

          autoBid = await Bid.create({
            auctionId: auctionId,
            bidderId: auction.winnerId,
            bidEntryAmount: potentialPrice,
            bidMaxAmount: auction.highestPrice,
            bidTime: Date.now(),
            curWinnerId: auction.winnerId,
          });
          auction.currentPrice = potentialPrice;
          bidEntryAmount = bidMaxAmount;
        }
      }
    }

    const newBid = await Bid.create({
      auctionId: auctionId,
      bidderId: userId,
      bidEntryAmount: bidEntryAmount,
      bidMaxAmount: bidMaxAmount,
      bidTime: now,
      curWinnerId: auction.winnerId,
    });

    realTimeHistory.newBid = newBid;

    if (hasAutoBid) realTimeHistory.autoBid = autoBid;

    io.to(`auction_${auctionId}`).emit("priceUpdate", {
      currentPrice: auction.currentPrice,
      nextMinBid: auction.currentPrice + auction.gapPrice,
    });

    await auction.save();

    io.to(`auction_${auctionId}`).emit("historyUpdate", realTimeHistory);

    console.log(bidEntryAmount);

    console.log(bidMaxAmount);

    sendPlaceBidEmail(userId, auction, bidEntryAmount, bidMaxAmount);

    res.status(201).json({
      message: "Place bid successfully.",
      realTimeHistory: realTimeHistory,
      auction: auction,
    });
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
    // handle exception

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

    // create
    const rejectedBidder = await RejectedBidder.create({
      auctionId: auctionId,
      bidderId: bidderId,
    });

    // proceed the rejected bidder is the winner

    if (bidderId === auction.winnerId.toString()) {
      // find the second highest bid max amount
      const secondThirdBidMaxAmount = await Bid.find({ auctionId })
        .sort({ bidMaxAmount: -1 })
        .skip(1)
        .limit(2);

      // proceed to auction
      if (!secondThirdBidMaxAmount[0]) {
        auction.winnerId = null;
        auction.currentPrice = null;
        auction.highestPrice = null;
      } else {
        if (secondThirdBidMaxAmount[1]) {
          if (
            secondThirdBidMaxAmount[0].bidMaxAmount >=
            secondThirdBidMaxAmount[1].bidMaxAmount + auction.gapPrice
          ) {
          }

          secondThirdBidMaxAmount[0].bidEntryAmount = auction.currentPrice;
        } else {
          auction.winnerId = secondThirdBidMaxAmount[0].bidderId;
          auction.highestPrice = secondThirdBidMaxAmount[0].bidMaxAmount;
          auction.currentPrice = auction.startPrice + auction.gapPrice;
        }
      }

      await auction.save();
    }

    // set up sending email
    const link = `https://localhost:5173/auction/${auctionId}`;

    if (bidder.email)
      sendRejectedBidderEmail(bidder, auction.product.name, link);

    // success
    res.status(201).json({
      message: "Reject this bidder successfully.",
      rejectedBidder: rejectedBidder,
    });
  } catch (err) {
    res.status(500).json({ message: "System error", error: err.message });
  }
};
