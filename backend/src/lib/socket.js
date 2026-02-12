// Store online users: { userId: socketId }
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      // Broadcast that user is online
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      // Broadcast updated online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getUserSocketMap = () => userSocketMap;
