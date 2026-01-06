import { Server } from "socket.io";

export const initSocket = (httpServer, config) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },

    transports: ["websocket"],
    pingInterval: 10000, //
    pingTimeout: 5000, //

    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.on("connection", (socket) => {
    if (socket.recovered) {
      return;
    }

    socket.on("joinAuction", (auctionId, callback) => {
      const roomName = `auction_${auctionId}`;
      socket.join(roomName);

      if (typeof callback === "function") {
        callback({ status: "ok", message: `Joined ${roomName}` });
      }
    });

    socket.on("leaveAuction", (auctionId) => {
      socket.leave(`auction_${auctionId}`);
    });

    socket.on("disconnect", (reason) => {});
  });

  return io;
};
