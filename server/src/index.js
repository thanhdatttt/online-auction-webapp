import { config } from "./configs/config.js";
import { connectDB } from "./libs/db.js";
import { auth, authorize } from "./middlewares/auth.js";
import { initAuctionConfig } from "./utils/auction.utils.js";
import { authOptional } from "./middlewares/auth.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import sellerRoute from "./routes/seller.route.js"
import adminRoute from "./routes/admin.route.js";
import auctionRoute from "./routes/auction.route.js";
import favoriteRoute from "./routes/favorite.route.js";
import guestRoute from "./routes/guest.route.js";
import uploadRoute from "./routes/upload.route.js";
import orderRoute from "./routes/order.route.js";
import ratingRoute from "./routes/rating.route.js";
import chatRoute from "./routes/chat.route.js";
import { initSocket } from "./utils/socket.util.js";
// create server
const app = express();
const server = http.createServer(app);

// set up socket for updating bidding real-time...
const io = initSocket(server, config);

global.io = io;
app.set("io", io);
// set up server
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use(authOptional); // if guest -> pass, else valid token -> set user
app.use("/api/guest", guestRoute);
app.use("/api/upload", uploadRoute);

// bidder routes
app.use(auth);
app.use("/api/auctions", auctionRoute);
app.use("/api/users", userRoute);
app.use("/api/favorites", favoriteRoute);
app.use("/api/orders", orderRoute);
app.use("/api/ratings", ratingRoute);
app.use("/api/chat", chatRoute);
// admin routes
app.use("/api/admin", authorize("admin"), adminRoute);
// seller routes
app.use("/api", authorize("seller"), sellerRoute);

// run server
connectDB().then(async () => {
  await initAuctionConfig();
  server.listen(config.PORT, () =>
    console.log(`Server running on port ${config.PORT} ...`)
  );
  import("./cron/roleExpiration.job.js");
});
