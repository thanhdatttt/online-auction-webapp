import mongoose from "mongoose";

const favoriteItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
    index: true,
  }
}, { timestamps: true }
);

// 1 user cannot like 1 autions twice
favoriteItemSchema.index({userId: 1, auctionId: 1}, {unique: true});

export default mongoose.model("Favorite", favoriteItemSchema);