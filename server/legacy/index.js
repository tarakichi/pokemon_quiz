const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const setupSocketHandlers = require("../socketHandlers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http//localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const PORT = process.env.PORT || 3001;

app.get("api/hello", (req, res) => {
    res.json({ message: "サーバーは動作中です！" });
});

setupSocketHandlers(io);

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
