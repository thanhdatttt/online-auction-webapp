import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import Comment from "../models/Comment.js";
import AuctionConfig from "../models/AuctionConfig.js";
import {
  sendAnswerEmail,
  sendPlaceBidEmail,
  sendQuestionEmail,
  sendRejectedBidderEmail,
  sendWinnerEmail,
  sendSellerEmail,
} from "../utils/auction.utils.js";
import mongoose from "mongoose";
import { config } from "../configs/config.js";
import RejectedBidder from "../models/RejectedBidder.js";
import { type } from "os";
export const createAuction = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { name, description, imageUrls, mainImageId = null } = req.body;

    const images = imageUrls.map((url) => ({
      _id: new mongoose.Types.ObjectId(),
      url: url,
    }));

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

    const bidMaxAmount = Number(req.body.bidMaxAmount);

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

    if (auction.status === "ended" || now > auction.endTime) {
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

    if (!bidMaxAmount || bidMaxAmount < minBidMaxAmount)
      return res
        .status(400)
        .json({ message: `Invalid bid. Min amount is ${minBidMaxAmount}` });

    if (bidMaxAmount % auction.gapPrice !== 0) {
      return res.status(400).json({
        message: `Min valid bid should be ${
          auction.currentPrice + auction.gapPrice
        } or higher can divide by ${auction.gapPrice}`,
      });
    }

    if (auction.buyNowPrice && bidMaxAmount === auction.buyNowPrice)
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
      io.to(`auction_${auctionId}`).emit("endTimeUpdate", auction.endTime);
    }

    let bidEntryAmount;

    const realTimeHistory = [];

    let autoBid;

    let hasAutoBid = false;

    let isNewWinner = false;

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
          isNewWinner = true;
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
          });

          auction.currentPrice = auction.highestPrice + auction.gapPrice;

          auction.highestPrice = bidMaxAmount;
          auction.winnerId = userId;
          bidEntryAmount = auction.currentPrice;

          isNewWinner = true;
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
            bidTime: now + 1000,
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
    });

    await newBid.populate("bidderId", "firstName lastName avatar_url");

    realTimeHistory.push(newBid);

    if (hasAutoBid) {
      await autoBid.populate("bidderId", "firstName lastName avatar_url");
      realTimeHistory.push(autoBid);
    }

    io.to(`auction_${auctionId}`).emit("priceUpdate", auction.currentPrice);

    io.to(`auction_${auctionId}`).emit(
      "historyUpdate",
      realTimeHistory.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime))
    );

    if (isNewWinner) {
      const winner = await User.findById(auction.winnerId);
      io.to(`auction_${auctionId}`).emit("winnerUpdate", {
        winner: winner,
        highestPrice: auction.highestPrice,
      });
    }

    await auction.save();

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

    await newComment.populate("userId", "firstName lastName avatar_url");

    // proceed to send mail

    const seller = await User.findById(auction.sellerId);
    if (seller && seller.email) {
      const link = `${config.CLIENT_URL}/auctions/${auctionId}`;
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
    console.log("here");

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

    const bidderIds = await Bid.find({
      auctionId: auctionId,
      isActive: true,
    }).distinct("bidderId");

    const bidders = await User.find({ _id: { $in: bidderIds } }).select(
      "email firstName lastName"
    );

    const link = `${config.CLIENT_URL}/auctions/${auctionId}`;

    for (const bidder of bidders) {
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

export const rejectBidder = async (req, res) => {
  try {
    // handle exception

    const { auctionId } = req.params;

    const userId = req.user.id;

    const { bidderId } = req.body;

    const bidder = await User.findById(bidderId).select(
      "email firstName lastName"
    );

    const auction = await Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    if (userId !== auction.sellerId.toString())
      return res
        .status(403)
        .json({ message: "You are not allowed to reject this bidder." });

    const exists = await RejectedBidder.findOne({
      auctionId: auctionId,
      bidderId: bidderId,
    });

    if (exists)
      return res
        .status(409)
        .json({ message: "You already rejected this bidder." });

    // proceed the rejected bidder is the winner

    if (bidderId === auction.winnerId?.toString()) {
      // find the second and third highest bid max amount
      const secondThirdBidMaxAmount = await Bid.find({
        auctionId: auctionId,
        isActive: true,
      })
        .sort({ bidMaxAmount: -1, bidTime: 1 })
        .skip(1)
        .limit(2);

      // proceed to auction
      if (!secondThirdBidMaxAmount[0]) {
        auction.winnerId = null;
        auction.currentPrice = null;
        auction.highestPrice = null;
      } else {
        if (secondThirdBidMaxAmount[1]) {
          secondThirdBidMaxAmount[0].bidEntryAmount = Math.min(
            secondThirdBidMaxAmount[1].bidMaxAmount + auction.gapPrice,
            secondThirdBidMaxAmount[0].bidMaxAmount
          );
          auction.currentPrice = secondThirdBidMaxAmount[0].bidEntryAmount;
        } else {
          auction.currentPrice = auction.startPrice + auction.gapPrice;
        }
        auction.highestPrice = secondThirdBidMaxAmount[0].bidMaxAmount;
        auction.winnerId = secondThirdBidMaxAmount[0].bidderId;
        await secondThirdBidMaxAmount[0].save();
      }

      await auction.save();
    }

    const io = req.app.get("io");

    const result = await Bid.updateMany(
      {
        auctionId: auctionId,
        bidderId: bidderId,
      },
      {
        $set: { isActive: false },
      }
    );

    const rejectedBidder = await RejectedBidder.create({
      auctionId: auctionId,
      bidderId: bidderId,
    });

    io.to(`auction_${auctionId}`).emit("rejectUpdate", bidderId);

    io.to(`auction_${auctionId}`).emit("priceUpdate", auction.currentPrice);

    // set up sending email
    const link = `${config.CLIENT_URL}/auctions/${auctionId}`;

    if (bidder.email)
      sendRejectedBidderEmail(bidder, auction.product.name, link);

    // success
    res.status(201).json({
      message: "Reject this bidder successfully.",
      rejectedBidder: rejectedBidder,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "System error", error: err.message });
  }
};

export const buyNow = async (req, res) => {
  try {
    const now = new Date();

    const { auctionId } = req.params;

    const userId = req.user.id;

    const io = req.app.get("io");

    const auction = await Auction.findById(auctionId);

    if (!auction)
      return res
        .status(404)
        .json({ message: "This auction no longer exists." });

    if (!auction.buyNowPrice)
      return res
        .status(403)
        .json({ message: "This auction is not allowed to buyout." });

    if (auction.status === "ended" || now >= auction.endTime) {
      return res
        .status(400)
        .json({ message: "This auction is already closed." });
    }

    const newBid = await Bid.create({
      auctionId: auctionId,
      bidderId: userId,
      bidEntryAmount: auction.buyNowPrice,
      bidMaxAmount: auction.buyNowPrice,
      bidTime: now,
    });

    await newBid.populate("bidderId", "firstName lastName avatar_url");

    auction.currentPrice = auction.buyNowPrice;

    auction.highestPrice = auction.buyNowPrice;

    auction.status = "ended";

    auction.winnerId = userId;

    auction.endTime = now;

    io.to(`auction_${auctionId}`).emit("historyUpdate", [newBid]);

    io.to(`auction_${auctionId}`).emit("winnerUpdate", {
      winner: req.user,
      highestPrice: auction.highestPrice,
    });

    io.to(`auction_${auctionId}`).emit("priceUpdate", auction.currentPrice);

    io.to(`auction_${auctionId}`).emit("endTimeUpdate", now);

    const link = `${config.CLIENT_URL}/auctions/${auctionId}`;

    const winner = await User.findById(auction.winnerId);

    if (winner) {
      sendWinnerEmail(winner, auction.product.name, auction.currentPrice, link);
    }

    const seller = await User.findById(auction.sellerId);

    sendSellerEmail(
      seller,
      auction.product.name,
      winner,
      auction.currentPrice,
      link
    );

    await auction.save();

    res.status(200).json({ message: "Buy now successfully." });
  } catch (err) {
    res.status(500).json({ message: "System error", error: err.message });
  }
};
