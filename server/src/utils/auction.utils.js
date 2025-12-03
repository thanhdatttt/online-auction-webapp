import mongoose from "mongoose";
import AuctionConfig from "../models/AuctionConfig.js";
import nodemailer from "nodemailer";
import { config } from "../configs/config.js";
// singleton...
export const initAuctionConfig = async () => {
  try {
    let config = await AuctionConfig.findOne();
    if (!config) {
      config = new AuctionConfig({
        extendThreshold: 300,
        extendDuration: 600,
      });
      await config.save();
    }
  } catch (err) {
    throw err;
  }
};

export const historyBidding = async (newBid, curWinnerId) => {
  const fullBidInfo = await newBid.populate("bidderId", "firstName lastName");

  console.log(fullBidInfo.bidMaxAmount);

  const user = fullBidInfo.bidderId;

  return {
    _id: fullBidInfo._id,
    bidderId: user ? user._id : null,
    fullName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
    bidEntryAmount: fullBidInfo.bidEntryAmount,
    bidTime: fullBidInfo.bidTime,
    curWinnerId: curWinnerId,
  };
};

export const sendEmail = async (to, subject, contentHTML) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL_APP,
        pass: config.PASSWORD_EMAIL_APP,
      },
    });

    await transporter.sendMail({
      from: `"Your Auctiz" <${config.EMAIL_APP}>`,
      to,
      subject,
      contentHTML,
    });
  } catch (err) {
    throw err;
  }
};
