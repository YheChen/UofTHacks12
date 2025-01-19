const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3001;

// (Optional) Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running on 100.67.69.9:3001");
});

// If you want to use socket.io:
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the HTTP server on port 3001
server.listen(PORT, () => {
  console.log(`Server listening at http://100.67.69.9:${PORT}`);
});
