import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Rating from "../models/Rating.js";
export const getWonAuctions = async (req, res) => {
  try {
    const userId = req.user.id;

    const q = req.query.q || "";

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const wonAuctionIds = await Auction.find({
      winnerId: userId,
      status: "ended",
    }).distinct("_id");

    if (wonAuctionIds.length === 0) {
      return res.status(200).json({
        message: "No won auction found",
        page,
        limit,
        total: 0,
        totalPages: 1,
        auctions: [],
      });
    }

    const [wons, total, ratings] = await Promise.all([
      Auction.find({
        status: "ended",
        winnerId: userId,
        "product.name": { $regex: q, $options: "i" },
      })
        .sort({ endTime: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sellerId", "firstName lastName"),
      Auction.countDocuments({
        status: "ended",
        winnerId: userId,
        "product.name": { $regex: q, $options: "i" },
      }),
      await Rating.find({ auctionId: { $in: wonAuctionIds } }),
    ]);
    return res.status(200).json({
      message: "Get won auctions successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      auctions: wons,
      ratings: ratings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCreatedAuctions = async (req, res) => {
  try {
    const status = req.query.status || "ended";
    const q = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let filter = {
      sellerId: userId,
      "product.name": { $regex: q, $options: "i" },
    };

    if (status === "successful") {
      filter.status = "ended";
      filter.winnerId = { $ne: null };
    } else {
      filter.status = status;
    }

    const [auctions, total] = await Promise.all([
      Auction.find(filter)
        .sort({ endTime: -1 })
        .skip(skip)
        .limit(limit)
        .populate("winnerId", "firstName lastName"),
      Auction.countDocuments(filter),
    ]);

    const auctionIdsOnPage = auctions.map((a) => a._id);

    const ratings = await Rating.find({
      auctionId: { $in: auctionIdsOnPage },
    });

    if (auctions.length === 0) {
      return res.status(200).json({
        message: "No created auction found",
        page,
        limit,
        total: 0,
        totalPages: 1,
        auctions: [],
        ratings: [],
      });
    }

    return res.status(200).json({
      message: "Get created auctions successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      auctions: auctions,
      ratings: ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const filter = { ratedUserId: userId };

    const [ratings, total] = await Promise.all([
      Rating.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("raterId", "firstName lastName avatarUrl")
        .populate({
          path: "auctionId",
          select: "product",
        }),
      Rating.countDocuments(filter),
    ]);

    const totalPositive = await Rating.countDocuments({
      ratedUserId: userId,
      rateType: "uprate",
    });

    return res.status(200).json({
      message: "Get feedbacks successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      ratings: ratings,
      totalPositive: totalPositive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getActiveBids = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    let searchQuery = req.query.searchQuery || "";
    let sortBy = req.query.sortBy || "newest";
    const skip = (page - 1) * limit;

    // sort options
    const sortOptions = {
      newest: { startTime: -1 },
      price_asc: { currentPrice: 1 },
      price_desc: { currentPrice: -1 },
      ending_soon: { endTime: 1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.newest;

    const match = searchQuery
      ? {
          "product.name": { $regex: searchQuery, $options: "i" },
        }
      : {};

    // find auctions that user have bidden
    const auctionIds = await Bid.distinct("auctionId", {
      bidderId: userId,
      isActive: true,
    });

    if (!auctionIds || auctionIds.length == 0) {
      return res.status(200).json({
        message: "No auctions have been bidden",
        page,
        limit,
        total: 0,
        totalPages: 1,
        auctions: [],
      });
    }

    const filter = {
      _id: { $in: auctionIds },
      status: "ongoing",
      ...match,
    };

    // filter and pagination
    const [activeBids, total] = await Promise.all([
      Auction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("winnerId", "username"),

      Auction.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Get active bids successfully",
      page,
      limit,
      total: total,
      totalPages: Math.ceil(total / limit),
      auctions: activeBids,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
