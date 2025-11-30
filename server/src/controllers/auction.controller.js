import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import AuctionConfig from "../models/AuctionConfig.js";
import { historyBidding, sendEmail } from "../utils/auction.utils.js";
export const placeBid = async (req, res) => {
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

    // if (auction.minPositiveRatingPercent != null && auction.minPositiveRatingPercent)

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

    const newComment = await Comment.create({
      auctionId: auctionId,
      userId: userId,
      question: question,
      answer: null,
      questionTime: now,
    });

    const seller = await User.findById(auction.sellerId);
    if (seller && seller.email) {
      const link = `https://localhost:5173/auction/${auctionId}`;
      await sendEmail(
        seller.email,
        "New comment on your auction",
        `<p>You have a new comment on your auction.</p>
         <p>Question: ${question}</p>
         <p><a href="${link}">View Auction</a></p>`
      );
    }

    res.status(201).json({ message: "Commented successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const answerComment = async (req, res) => {
  try {
    const now = new Date();

    const { userId } = req.user;

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

    const sellerId = auction.sellerId;

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

    const commenter = await User.findById(comment.userId);
    if (commenter && commenter.email) {
      const link = `https://localhost:5173/auction/${auctionId}`;
      await sendEmail(
        commenter.email,
        "Your comment has been answered",
        `<p>Your comment: "${comment.question}" has been answered.</p>
         <p>Answer: ${answer}</p>
         <p><a href="${link}">View Auction</a></p>`
      );
    }

    await comment.save();

    res.status(200).json({ message: "Answered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    const {
      startPrice,
      buyNowPrice = null,
      gapPrice,
      startTime,
      endTime,
    } = req.body;

    const auction = new Auction({
      product: product,
      sellerId: sellerId,
      startPrice: startPrice,
      buyNowPrice: buyNowPrice,
      gapPrice: gapPrice,
      startTime: startTime,
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
