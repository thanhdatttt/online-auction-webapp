import mongoose from "mongoose";

const auctionConfigSchema = new mongoose.Schema({
  extendThreshold: { type: Number, default: 300 },
  extendDuration: { type: Number, default: 600 },
});

export default mongoose.model("AuctionConfig", auctionConfigSchema);
