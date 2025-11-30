import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

import User from "./src/models/User.js";
import Product from "./src/models/Product.js";
import Auction from "./src/models/Auction.js";

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    const sellerPassword = "seller123";
    const sellerHash = "password123";

    const seller = await User.create({
      username: "seller1",
      role: "seller",
      firstName: "Seller",
      lastName: "One",
      email: "seller1@example.com",
      passwordHash: sellerHash,
      status: "active",
    });
    console.log("Seller created:", seller.username);

    const biddersData = [
      {
        username: "bidder1",
        role: "bidder",
        firstName: "Alice",
        lastName: "Nguyen",
        email: "alice@example.com",
        passwordHash: "password123",
      },
      {
        username: "bidder2",
        role: "bidder",
        firstName: "Bob",
        lastName: "Tran",
        email: "bob@example.com",
        passwordHash: "password123",
      },
      {
        username: "bidder3",
        role: "bidder",
        firstName: "Charlie",
        lastName: "Le",
        email: "charlie@example.com",
        passwordHash: "password123",
      },
      {
        username: "bidder4",
        role: "bidder",
        firstName: "David",
        lastName: "Pham",
        email: "david@example.com",
        passwordHash: "password123",
      },
    ];

    const bidders = [];
    for (const b of biddersData) {
      const user = await User.create(b);
      bidders.push(user);
    }
    console.log(
      "4 bidders created:",
      bidders.map((u) => u.username)
    );

    const product = await Product.create({
      sellerId: seller._id,
      productName: 'MacBook Pro 16" 2023',
      status: "active",
    });
    console.log("Product created:", product.productName);

    const auction = await Auction.create({
      productId: product._id,
      sellerId: seller._id,
      startPrice: 1000,
      currentPrice: 1000,
      buyNowPrice: 5000,
      gapPrice: 100,
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      status: "ongoing",
      winnerId: null,
    });
    console.log("Auction created:", auction._id);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Error:", err);
    await mongoose.disconnect();
  }
}

main();
