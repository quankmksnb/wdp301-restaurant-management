import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      console.log(`User ${socket.id} joined room: ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo!");
  }

  return io;
};
