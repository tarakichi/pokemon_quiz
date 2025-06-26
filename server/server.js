const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.port || 3001;

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("/api/hello", (req, res) => {
    res.json({ message: "サーバーは動作中です！" });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

io.on("connection", (socket) => {
    console.log("🔌 ユーザー接続:", socket.id);

    socket.on("chat", (msg) => {
        console.log("💬 受信:", msg);
        io.emit("chat", msg);
    });

    socket.on("disconect", () => {
        console.log("❌ 切断:", socket.id);
    })
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});