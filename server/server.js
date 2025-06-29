import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize OnlineUsers as a Map for better performance
const OnlineUsers = new Map();

io.on("connection", (socket) => {
  // Get userId from handshake query
  const userId = socket.handshake.query.id?.toString();

  if (!userId) {
    console.log("⚠️ Connection rejected: No user ID provided");
    return socket.disconnect();
  }

  // Store user connection
  OnlineUsers.set(userId, socket.id);
  console.log(`✅ ${userId} connected (${socket.id})`);

  // Send updated online users list to everyone
  io.emit("onlineUsers", Object.fromEntries(OnlineUsers));

  // Handle disconnection
  socket.on("disconnect", () => {
    OnlineUsers.delete(userId);
    console.log(`❌ ${userId} disconnected`);
    io.emit("onlineUsers", Object.fromEntries(OnlineUsers));
  });

  // Message handling
  socket.on("sendMessage", (data) => {
    const receiverSocketId = OnlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ReceiveMessage", data);
    }
    io.to(socket.id).emit("ReceiveMessage", data);
  });
});

app.get("/api/status", (req, res) => {
  res.send("✅ Server is live!!");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("🚀 Server is Running");
});
