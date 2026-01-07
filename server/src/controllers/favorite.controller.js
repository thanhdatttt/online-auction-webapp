import Favorite from "../models/Favorite.js";
import Auction from "../models/Auction.js";

// add auction to favorite
export const addToFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { auctionId } = req.params;

    if (!userId || !auctionId) {
      return res.status(400).json({ message: "Missing userId or auctionId" });
    }

    // check if auction is existed
    if (!await Auction.findOne({_id: auctionId})) {
      return res.status(404).json({message: "Auction is not exists"});
    }

    // create favorite list if not existed
    let favorite = await Favorite.findOne({userId});
    if (!favorite) {
      favorite = await Favorite.create({
        userId,
        auctions: [auctionId],
      });

      return res.status(200).json({message: "Create favorite list", auctions: favorite.auctions});
    }

    // add auction to favorite
    favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $addToSet: { auctions: auctionId } }, // no dupplicate
      { new: true, upsert: true } // create one if not have
    ).populate("auctions");

    return res.status(201).json({
      message: "Added to favorites",
      auctions: favorite.auctions
    });
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}

// remove auction from favorite;
export const removeFromFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { auctionId } = req.params;

    if (!userId || !auctionId) {
      return res.status(400).json({ message: "Missing userId or auctionId" });
    }

    // check if auction is existed
    if (!await Auction.findOne({ _id: auctionId})) {
      return res.status(404).json({message: "Auction is not exists"});
    }

    // remove auction from favorite
     const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $pull: { auctions: auctionId } }, // remove auction from array
      { new: true }
    ).populate("auctions");

    if (!favorite) {
      return res.status(404).json({message: "Auction is not in favorite list"});
    }

    return res.status(200).json({
      message: "Removed from favorite successfully",
      auctions: favorite.auctions
    });
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}

// get favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }
    
    const favorite = await Favorite.findOne({ userId });
    if (!favorite || favorite == null || favorite.auctions.length === 0) {
      return res.status(200).json({
        message: "No favorite auction found",
        page,
        limit,
        total: 0,
        auctions: [],
      });
    }

    let page = parseInt(req.query.page) || 1;   // default page 1
    let limit = parseInt(req.query.limit) || 9; // default 9 items per page
    let searchQuery = req.query.searchQuery || "";
    let sortBy = req.query.sortBy || "newest";
    const skip = (page - 1) * limit;

    // sort
    const sortOptions = {
      newest: { startTime: -1 },
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

    const paginated = await Favorite.findOne({userId})
    .populate({
      path: "auctions",
      match: match,
      options: { skip, limit, sort },
      populate: {
        path: "winnerId",
        select: "username avatar_url rating",
      },
    });
    const total = paginated.auctions.length;

    return res.status(200).json({
      message: "Get favorites successfully",
      page: page,
      limit: limit,
      total: total,
      auctions: paginated.auctions,
    });
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}

// get favorite auction ids
export const getFavoriteIds = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId or auctionId" });
    }

    const favorite = await Favorite.findOne({userId});
    if (!favorite) {
      return res.status(200).json({
        message: "No favorite auction found",
        favoriteIds: [],
      });
    }

    const favoriteIds = favorite.auctions;
    return res.status(200).json({
      message: "Get favorite ids successfully",
      favoriteIds: favoriteIds,
    })

  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}