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

const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
const avatars = [
    "🐱", "🐶", "🦊", "🐼", "🐧", "🦁", "🐸", "🐰", "🐢", "🐷"
];

// app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
// });

let connectedUsers = new Map();

function assignColorAndAvatar(socketId) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    return {color , avatar};
}

app.get("/api/hello", (req, res) => {
    res.json({ message: "サーバーは動作中です！" });
});

io.on("connection", (socket) => {
    const { color, avatar } = assignColorAndAvatar(socket.id);
    const defaultName = `ユーザー${socket.id.slice(0, 4)}`;
    console.log("🔌 ユーザー接続:", socket.id);
    connectedUsers.set(socket.id, { name: defaultName, color, avatar });

    sendUserList();

    io.emit("users", Array.from(connectedUsers.values()));

    socket.on("setName", (name) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            connectedUsers.set(socket.id, { ...user, name });
            sendUserList();
        }
    });
    
    socket.on("chat", (msg) => {
        console.log("💬 受信:", msg);
        io.emit("chat", msg);
    });
    
    socket.on("disconnect", () => {
        console.log("❌ 切断:", socket.id);
        connectedUsers.delete(socket.id);
        io.emit("users", Array.from(connectedUsers.values()));
    });
    
    function sendUserList() {
        io.emit("users", Array.from(connectedUsers.values()));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});