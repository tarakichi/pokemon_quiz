class Room {
    constructor(hostId) {
        this.hostId = hostId;
        this.users = []; // { id, nickname, score }
    }

    addUser(id, nickname) {
        if (!this.getUser(id)) {
            this.users.push({ id, nickname, score: 0 });
        }
    }

    removeUser(id) {
        this.users = this.users.filter(u => u.id !== id);
    }

    getUser(id) {
        return this.users.find(u => u.id === id);
    }

    addScore(id, delta = 1) {
        const user = this.getUser(id);
        if (user) {
            user.score = (user.score || 0) + delta;
        }
    }

    resetScores() {
        this.users.forEach(user => user.score = 0);
    }

    isEmpty() {
        return this.users.length === 0;
    }
}

const rooms = {};

function joinRoom(io, roomId, socketId, nickname) {
    createRoomIfNeeded(roomId, socketId);
    const room = rooms[roomId];
    room.addUser(socketId, nickname);

    emitRoomStatus(io, roomId);
    io.to(roomId).emit("user-joined", { id: socketId, nickname });
}

function leaveRoom(io, roomId, socketId) {
    const room = rooms[roomId];
    if (!room) return;

    const user = room.getUser(socketId);
    room.removeUser(socketId);

    if (user) {
        io.to(roomId).emit("user-left", user);
    }

    if (room.hostId === socketId) {
        room.hostId = room.users[0]?.id || null;
        io.to(roomId).emit("host-id", room.hostId);
    }

    if (room.isEmpty()) {
        deleteRoom(roomId);
    } else {
        emitRoomStatus(io, roomId);
    }
}

function createRoomIfNeeded(roomId, hostId) {
    if (!rooms[roomId]) {
        rooms[roomId] = new Room(hostId);
        console.log("ルーム作成:", roomId);
    }
}

function getRoom(roomId) {
    return rooms[roomId];
}

function deleteRoom(roomId) {
    delete rooms[roomId];
    console.log("🗑️ ルーム削除:", roomId);
}

function emitRoomStatus(io, roomId) {
    const room = getRoom(roomId);
    if (room) {
        io.to(roomId).emit("room-users", room.users);
        io.to(roomId).emit("host-id", room.hostId);
    }
}

module.exports = {
    rooms,
    createRoomIfNeeded,
    getRoom,
    deleteRoom,
    emitRoomStatus,
    getHostId: (roomId) => rooms[roomId]?.hostId || null,
    joinRoom,
    leaveRoom
};
