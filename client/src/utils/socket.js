import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
  autoConnect: false,
});

export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();
    }
    // Always emit join, even if reconnecting
    socket.emit("joinUser", userId);
};