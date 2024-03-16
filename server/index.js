const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use(cors(corsOptions));

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("participantJoined", (participant) => {
    socket.join(participant.roomId);
    console.log(`Participant ${participant.id} joined room ${participant.roomId}`);
    socket.broadcast.to(participant.roomId).emit("participantJoined", participant);
  });

  socket.on("audioStream", (audioData) => {
    socket.broadcast.emit("audioStream", audioData);
  });

  socket.on("micStatusChanged", ({ participantId, isMicOn }) => {
    socket.broadcast.emit("micStatusChanged", { participantId, isMicOn });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});
