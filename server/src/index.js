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
  console.log("User connected:", socket.id);

  socket.on("joinAuction", (auctionId) => {
    socket.join(`auction_${auctionId}`);
    console.log(`User ${socket.id} joined auction ${auctionId}`);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// set up server
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);

// bidder routes
app.use("/api/auctions", auctionRoute);
app.use(auth);
app.use("/api/users", userRoute);

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
