import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { config } from "./configs/config.js";
import { connectDB } from "./libs/db.js";
import { auth, authorize } from "./middlewares/auth.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import bidderRoute from "./routes/bidder.route.js";
import auctionRoute from "./routes/auction.route.js";
import { initAuctionConfig } from "./utils/auction.utils.js";
import { Server } from "socket.io";
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
app.use(auth);
app.use("/api/users", userRoute);
app.use("/api/auctions", auctionRoute);
app.use("/api/bidder", authorize("bidder", "admin"), bidderRoute);

app.use("/api/admin", authorize("admin"), adminRoute);

// run server
connectDB().then(async () => {
  await initAuctionConfig();
  server.listen(config.PORT, () =>
    console.log(`Server running on port ${config.PORT} ...`)
  );
});
