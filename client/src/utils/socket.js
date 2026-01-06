import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,

  reconnectionAttempts: Infinity,

  reconnectionDelay: 1000,

  reconnectionDelayMax: 5000,

  timeout: 20000,
});

export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();
    }
    // Always emit join, even if reconnecting
    socket.emit("joinUser", userId);
};