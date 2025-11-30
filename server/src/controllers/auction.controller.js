import Auction from "../models/Auction.js";
import Product from "../models/Product.js"
import mongoose from "mongoose";

export const createAuction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sellerId = req.user.id; 
    const { name, description, imageUrls, mainImageId = null } = req.body;

    const images = imageUrls.map(url => ({
      url: url,
    }));

    const product = new Product ({
      sellerId: sellerId,
      name: name,
      description: description,
      images: images,
    });
    
    if (!mainImageId && images.length > 0){
      product.mainImageId = product.images[0]._id;
    }
    
    const savedProduct = await product.save({ session });

    const { startPrice, buyNowPrice = null, gapPrice, startTime, endTime } = req.body
    
    const auction = new Auction({
      productId: savedProduct._id,
      sellerId: sellerId,
      startPrice: startPrice,
      buyNowPrice: buyNowPrice,
      gapPrice: gapPrice,
      startTime: startTime,
      endTime: endTime,
    });
    
    await auction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Auction created successfully",
      product: product,
      auction: auction,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({ message: "Auction created failed", error: error.message });
  }
};