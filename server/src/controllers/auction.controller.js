import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import AuctionConfig from "../models/AuctionConfig.js";
import mongoose from "mongoose";
import Rating from "../models/Rating.js";
import {
  sendAnswerEmail,
  sendPlaceBidEmail,
  sendQuestionEmail,
  sendRejectedBidderEmail,
  sendWinnerEmail,
  sendSellerEmail,
  sendGeneralAnswerEmail,
} from "../utils/auction.utils.js";
import { config } from "../configs/config.js";
import RejectedBidder from "../models/RejectedBidder.js";
import { resetPassword } from "./auth.controller.js";

export const createAuction = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { categoryId, name, description, imageUrls, mainImageId = null } = req.body;

    const images = imageUrls.map((url) => ({
      _id: new mongoose.Types.ObjectId(),
      url: url,
    }));

    const product = {
      categoryId: categoryId,
      name: name,
      description: description,
      images: images,
      mainImageId: mainImageId,
    };

    if (!mainImageId && images.length > 0) {
      product.mainImageId = product.images[0]._id;
    }

    const { startPrice, buyNowPrice = null, gapPrice, endTime, autoExtension } = req.body;

    const auction = new Auction({
      product: product,
      sellerId: sellerId,
      startPrice: startPrice,
      buyNowPrice: buyNowPrice,
      gapPrice: gapPrice,
      endTime: endTime,
      autoExtension: autoExtension,
    });

    await auction.save();

    res.status(201).json({
      message: "Auction created successfully",
      auction: auction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Auction created failed", error: error.message });
  }
};

