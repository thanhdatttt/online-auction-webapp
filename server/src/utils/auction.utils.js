import AuctionConfig from "../models/AuctionConfig.js";
import nodemailer from "nodemailer";
import { config } from "../configs/config.js";
import User from "../models/User.js";
import Bid from "../models/Bid.js";
import cron from "node-cron";
import Auction from "../models/Auction.js";
import Order from "../models/Order.js";

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

function formatPriceVND(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
}

export const sendQuestionEmail = async (seller, link, question) => {
  try {
    sendEmail(
      seller.email,
      "[Auctiz] You Have a New Comment on Your Auction",
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">New Comment on Your Auction</h2>
        
        <p>Hello <strong>${
          seller.firstName + " " + seller.lastName || "Seller"
        }</strong>,</p>

        <p>You’ve received a new comment on one of your auctions.</p>

        <div style="padding: 12px; margin: 16px 0; background: #f7f9fc; border-left: 4px solid #4a90e2;">
          <p style="margin: 0; font-style: italic;">
            “${question}”
          </p>
        </div>

        <p>To view the comment and respond, click the button below:</p>

        <a href="${link}" 
           style="display: inline-block; padding: 12px 20px; background: #4a90e2; 
                  color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;">
          View Auction
        </a>

        <br/><br/>

        <p style="font-size: 14px; color: #777;">
          If you did not expect this email, you can safely ignore it.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />

        <p style="font-size: 12px; color: #aaa;">
          This is an automated message from <strong>Your Auctiz</strong>.
        </p>
      </div>
    `
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const sendAnswerEmail = async (bidder, link, question, answer) => {
  try {
    sendEmail(
      bidder.email,
      "[Auctiz] A Comment Has Been Answered in an Auction You Joined",
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4a90e2;">A Comment Has Been Answered</h2>

        <p>Hello <strong>${
          bidder.firstName + " " + bidder.lastName || "Bidder"
        }</strong>,</p>

        <p>A question in an auction you participated in has just been answered.</p>

        <div style="padding: 12px; margin: 16px 0; background: #f7f9fc; border-left: 4px solid #4a90e2;">
          <p style="margin: 0; font-style: italic;">
            “${question}”
          </p>
          <p style="margin: 8px 0 0; color: #2c3e50;">
            <strong>Answer:</strong> ${answer}
          </p>
        </div>

        <p>You can view the full discussion and auction details here:</p>

        <a href="${link}" 
          style="display: inline-block; padding: 12px 20px; background: #4a90e2; 
                  color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;">
          View Auction
        </a>

        <br/><br/>

        <p style="font-size: 14px; color: #777;">
          If you did not expect this email, you can safely ignore it.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />

        <p style="font-size: 12px; color: #aaa;">
          This is an automated message from <strong>Your Auctiz</strong>.
        </p>
      </div>
  `
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const sendRejectedBidderEmail = async (bidder, productName, link) => {
  try {
    sendEmail(
      bidder.email,
      "[Auctiz] Your Bid Has Been Rejected",
      `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #FF5722;">Bid Rejection Notice</h2>

      <p>Hello <strong>${
        bidder.firstName + " " + bidder.lastName || "Bidder"
      }</strong>,</p>

      <p>We regret to inform you that your bid on the auction <strong>"${productName}"</strong> has been <strong>rejected by the seller</strong>.</p>

      <p>As a result, you will <strong>no longer be allowed to place any further bids</strong> on this auction.</p>

      <p>You can view the auction details here:</p>
      <a href="${link}"
        style="display:inline-block; padding:10px 16px; background:#FF5722; color:white; text-decoration:none; border-radius:5px;">
        View Auction
      </a>

      <p style="font-size: 12px; color: #aaa;">
        This is an automated message from <strong>Your Auctiz</strong>.
      </p>
    </div>
  `
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const sendPlaceBidEmail = async (
  bidderId,
  auction,
  bidEntryAmount,
  bidMaxAmount
) => {
  try {
    const bidder = await User.findById(bidderId).select(
      "email firstName lastName"
    );

    const seller = await User.findById(auction.sellerId).select(
      "email firstName lastName"
    );

    bidder.bidEntryAmount = bidEntryAmount;
    bidder.bidMaxAmount = bidMaxAmount;

    const bidderIds = await Bid.find({
      auctionId: auction._id,
    }).distinct("bidderId");

    const bidders = await User.find({ _id: { $in: bidderIds } }).select(
      "email firstName lastName"
    );

    console.log(auction.id);

    const link = `${config.CLIENT_URL}/auctions/${auction._id}`;

    sendEmail(
      bidder.email,
      "[Auctiz] Your Bid Has Been Placed Successfully",
      `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Bid Placed Successfully</h2>

      <p>Hello <strong>${bidder.firstName + " " + bidder.lastName}</strong>,</p>

      <p>Your bid on the auction <strong>"${
        auction.product.name
      }"</strong> has been placed successfully.</p>

      <p>Your current entry bid amount is:
        <strong style="color:#4CAF50; font-size: 18px;">${formatPriceVND(
          bidder.bidEntryAmount
        )}</strong>
      </p>

      <p>Your max bid amount is:
        <strong style="color:#4CAF50; font-size: 18px;">${formatPriceVND(
          bidder.bidMaxAmount
        )}</strong>
      </p>

      <a href="${link}"
        style="display:inline-block; padding:10px 16px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        View Auction
      </a>

      <p style="font-size: 12px; color: #aaa;">This is an automated message from <strong>Auctiz</strong>.</p>
    </div>
    `
    );

    sendEmail(
      seller.email,
      "[Auctiz] A New Bid Has Been Placed on Your Auction",
      `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2196F3;">New Bid Received</h2>

      <p>Hello <strong>${seller.firstName + " " + seller.lastName}</strong>,</p>

      <p>Your auction <strong>"${
        auction.product.name
      }"</strong> has received a new bid.</p>

      <p>The bidder <strong>${
        bidder.firstName + " " + bidder.lastName
      }</strong> placed a max bid of:</p>

      <p><strong style="color:#2196F3; font-size: 18px;">${formatPriceVND(
        bidder.bidMaxAmount
      )}</strong></p>

      <p>The current price of auction is:
        <strong style="color:#4CAF50; font-size: 18px;">${formatPriceVND(
          auction.currentPrice
        )}</strong>
      </p>

      <a href="${link}"
        style="display:inline-block; padding:10px 16px; background:#2196F3; color:white; text-decoration:none; border-radius:5px;">
        View Auction
      </a>

      <p style="font-size: 12px; color: #aaa;">This is an automated message from <strong>Auctiz</strong>.</p>
    </div>
    `
    );

    bidders
      .filter((b) => b.id !== bidder.id)
      .forEach((b) => {
        sendEmail(
          b.email,
          "[Auctiz] A New Bid Was Placed on an Auction You Joined",
          `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #FF9800;">New Bid Alert</h2>

          <p>Hello <strong>${b.firstName + " " + b.lastName}</strong>,</p>

          <p>A new bid has been placed on the auction <strong>"${
            auction.product.name
          }"</strong>.</p>

          <p>The bidder <strong>${
            bidder.firstName + " " + bidder.lastName
          }</strong> has placed a entry bid of:</p>

          <p><strong style="color:#FF9800; font-size: 18px;">${formatPriceVND(
            bidder.bidEntryAmount
          )}</strong></p>

          <p>You can view the updated auction details here:</p>

          <a href="${link}"
            style="display:inline-block; padding:10px 16px; background:#FF9800; color:white; text-decoration:none; border-radius:5px;">
            View Auction
          </a>

          <p style="font-size: 12px; color: #aaa;">This is an automated message from <strong>Auctiz</strong>.</p>
        </div>
        `
        );
      });
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const sendWinnerEmail = async (
  winner,
  productName,
  finalPrice,
  link
) => {
  try {
    sendEmail(
      winner.email,
      `[Auctiz] Congratulations! You Won the Auction`,
      `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Congratulations!</h2>

      <p>Hello <strong>${
        winner.firstName + " " + winner.lastName || "Winner"
      }</strong>,</p>

      <p>We are pleased to inform you that you have <strong>won the auction</strong> for <strong>"${productName}"</strong> with a final bid of <strong>${finalPrice} VND</strong>.</p>

      <p>You can view the auction and complete your purchase here:</p>
      <a href="${link}"
        style="display:inline-block; padding:10px 16px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        View Auction
      </a>

      <p style="font-size: 12px; color: #aaa;">
        This is an automated message from <strong>Your Auctiz</strong>.
      </p>
    </div>
  `
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const sendSellerEmail = async (
  seller,
  productName,
  winner = null,
  finalPrice = null,
  link
) => {
  try {
    const message = winner
      ? `The winning bidder is <strong>${
          winner.firstName + " " + winner.lastName
        }</strong> with a final bid of <strong>${finalPrice} VND</strong>.`
      : `Your auction ended with no winning bids.`;

    sendEmail(
      seller.email,
      `[Auctiz] Your Auction Has Ended`,
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2196F3;">Auction Ended</h2>

        <p>Hello <strong>${
          seller.firstName + " " + seller.lastName || "Seller"
        }</strong>,</p>

        <p>Your auction for <strong>"${productName}"</strong> has ended.</p>

        <p>${message}</p>

        <p>You can view the auction details here:</p>
        <a href="${link}"
          style="display:inline-block; padding:10px 16px; background:#2196F3; color:white; text-decoration:none; border-radius:5px;">
          View Auction
        </a>

        <p style="font-size: 12px; color: #aaa;">
          This is an automated message from <strong>Your Auctiz</strong>.
        </p>
      </div>
    `
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

const sendEmail = async (to, subject, contentHTML) => {
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
      to: to,
      subject: subject,
      html: contentHTML,
    });
  } catch (err) {
    throw err;
  }
};

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();
  const auctionsToEnd = await Auction.find({
    status: "ongoing",
    endTime: { $lte: now },
  });

  for (const auction of auctionsToEnd) {
    auction.status = "ended";

    await auction.save({ validateBeforeSave: false });

    const link = `${config.CLIENT_URL}/auctions/${auction.id}`;

    const seller = await User.findById(auction.sellerId);
    
    const winner = await User.findById(auction.winnerId);

    sendSellerEmail(
      seller,
      auction.product.name,
      winner,
      auction.currentPrice,
      link
    );


    if (winner) {
      sendWinnerEmail(winner, auction.product.name, auction.currentPrice, link);

      // create order if not exists
      const existedOrder = await Order.findOne({
        auctionId: auction._id,
      });

      if (!existedOrder) {
        await Order.create({
          auctionId: auction._id,
          sellerId: auction.sellerId,
          buyerId: auction.winnerId,
          finalPrice: auction.currentPrice,
        });
      }
    }

  }
});
