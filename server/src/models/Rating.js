import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    raterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    reviewContent: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    rateType: {
      type: String,
      enum: ["uprate", "downrate"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
