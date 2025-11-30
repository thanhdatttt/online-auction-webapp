import mongoose from "mongoose";

// draft
const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productName: {
    type: String,
    required: true,
    max: 100,
  },
  status: {
    type: String,
    enum: ["draft", "active", "closed"],
  },
});

export default mongoose.model("Product", productSchema);
