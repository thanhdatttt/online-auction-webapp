import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
  autoConnect: false,
});
