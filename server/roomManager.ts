import { Server } from "socket.io";
import { User } from "./types";

class Room {
    id: string;
    hostId: string;
    users: User[] = [];

    constructor(id: string, hostId: string) {
        this.id = id;
        this.hostId = hostId;
    }

    addUser(userId: string, nickname: string) {
        const exists = this.getUser(userId);
        if(!exists) {
            this.users.push({ id: userId, icon: `/${Math.floor(Math.random() * 151)}`, nickname, score: 0 });
        }
    }

    removeUser(userId: string) {
        this.users = this.users.filter(u => u.id !== userId);
        if (this.hostId === userId) {
            this.hostId = this.users[0]?.id || "";
        }
    }

    getUser(userId: string): User | undefined {
        return this.users.find(u => u.id === userId);
    }

    isEmpty(): boolean {
        return this.users.length === 0;
    }

    getUserList(): User[] {
        return this.users;
    }

    addScore(userId: string, delta = 1) {
        const user = this.getUser(userId);
        if (user) {
            user.score += delta;
        }
    }

    resetScores() {
        this.users.forEach(user => user.score = 0);
    }
}

const rooms: Record<string, Room> = {};

function getOrCreateRoom(roomId: string, hostId: string) {
    if (!rooms[roomId]) {
        rooms[roomId] = new Room(roomId, hostId);
        console.log("ルーム作成:", roomId);
    }
    return rooms[roomId];
}

function emitRoomStatus(io: Server, roomId: string) {
    const room = rooms[roomId];
    if (room) {
        io.to(roomId).emit("room-users", room.users);
        io.to(roomId).emit("host-id", room.hostId);
    }
}

function joinRoom(io: Server, roomId: string, userId: string, nickname: string) {
    const room = getOrCreateRoom(roomId, userId);
    room.addUser(userId, nickname);

    emitRoomStatus(io, roomId);
    io.to(roomId).emit("user-joined", { id: userId, nickname });
}

function leaveRoom(io: Server, roomId: string, userId: string) {
    const room = rooms[roomId];
    if (!room) return;
    
    const user = room.getUser(userId);
    room.removeUser(userId);

    if (user) {
        io.to(roomId).emit("user-left", user);
    }

    emitRoomStatus(io, roomId);

    if (room.isEmpty()) {
        delete rooms[roomId];
        console.log("ルーム削除:", roomId);
    }
}

function addScore(io: Server, roomId: string, userId: string, delta?: number) {
    rooms[roomId]?.addScore(userId, delta);
    emitRoomStatus(io, roomId);
}

export default {
    joinRoom,
    leaveRoom,
    emitRoomStatus,
    addScore,
}