import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  startPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  highestPrice: {
    type: Number,
    required: true,
  },
  buyNowPrice: {
    type: Number,
  },
  gapPrice: {
    type: Number,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["ongoing", "ended"],
    required: true,
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  minPositiveRatingPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
});

export default mongoose.model("Auction", auctionSchema);
