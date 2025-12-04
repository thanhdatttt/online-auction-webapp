import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  bidderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidEntryAmount: {
    type: Number,
    required: true,
  },
  bidMaxAmount: {
    type: Number,
    required: true,
  },
  bidTime: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default mongoose.model("Bid", bidSchema);
