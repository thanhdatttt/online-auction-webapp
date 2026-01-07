import AuctionConfig from "../models/AuctionConfig.js";
import nodemailer from "nodemailer";
import { config } from "../configs/config.js";
import User from "../models/User.js";
import Bid from "../models/Bid.js";
import cron from "node-cron";
import Auction from "../models/Auction.js";
import Order from "../models/Order.js";
import Conversation from "../models/Conversation.js";

// singleton...
export const initAuctionConfig = async () => {
  try {
    let auctionConfig = await AuctionConfig.findOne();
    if (!auctionConfig) {
      auctionConfig = new AuctionConfig({
        extendThreshold: 60000 * 5,
        extendDuration: 60000 * 10,
      });
      await auctionConfig.save();
    }
  } catch (err) {
    throw err;
  }
};

const maskFirstHalf = (str) => {
  if (!str) return "";
  const half = Math.floor(str.length / 2);
  return "*".repeat(half) + str.slice(half);
};

const formatPriceVND = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount) + " VND";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: config.EMAIL_APP,
//     pass: config.PASSWORD_EMAIL_APP,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: config.EMAIL_APP,
    pass: config.PASSWORD_EMAIL_APP, // App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const styles = {
  container: `background-color: #f3f4f6; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;`,
  wrapper: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);`,
  header: `background-color: #2563eb; padding: 24px; text-align: center;`,
  headerText: `color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 1px;`,
  body: `padding: 32px; color: #374151; line-height: 1.6; font-size: 16px;`,
  buttonContainer: `text-align: center; margin-top: 32px; margin-bottom: 16px;`,
  button: `display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;`,
  footer: `background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;`,
  highlight: `color: #2563eb; font-weight: 600;`,
  blockquote: `border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 20px 0; color: #6b7280; font-style: italic;`,
  infoBox: `background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;`,
};

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Your Auctiz" <${config.EMAIL_APP}>`,
    to,
    subject,
    html,
  });
};

