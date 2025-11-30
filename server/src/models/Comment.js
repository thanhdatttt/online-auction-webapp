// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    default: "",
    trim: true,
  },
  questionTime: {
    type: Date,
    default: Date.now,
  },
  answerTime: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Comment", commentSchema);
