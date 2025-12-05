import Favorite from "../models/Favorite.js";
// FAVORITE LIST
// add auction to favorite
export const addToFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { auctionId } = req.body;

    if (!userId || !auctionId) {
      return res.status(400).json({ message: "Missing userId or auctionId" });
    }

    // add auction to favorite
    const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $addToSet: { auctions: auctionId } }, // no dupplicate
      { new: true, upsert: true } // create one if not have
    ).populate("auctions");

    return res.status(201).json({
      message: "Added to favorites",
      data: favorite
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

    // remove auction from favorite
     const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $pull: { auctions: auctionId } }, // remove auction from array
      { new: true }
    ).populate("auctions");

    return res.status(200).json({
      message: "Removed from favorite successfully",
      data: favorite
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

    let page = parseInt(req.query.page) || 1;   // default page 1
    let limit = parseInt(req.query.limit) || 10; // default 10 items per page
    const skip = (page - 1) * limit;

    const favorite = await Favorite.findOne({ userId })
    .populate({
      path: "auctions",
      options: {
        skip,
        limit,
        sort: { createdAt: -1 } 
      }
    });
    const total = favorite.auctions.length;

    if (!favorite || favorite.auctions.length === 0) {
      return res.status(200).json({
        message: "No favorite auctions found",
        data: [],
        page,
        limit,
        total: 0
      });
    }

    return res.status(200).json({
      message: "Get favorites successfully",
      data: favorite,
      page: page,
      limit: limit,
      total: total,
    });
  } catch (err) {
    return res.statusd(500).json({message: err.message});
  }
}

export const checkFavorite = async(req, res) => {
  try {
    const userId = req.user.id;
    const { auctionId } = req.params;
  
    if (!userId || !auctionId) {
      return res.status(400).json({ message: "Missing userId or auctionId" });
    }

    const favorite = await Favorite.findOne({userId: userId, auctions: auctionId});
    res.status(200).json({ isFavorite: !!favorite });
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}