export const getAuctionDetail = async (req, res) => {
  try {
    const user = req.user;

    let showAlert;

    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    if (!auction) return res.status(404).json({ message: "NOT FOUND" });

    const seller = await User.findById(auction.sellerId);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    if (auction.status === "ended") {
      showAlert = false;
    } else {
      if (user) {
        if (user._id.equals(auction.sellerId)) showAlert = false;
        else {
          const ratingCount = await Rating.countDocuments({
            ratedUserId: user._id,
          });

          if (ratingCount === 0 && !auction.allowUnratedBidder) {
            showAlert = true;
          } else {
            const positiveRatingCount = await Rating.countDocuments({
              ratedUserId: user._id,
              rateType: "uprate",
            });

            const positiveRatingPercent =
              (positiveRatingCount / ratingCount) * 100;

            if (positiveRatingPercent < 80) showAlert = true;
            else showAlert = false;
          }
        }
      } else showAlert = false;
    }

    const winner = auction.winnerId
      ? await User.findById(auction.winnerId)
      : null;

    const highestPrice = auction.highestPrice;

    res.status(200).json({
      auction: auction,
      seller: seller,
      dataWinner: { winner: winner, highestPrice: highestPrice },
      showAlert: showAlert,
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

export const placeBid = async (req, res) => {
  try {
    const now = Date.now();

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

    if (auction.status === "ended" || now > auction.endTime.getTime()) {
      return res
        .status(400)
        .json({ message: "This auction is already closed." });
    }

    const totalRatings = await Rating.countDocuments({ ratedUserId: userId });

    if (totalRatings === 0)
      if (!auction.allowUnratedBidder)
        return res.status(400).json({
          message: "The seller does not allow unrated bidders to place bids.",
        });
      else {
        const totalPositiveRatings = await Rating.countDocuments({
          ratedUserId: userId,
          rateType: "uprate",
        });

        const positiveRatingPercent =
          (totalPositiveRatings / totalRatings) * 100;

        if (positiveRatingPercent < 80)
          return res.status(403).json({
            message:
              "You must have at least 80% positive rating to place a bid.",
          });
      }

    const rejectedBidder = await RejectedBidder.findOne({
      bidderId: userId,
      auctionId: auctionId,
    });

    if (rejectedBidder)
      return res.status(409).json({
        message:
          "You have been rejected by the seller. You can no longer place bids on this auction.",
      });

    const minBidMaxAmount = auction.winnerId
      ? auction.currentPrice + auction.gapPrice
      : auction.startPrice + auction.gapPrice;

    if (!bidMaxAmount || bidMaxAmount < minBidMaxAmount)
      return res
        .status(400)
        .json({ message: `Invalid bid. Min amount is ${minBidMaxAmount}` });

    if ((bidMaxAmount - auction.startPrice) % auction.gapPrice !== 0) {
      return res.status(400).json({
        message: `Bid amount must increase in steps of ${auction.gapPrice}.`,
      });
    }

    if (auction.buyNowPrice && bidMaxAmount === auction.buyNowPrice)
      return res
        .status(409)
        .json({ message: "Bidder should purchase outright now." });

    const auctionConfig = await AuctionConfig.findOne();

    const endTime = new Date(auction.endTime).getTime();

    if (auctionConfig && endTime - now <= auctionConfig.extendThreshold) {
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
      isNewWinner = true;
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
          auction.currentPrice = Math.min(auction.currentPrice, bidMaxAmount);
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
            bidTime: new Date(now - 1000),
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
            bidTime: new Date(now + 1000),
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
      bidTime: new Date(now),
    });

    await newBid.populate("bidderId", "firstName lastName avatar_url");

    realTimeHistory.push(newBid);

    if (hasAutoBid && autoBid) {
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

    // Populate userId để lấy thông tin người đặt câu hỏi ngay tại đây
    const comment = await Comment.findById(commentId).populate(
      "userId",
      "email firstName lastName"
    );

    if (!comment)
      return res
        .status(404)
        .json({ message: "This comment no longer exists." });

    const { answer } = req.body;

    if (!answer || answer.length === 0)
      return res.status(400).json({ message: "Answer must not be blank." });

    // Cập nhật câu trả lời
    comment.answer = answer;
    comment.answerTime = now;
    await comment.save(); // Lưu trước cho chắc chắn

    const link = `${config.CLIENT_URL}/auctions/${auctionId}`;

    const asker = comment.userId;
    if (asker && asker.email) {
      await sendAnswerEmail(asker, link, comment.question, comment.answer);
    }

    const bidderIds = await Bid.find({
      auctionId: auctionId,
      isActive: true,
    }).distinct("bidderId");

    const bidders = await User.find({ _id: { $in: bidderIds } }).select(
      "email firstName lastName"
    );

    await Promise.all(
      bidders.map((bidder) => {
        if (asker && bidder._id.toString() === asker._id.toString()) {
          return Promise.resolve();
        }

        if (bidder.email) {
          return sendGeneralAnswerEmail(
            bidder,
            link,
            comment.question,
            comment.answer,
            auction.product.name || "Item"
          );
        }
      })
    );

    res
      .status(200)
      .json({ message: "Answered successfully", comment: comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

    await Bid.updateMany(
      {
        auctionId: auctionId,
        bidderId: bidderId,
      },
      {
        $set: { isActive: false },
      }
    );

    const io = req.app.get("io");

    if (bidderId === auction.winnerId?.toString()) {
      const candidates = await Bid.aggregate([
        {
          $match: {
            auctionId: new mongoose.Types.ObjectId(auctionId),
            isActive: true,
          },
        },
        {
          $sort: { bidMaxAmount: -1, bidTime: 1 },
        },
        {
          $group: {
            _id: "$bidderId",
            bidMaxAmount: { $first: "$bidMaxAmount" },
            bidTime: { $first: "$bidTime" },
            bidId: { $first: "$_id" },
          },
        },
        {
          $sort: { bidMaxAmount: -1, bidTime: 1 },
        },
        { $limit: 2 },
      ]);

      console.log("New Candidates:", candidates);

      if (candidates.length === 0) {
        auction.winnerId = null;
        auction.currentPrice = auction.startPrice;
        auction.highestPrice = null;

        io.to(`auction_${auctionId}`).emit("winnerUpdate", {
          winner: null,
          highestPrice: null,
        });
      } else {
        const newWinnerBidDoc = await Bid.findById(candidates[0].bidId);

        const runnerUp = candidates[1];

        if (runnerUp) {
          newWinnerBidDoc.bidEntryAmount = Math.min(
            runnerUp.bidMaxAmount + auction.gapPrice,
            newWinnerBidDoc.bidMaxAmount
          );
          auction.currentPrice = newWinnerBidDoc.bidEntryAmount;
        } else {
          auction.currentPrice = auction.startPrice + auction.gapPrice;
          newWinnerBidDoc.bidEntryAmount = auction.currentPrice;
        }

        auction.highestPrice = newWinnerBidDoc.bidMaxAmount;
        auction.winnerId = newWinnerBidDoc.bidderId;

        await newWinnerBidDoc.save();
        await newWinnerBidDoc.populate(
          "bidderId",
          "firstName lastName avatar_url"
        );

        const winner = await User.findById(newWinnerBidDoc.bidderId);
        console.log("New Winner:", winner);

        const highestPrice = auction.highestPrice;

        io.to(`auction_${auctionId}`).emit("historyUpdate", [newWinnerBidDoc]);

        io.to(`auction_${auctionId}`).emit("winnerUpdate", {
          winner: winner,
          highestPrice: highestPrice,
        });
      }

      await auction.save();
    }

    const rejectedBidder = await RejectedBidder.create({
      auctionId: auctionId,
      bidderId: bidderId,
    });

    io.to(`auction_${auctionId}`).emit("rejectUpdate", bidderId);

    io.to(`auction_${auctionId}`).emit(
      "priceUpdate",
      auction.currentPrice ? auction.currentPrice : auction.startPrice
    );

    const link = `${
      process.env.CLIENT_URL || config.CLIENT_URL
    }/auctions/${auctionId}`;
    if (bidder.email)
      sendRejectedBidderEmail(bidder, auction.product.name, link);

    res.status(201).json({
      message: "Reject this bidder successfully.",
      rejectedBidder: rejectedBidder,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
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

    const exists = await RejectedBidder.findOne({
      auctionId: auctionId,
      bidderId: userId,
    });

    if (exists)
      return res
        .status(409)
        .json({ message: "You can not buyout to this product anymore." });

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
    console.log(err.message);
    res.status(500).json({ message: "System error", error: err.message });
  }
};

export const getAuctions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      search,
      categoryId,
    } = req.query;

    const filter = { status: "ongoing" };
    let sortOptions = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (categoryId) {
      const categoriesToInclude = await getCategoryAndDescendants(categoryId);
      filter["product.categoryId"] = { $in: categoriesToInclude };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    switch (sort) {
      case "price_asc":
        sortOptions = { currentPrice: 1 };
        break;
      case "price_desc":
        sortOptions = { currentPrice: -1 };
        break;
      case "ending_soon":
        sortOptions = { endTime: 1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "bid_desc":
        sortOptions = { bidCount: -1 };
        break;
      case "bid_asc":
        sortOptions = { bidCount: 1 };
        break;
      // case 'relevance':
      //   if (search) {
      //      sortOptions = { score: { $meta: "textScore" } };
      //   } else {
      //      sortOptions = { createdAt: -1 };
      //   }
      //   break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // if (search && sort !== 'relevance') {
    //    sortOptions.score = { $meta: "textScore" };
    // }

    const [auctions, total] = await Promise.all([
      Auction.aggregate([
        // 1. FILTER ($match replaces .find)
        { $match: filter },

        // 2. LOOKUP (Join with Bids)
        {
          $lookup: {
            from: "bids",
            localField: "_id",
            foreignField: "auctionId",
            as: "bids"
          }
        },

        // 3. COUNT (Calculate size)
        {
          $addFields: {
            bidCount: { $size: "$bids" }
          }
        },

        // 4. CLEANUP (Remove the heavy bids array)
        { $project: { bids: 0 } },

        // 5. SORT ($sort replaces .sort)
        { $sort: sortOptions }, // Ensure sortOptions uses MongoDB syntax (e.g. { price: -1 })

        // 6. PAGINATION ($skip & $limit)
        { $skip: skip },
        { $limit: limitNum },
        
        // 7. POPULATE (In aggregation, you must use $lookup for "populate" too)
        {
          $lookup: {
            from: "users", // Assuming your users collection is named "users"
            localField: "winnerId",
            foreignField: "_id",
            as: "winnerId"
          }
        },
        { $unwind: { path: "$winnerId", preserveNullAndEmptyArrays: true } } // Unwind array to object
      ]),

      Auction.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Auction retrieved successfully",
      auctions: auctions,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get auctions list", error: error.message });
  }
};

const getCategoryAndDescendants = async (rootId) => {
  let ids = [rootId];

  // Find immediate children
  const children = await Category.find({ parentId: rootId });

  // If children exist, recursively find their children
  for (const child of children) {
    const descendantIds = await getCategoryAndDescendants(child._id);
    ids = [...ids, ...descendantIds];
  }

  return ids;
};

export const getSimilarItems = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(400).json({ message: "Invalid auction id" });
    }

    const currentAuction = await Auction.findById(auctionId);
    if (!currentAuction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const categoryId = currentAuction.product.categoryId;
    if (!categoryId) {
      return res.json({ data: [] });
    }

    const similarAuctions = await Auction.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(auctionId) },
          "product.categoryId": categoryId,
        },
      },
      {
        $facet: {
          ongoing: [
            { $match: { status: "ongoing" } },
            { $sort: { endTime: 1 } },
            { $limit: 6 },
          ],
          ended: [
            { $match: { status: "ended" } },
            { $sort: { endTime: -1 } },
            { $limit: 6 },
          ],
        },
      },
      {
        $project: {
          items: {
            $slice: [{ $concatArrays: ["$ongoing", "$ended"] }, 6],
          },
        },
      },
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
    ]);

    return res.status(200).json({ data: similarAuctions });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
