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

class Room {
    constructor(hostId) {
        this.hostId = hostId;
        this.users = []; // { id, nickname }
    }

    addUser(id, nickname) {
        this.users.push({ id, nickname });
    }

    removeUser(id) {
        this.users = this.users.filter(u => u.id !== id);
    }

    getUser(id) {
        return this.users.find(u => u.id === id);
    }

    isEmpty() {
        return this.users.length === 0;
    }
}

const rooms = {}

function createRoomIfNeeded(roomId, hostId) {
    if (!rooms[roomId]) {
        rooms[roomId] = new Room(hostId);
        console.log("ルーム追加:", roomId);
    }
}

function emitRoomStatus(roomId) {
    const room = rooms[roomId];
    if (room) {
        io.to(roomId).emit("room-users", room.users);
        io.to(roomId).emit("host-id", room.hostId);
    }
}

app.get("/api/hello", (req, res) => {
    res.json({ message: "サーバーは動作中です！" });
});

io.on("connection", (socket) => {
    console.log("✅ ユーザー接続:", socket.id);

    socket.on("join-room", ({ roomId, nickname }) => {
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.nickname = nickname;

        createRoomIfNeeded(roomId, socket.id);
        rooms[roomId].addUser(socket.id, nickname);

        emitRoomStatus(roomId);
        socket.emit("your-id", socket.id);

        socket.to(roomId).emit("user-joined", { id: socket.id, nickname });
    });

    socket.on("start-game", ({ roomId }) => {
        io.to(roomId).emit("start-game");
    })

    socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        if (roomId && rooms[roomId]) {
            const room = rooms[roomId];
            const user = room.getUser(socket.id);
            room.removeUser(socket.id);

            if (user) {
                io.to(roomId).emit("user-left", user);
            }

            if (room.hostId === socket.id) {
                room.hostId = room.users[0]?.id || null;
            }

            emitRoomStatus(roomId);

            if (room.users.length === 0) {
                delete rooms[roomId];
                console.log("ルーム削除:", roomId);
            }
        }

        console.log("❌ 切断:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});