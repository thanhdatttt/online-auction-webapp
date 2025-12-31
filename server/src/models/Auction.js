import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    // required: true,
    default: null,
  },
  name: {
    type: String,
    required: true,
    maxlength: 150,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [imageSchema],
    required: true,
  },
  mainImageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const auctionSchema = new mongoose.Schema({
  product: {
    type: productSchema,
    required: true,
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
  },
  highestPrice: {
    type: Number,
  },
  buyNowPrice: {
    type: Number,
  },
  gapPrice: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["ongoing", "ended"],
    default: "ongoing",
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  allowUnratedBidder: {
    type: Boolean,
    default: false,
  },
  autoExtension: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Auction", auctionSchema);
