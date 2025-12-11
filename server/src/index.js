import { config } from "./configs/config.js";
import { connectDB } from "./libs/db.js";
import { adminOnly, auth, authorize } from "./middlewares/auth.js";
import { initAuctionConfig } from "./utils/auction.utils.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import auctionRoute from "./routes/auction.route.js";
import categoriesRoute from "./routes/category.route.js"
import favoriteRoute from "./routes/favorite.route.js";
import guestRoute from "./routes/guest.route.js";

// create server
const app = express();
const server = http.createServer(app);

// set up socket for updating bidding real-time...
const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL,
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  socket.on("joinAuction", (auctionId) => {
    socket.join(`auction_${auctionId}`);
  });
  socket.on("disconnect", () => {});
});

// set up server
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/api/guest", guestRoute);

// bidder routes  
app.use(auth);
app.use("/api/auctions", auctionRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/users", userRoute);
app.use("/api/favorites", favoriteRoute);

// admin routes
app.use(authorize("admin"));
app.use("/api/admin", adminRoute);

// run server
connectDB().then(async () => {
  await initAuctionConfig();
  server.listen(config.PORT, () =>
    console.log(`Server running on port ${config.PORT} ...`)
  );
});
