import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

interface ClientToServerEvents {
    message: (msg: string) => void;
}
interface ServerToClientEvents {
    message: (msg: string) => void;
}

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer,{
    cors: { origin: "*" },
});

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log("User connected:", socket.id);

    socket.on("message", (msg: string) => {
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
