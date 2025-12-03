import Favorite from "../models/Favorite.js";
// FAVORITE LIST
// add auction to favorite
export const addToFavorite = async (req, res) => {
  try {
    const { userId, auctionId } = req.body;

    // add auction to favorite
    const item = await Favorite.create({
      userId: userId,
      auctionId: auctionId,
    });

    return res.status(201).json({
      message: "Added to favorites",
      data: item
    });
  } catch (err) {
    // error duplicate
    if (err.code === 11000) {
      return res.status(400).json({message: "Already in favorites"});
    }
    return res.status(500).json({message: err.message});
  }
}

// remove auction from favorite;
export const removeFromFavorite = async (req, res) => {
  try {
    const { userId, auctionId } = req.body;

    // remove auction from favorite
    const deleted = await Favorite.findOneAndDelete({
      userId: userId,
      auctionId: auctionId,
    });
    if (!deleted) {
      return res.status(404).json({message: "User or auction not found"});
    }

    return res.status(200).json({message: "Removed from favorites"});
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}

// get favorites by user
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const favorites = await Favorite.find({userId: userId})
    .populate("auction")    
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

    const total = await Favorite.countDocuments({userId: userId});

    return res.status(200).json({
      message: "Get favorites successfully",
      total: total,
      page: page,
      limit: limit,
      data: favorites,
    })
  } catch (err) {
    return res.statusd(500).json({message: err.message});
  }
}