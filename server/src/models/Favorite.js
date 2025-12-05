import mongoose from "mongoose";

const favoriteItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  auctions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction"
    }
  ]
}, { timestamps: true }
);

export default mongoose.model("Favorite", favoriteItemSchema);