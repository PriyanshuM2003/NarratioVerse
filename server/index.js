const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
let isSocketRunning = false;
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });

  socket.on("user-toggle-audio", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
  });

  socket.on("user-toggle-video", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-toggle-video", userId);
  });

  socket.on("user-leave", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-leave", userId);
  });
});

app.get("/", (req, res) => {
  res.send("Socket server is running");
});

if (isSocketRunning) {
  console.log("Socket server is already running");
} else {
  console.log("Starting Socket server...");
  server.listen(process.env.PORT || 5000, () => {
    console.log(
      `Socket.IO server listening on port ${process.env.PORT || 5000}`
    );
    isSocketRunning = true;
  });
}
