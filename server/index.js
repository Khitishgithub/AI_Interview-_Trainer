const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🔥 Matchmaking
  socket.on("find_match", () => {
    if (waitingUser) {
      const roomId = `room-${socket.id}-${waitingUser.id}`;

      socket.join(roomId);
      waitingUser.join(roomId);

      io.to(roomId).emit("match_found", {
        roomId,
        players: [socket.id, waitingUser.id],
      });

      waitingUser = null;
    } else {
      waitingUser = socket;
    }
  });

  // 🔥 Code Sync (REALTIME)
  socket.on("code_change", ({ roomId, code }) => {
    socket.to(roomId).emit("code_update", code);
  });

  // 🔥 Submit
  socket.on("submit_code", ({ roomId, result }) => {
    io.to(roomId).emit("battle_result", result);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    if (waitingUser?.id === socket.id) {
      waitingUser = null;
    }
  });
});

server.listen(5000, () => {
  console.log("🔥 Socket server running on port 5000");
});