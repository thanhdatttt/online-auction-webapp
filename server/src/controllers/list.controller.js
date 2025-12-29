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

    console.log(wonAuctionIds);

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

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const createdAuctionIds = await Auction.find({
      sellerId: userId,
      status: status,
    }).distinct("_id");

    console.log(createdAuctionIds);

    if (createdAuctionIds.length === 0) {
      return res.status(200).json({
        message: "No created auction found",
        page,
        limit,
        total: 0,
        totalPages: 1,
        auctions: [],
      });
    }

    const [created, total, ratings] = await Promise.all([
      Auction.find({
        sellerId: userId,
        status: status,
        "product.name": { $regex: q, $options: "i" },
      })
        .sort({ endTime: 1 })
        .skip(skip)
        .limit(limit)
        .populate("winnerId", "firstName lastName"),
      Auction.countDocuments({
        sellerId: userId,
        status: status,
        "product.name": { $regex: q, $options: "i" },
      }),
      await Rating.find({ auctionId: { $in: createdAuctionIds } }),
    ]);
    return res.status(200).json({
      message: "Get created auctions successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      auctions: created,
      ratings: ratings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActiveBids = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let page = parseInt(req.query.page) || 1;   // default page 1
    let limit = parseInt(req.query.limit) || 9; // default 9 items per page
    let searchQuery = req.query.searchQuery || "";
    let sortBy = req.query.sortBy || "newest";
    const skip = (page - 1) * limit;

    // sort
    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { currentPrice: 1 },
      price_desc: { currentPrice: -1 },
      ending_soon: { endTime: 1 },
    };
    const sort = sortOptions[sortBy];

    // search
    const match = searchQuery
    ? {
        "product.name": { $regex: searchQuery, $options: "i" },
      }
    : {};

    // find auctions that user have bidden
    const auctionIds = await Bid.distinct("auctionId", {
      bidderId: userId,
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
        .populate("winnerId", "username avatar_url rating"),
      Auction.countDocuments({ _id: { $in: auctionIds } }),
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
    res.status(500).json({ message: err.message });
  }
};
