import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketHandlers from "./socketHandlers";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const PORT = process.env.PORT || 3001;

app.get("/api/hello", (req, res) => {
    res.json({ message: "サーバーは動作中です！" });
});

socketHandlers(io);

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
})