export const sendQuestionEmail = async (seller, link, question) => {
  const sellerName = seller.firstName + " " + seller.lastName || "Seller";

  await sendEmail(
    seller.email,
    "[Auctiz] You Have a New Comment on Your Auction",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #111827;">New Comment Received</h2>
          <p>Hello <strong>${sellerName}</strong>,</p>
          <p>Someone is interested in your auction and has left a question:</p>
          
          <div style="${styles.blockquote}">
            "${question}"
          </div>
          
          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">Reply Now</a>
          </div>
          
          <p style="margin-bottom: 0;">Please respond promptly to increase your chances of a successful sale.</p>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};

export const sendAnswerEmail = async (bidder, link, question, answer) => {
  const bidderName = bidder.firstName + " " + bidder.lastName || "Bidder";

  await sendEmail(
    bidder.email,
    "[Auctiz] Seller Answered Your Question",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #111827;">New Reply to Your Question</h2>
          <p>Hello <strong>${bidderName}</strong>,</p>
          <p>The seller has responded to your question:</p>
          
          <div style="${styles.infoBox}">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Your Question:</p>
            <p style="margin: 0 0 16px 0; font-style: italic;">"${question}"</p>
            
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #2563eb; font-weight: bold;">Seller's Answer:</p>
            <p style="margin: 0;">"${answer}"</p>
          </div>

          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">View Auction</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};

export const sendGeneralAnswerEmail = async (
  bidder,
  link,
  question,
  answer,
  productName
) => {
  const bidderName = bidder.firstName + " " + bidder.lastName || "User";

  await sendEmail(
    bidder.email,
    "[Auctiz] New Q&A Activity on an Auction You Joined",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #111827;">Auction Update</h2>
          <p>Hello <strong>${bidderName}</strong>,</p>
          <p>A new question regarding <strong>"${productName}"</strong> has been answered by the seller.</p>
          
          <div style="${styles.infoBox}">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Question:</p>
            <p style="margin: 0 0 16px 0; font-style: italic;">"${question}"</p>
            
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #2563eb; font-weight: bold;">Seller's Answer:</p>
            <p style="margin: 0;">"${answer}"</p>
          </div>

          <p style="font-size: 14px; color: #666;">Check it out, this information might be useful for your bidding strategy.</p>

          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">View Auction</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};

export const sendRejectedBidderEmail = async (bidder, productName, link) => {
  const bidderName = bidder.firstName + " " + bidder.lastName || "Bidder";

  await sendEmail(
    bidder.email,
    "[Auctiz] Important Update Regarding Your Bid",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${
          styles.header
        }" style="background-color: #dc2626;"> <h1 style="${
      styles.headerText
    }">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #dc2626;">Bid Rejected</h2>
          <p>Hello <strong>${bidderName}</strong>,</p>
          <p>We regret to inform you that your bid on <strong>"${productName}"</strong> has been rejected by the seller.</p>
          
          <p>This can happen for various reasons determined by the seller. You can check the auction details for more information.</p>
          
          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">View Auction</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};

export const sendPlaceBidEmail = async (
  bidderId,
  auction,
  bidEntryAmount,
  bidMaxAmount
) => {
  const bidder = await User.findById(bidderId).select(
    "email firstName lastName"
  );
  const seller = await User.findById(auction.sellerId).select(
    "email firstName lastName"
  );

  const bidderIds = await Bid.find({ auctionId: auction._id }).distinct(
    "bidderId"
  );
  const bidders = await User.find({ _id: { $in: bidderIds } }).select(
    "email firstName lastName"
  );

  const link = `${config.CLIENT_URL}/auctions/${auction._id}`;
  const productName = auction.product.name;

  // 4a. Email to the Bidder (Success)
  await sendEmail(
    bidder.email,
    "[Auctiz] Bid Placed Successfully",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #16a34a;">Bid Confirmed!</h2>
          <p>Hello <strong>${bidder.firstName} ${bidder.lastName}</strong>,</p>
          <p>You have successfully placed a bid on <strong>"${productName}"</strong>.</p>
          
          <div style="${styles.infoBox}">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Entry Price:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right;">${formatPriceVND(
                  bidEntryAmount
                )}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Your Max Bid:</td>
                <td style="padding: 4px 0; font-weight: bold; text-align: right;">${formatPriceVND(
                  bidMaxAmount
                )}</td>
              </tr>
            </table>
          </div>

          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">Track Your Bid</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );

  // 4b. Email to the Seller (Notification) - ĐÃ CẬP NHẬT THÊM bidEntryAmount
  await sendEmail(
    seller.email,
    "[Auctiz] New Bid on Your Auction",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #111827;">Action on Your Auction!</h2>
          <p>Hello <strong>${seller.firstName}</strong>,</p>
          <p>Good news! A new bid has been placed on <strong>"${productName}"</strong>.</p>
          
          <div style="padding: 20px; background-color: #eff6ff; border-radius: 8px; margin: 20px 0;">
            
            <div style="text-align: center; border-bottom: 1px solid #bfdbfe; padding-bottom: 15px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Entry Amount (Current Price)</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #374151;">${formatPriceVND(
                bidEntryAmount
              )}</p>
            </div>

            <div style="text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Max Bid Amount</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #2563eb;">${formatPriceVND(
                bidMaxAmount
              )}</p>
            </div>

          </div>

          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">Manage Auction</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );

  // 4c. Email to other bidders (Outbid/Update notification)
  const otherBidders = bidders.filter((b) => b.id !== bidder.id);

  // Dùng Promise.all để gửi song song cho nhanh
  await Promise.all(
    otherBidders.map((b) =>
      sendEmail(
        b.email,
        "[Auctiz] Auction Update: New Bid Placed",
        `
      <div style="${styles.container}">
        <div style="${styles.wrapper}">
          <div style="${styles.header}">
            <h1 style="${styles.headerText}">Auctiz</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="margin-top: 0; color: #111827;">Auction Update</h2>
            <p>Hello <strong>${b.firstName}</strong>,</p>
            <p>A new bid has been placed on an auction you are bidding: <strong>"${productName}"</strong>.</p>
            
            <div style="${styles.infoBox}">
              <p style="margin: 0 0 8px 0;"><strong>Latest Activity:</strong></p>
              <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 4px;">Bidder: ${maskFirstHalf(
                  bidder.firstName + " " + bidder.lastName
                )}</li>
                <li>Current Entry Price: <strong>${formatPriceVND(
                  bidEntryAmount
                )}</strong></li>
              </ul>
            </div>

            <p>Check if you've been outbid and place a new bid to stay in the lead!</p>

            <div style="${styles.buttonContainer}">
              <a href="${link}" style="${styles.button}">Place New Bid</a>
            </div>
          </div>
          <div style="${styles.footer}">
            &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
          </div>
        </div>
      </div>
      `
      )
    )
  );
};

export const sendWinnerEmail = async (
  winner,
  productName,
  finalPrice,
  link
) => {
  await sendEmail(
    winner.email,
    "[Auctiz] Congratulations! You Won!",
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: #16a34a; text-align: center;">🎉 Congratulations! 🎉</h2>
          <p>Hello <strong>${winner.firstName} ${winner.lastName}</strong>,</p>
          <p>You have successfully won the auction for <strong>"${productName}"</strong>!</p>
          
          <div style="text-align: center; padding: 24px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #166534;">Final Winning Price</p>
            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: bold; color: #15803d;">${formatPriceVND(
              finalPrice
            )}</p>
          </div>

          <p>Please proceed to the auction page to finalize the transaction details with the seller.</p>

          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">View Order Details</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};

export const sendSellerEmail = async (
  seller,
  productName,
  winner = null,
  finalPrice = null,
  link
) => {
  const isSuccess = !!winner;
  const statusColor = isSuccess ? "#16a34a" : "#6b7280";
  const statusTitle = isSuccess
    ? "Auction Sold Successfully!"
    : "Auction Ended (No Bids)";

  let contentHtml = "";
  if (isSuccess) {
    contentHtml = `
      <p>Congratulations! Your auction for <strong>"${productName}"</strong> has ended with a winner.</p>
      <div style="${styles.infoBox}">
         <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Winner:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${
                winner.firstName
              } ${winner.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Final Price:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #2563eb;">${formatPriceVND(
                finalPrice
              )}</td>
            </tr>
         </table>
      </div>
      <p>Please contact the winner to arrange payment and delivery.</p>
    `;
  } else {
    contentHtml = `
      <p>Your auction for <strong>"${productName}"</strong> has ended.</p>
      <div style="padding: 16px; background-color: #f3f4f6; border-radius: 6px; text-align: center; color: #6b7280; margin: 20px 0;">
        Unfortunately, there were no valid bids for this item.
      </div>
      <p>You can try relisting the item or editing the details to attract more bidders.</p>
    `;
  }

  await sendEmail(
    seller.email,
    `[Auctiz] Auction Ended: ${productName}`,
    `
    <div style="${styles.container}">
      <div style="${styles.wrapper}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Auctiz</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="margin-top: 0; color: ${statusColor};">${statusTitle}</h2>
          <p>Hello <strong>${seller.firstName} ${seller.lastName}</strong>,</p>
          
          ${contentHtml}

          <div style="${styles.buttonContainer}">
            <a href="${link}" style="${styles.button}">View Result</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} Auctiz. All rights reserved.
        </div>
      </div>
    </div>
    `
  );
};

cron.schedule("*/1 * * * *", async () => {
  try {
    const now = new Date();
    const auctionsToEnd = await Auction.find({
      status: "ongoing",
      endTime: { $lte: now },
    });

    const io = global.io;

    for (const auction of auctionsToEnd) {
      const updated = await Auction.findOneAndUpdate(
        { _id: auction._id, status: "ongoing" },
        { status: "ended" },
        { new: true }
      );

      if (!updated) continue;

      console.log(updated.id);

      io.to(`auction_${updated._id}`).emit("endTimeUpdate", updated.endTime);

      const link = `${config.CLIENT_URL}/auctions/${auction._id}`;
      const winner = await User.findById(auction.winnerId);
      const seller = await User.findById(auction.sellerId);

      if (winner) {
        await sendWinnerEmail(
          winner,
          auction.product.name,
          auction.currentPrice,
          link
        );

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

        try {
          // Check if conversation already exists between seller and winner
          let conversation = await Conversation.findOne({
            participants: { $all: [auction.sellerId, auction.winnerId] },
          });

          // If not, create it
          if (!conversation) {
            conversation = await Conversation.create({
              participants: [auction.sellerId, auction.winnerId],
            });

            await conversation.populate("participants", "firstName lastName avatar_url email");
            console.log(`Conversation created for Auction ${auction._id}`);
            
            // Emit to Seller
            io.to(`user_${auction.sellerId}`).emit("newConversation", conversation);
            
            // Emit to Winner
            io.to(`user_${auction.winnerId}`).emit("newConversation", conversation);
          }
        } catch (convErr) {
          console.error("Error creating conversation:", convErr);
        }
      }

      await sendSellerEmail(
        seller,
        auction.product.name,
        winner,
        auction.currentPrice,
        link
      );
    }
  } catch (err) {
    console.error("[CRON END AUCTION ERROR]", err);
  }
});
