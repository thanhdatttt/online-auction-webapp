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
      auction: auction,
    });

  } catch (error) {
    res.status(500).json({ message: "Auction created failed", error: error.message });
  }
};

export const getAuctions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'newest', 
      search, 
      categoryId 
    } = req.query;

    const filter = { status: 'ongoing' };
    let sortOptions = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (categoryId){
      filter['product.categoryId'] = categoryId;
    }

    const skip = (page - 1) * limit;

    switch (sort) {
      case 'price_asc': 
        sortOptions = { currentPrice: 1 }; 
        break;
      case 'price_desc': 
        sortOptions = { currentPrice: -1 }; 
        break;
      case 'ending_soon': 
        sortOptions = { endTime: 1 }; 
        break;
      case 'newest':
        sortOptions = { createdAt: -1 }; 
        break;
      // case 'relevance':
      //   if (search) {
      //      sortOptions = { score: { $meta: "textScore" } };
      //   } else {
      //      sortOptions = { createdAt: -1 };
      //   }
      //   break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // if (search && sort !== 'relevance') {
    //    sortOptions.score = { $meta: "textScore" };
    // }

    const [auctions, total] = await Promise.all([
      Auction.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('sellerId', 'username avatar_url rating'),
      
      Auction.countDocuments(filter)
    ]);

    res.status(200).json({
      message: "Auction retrieved successfully",
      auctions: auctions,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to get auctions list", error: error.message });
  }
};