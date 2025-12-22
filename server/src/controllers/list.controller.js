import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

export const getWonAuctions = async(req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const haveWon = await Auction.findOne({ winnerId: userId});
    if (!haveWon) {
      return res.status(200).json({
        message: "No won auction found",
        page,
        limit,
        total: 0,
        totalPages: 1,
        auctions: [],
      });
    }

    const [wons, total] = await Promise.all([
      Auction.find({
        status: "ended",
        winnerId: userId,
      })
        .sort({ endTime: -1 })
        .skip(skip)
        .limit(limit),
      Auction.countDocuments({
        status: "ended",
        winnerId: userId
      }),
    ]);

    return res.status(200).json({
      message: "Get won auctions successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      auctions: wons,
    })
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const getActiveBids = async(req, res) => {
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
        name: { $regex: searchQuery, $options: "i" },
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
        .limit(limit),
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
      res.status(500).json({message: err.message});
  }
}