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

export const sendQuestionEmail = async (seller, link, question) => {
  sendEmail(
    seller.email,
    "You Have a New Comment on Your Auction",
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
};

export const sendAnswerEmail = async (bidder, link, question, answer) => {
  sendEmail(
    bidder.email,
    "A Comment Has Been Answered in an Auction You Joined",
    `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #FF5722;">Update in an Auction You Participated In</h2>
  
                <p>Hello <strong>${
                  bidder.firstName + " " + bidder.lastName || "Bidder"
                }</strong>,</p>
  
                <p>A comment in the auction you participated in has been answered:</p>
  
                <p><strong>Question:</strong></p>
                <blockquote style="border-left: 4px solid #FF5722; padding-left: 10px;">
                  ${question}
                </blockquote>
  
                <p><strong>Answer:</strong></p>
                <blockquote style="border-left: 4px solid #FFC107; padding-left: 10px;">
                  ${answer}
                </blockquote>
  
                <p>You can view the auction here:</p>
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
};

export const sendRejectedBidderEmail = async (bidder, productName, link) => {
  sendEmail(
    bidder.email,
    "Your Bid Has Been Rejected",
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
