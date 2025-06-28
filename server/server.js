const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 3001;

// app.use(cors());

// app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
// });

app.get("/api/hello", (req, res) => {
    res.json({ message: "サーバーは動作中です！" });
});

io.on("connection", (socket) => {
    console.log("🔌 ユーザー接続:", socket.id);

    socket.on("ping", () => {
        socket.emit("pong");
    });

    socket.on("chat", (msg) => {
        console.log("💬 受信:", msg);
        io.emit("chat", msg);
    });

    socket.on("disconnect", () => {
        console.log("❌ 切断:", socket.id);
    })
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});