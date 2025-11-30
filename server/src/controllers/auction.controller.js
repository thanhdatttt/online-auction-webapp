import Auction from "../models/Auction.js";
import mongoose from "mongoose";

export const createAuction = async (req, res) => {
  try {
    const sellerId = req.user.id; 
    const { name, description, imageUrls, mainImageId = null } = req.body;

    const images = imageUrls.map(url => ({
      _id: new mongoose.Types.ObjectId(),
      url: url,
    }));

    const product = {
      sellerId: sellerId,
      name: name,
      description: description,
      images: images,
      mainImageId: mainImageId,
    };
    
    if (!mainImageId && images.length > 0){
      product.mainImageId = product.images[0]._id;
    }

    const { startPrice, buyNowPrice = null, gapPrice, startTime, endTime } = req.body
    
    const auction = new Auction({
      product: product,
      sellerId: sellerId,
      startPrice: startPrice,
      buyNowPrice: buyNowPrice,
      gapPrice: gapPrice,
      startTime: startTime,
      endTime: endTime,
    });
    
    await auction.save();

    res.status(201).json({
      message: "Auction created successfully",
      product: product,
      auction: auction,
    });

  } catch (error) {
    res.status(500).json({ message: "Auction created failed", error: error.message });
  }
};