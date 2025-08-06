import type { Server, Socket } from "socket.io";
import roomManager from "./roomManager";
// import quizManager from "./quizManager";

export default function socketHandlers(io: Server):void {
    io.on("connection", (socket: Socket) => {
        console.log("✅ ユーザー接続:", socket.id);

        //ルーム関連イベント
        socket.on("join-room", ({ roomId, nickname }: { roomId: string; nickname: string}) => {
            socket.join(roomId);
            socket.data.roomId = roomId;
            // socket.data.nickname = nickname;

            roomManager.joinRoom(io, roomId, socket.id, nickname);
        });

        //クイズ関連イベント
        // socket.on("quiz-next", ({ roomId }: {roomId: string}) => {
        //     quizManager.sendNextQuestion(io, roomId);
        // });

        //切断処理
        socket.on("disconnect", () => {
            const roomId = socket.data.roomId;
            if (roomId) {
                roomManager.leaveRoom(io, roomId, socket.id);
            }
            console.log("❌ 切断:", socket.id);
        })
    });
}