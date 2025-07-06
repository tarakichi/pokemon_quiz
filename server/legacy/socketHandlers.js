const roomManager = require("./roomManager");
const quizManager = require("./quizManager");

module.exports = function setupSocketHandlers(io) {
    io.on("connection", (socket) => {
        console.log("✅ ユーザー接続:", socket.id);

        //ルーム関連イベント
        socket.on("join-room", ({ roomId, nickname }) => {
            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.data.nickname = nickname;

            roomManager.joinRoom(io, roomId, socket.id, nickname);
            socket.emit("your-id", socket.id);
        });

        socket.on("start-game", ({ roomId }) => {
            const hostId = roomManager.getHostId(roomId);
            if (hostId) {
                socket.emit("host-id", hostId);
            }
            
            io.to(roomId).emit("start-game");
        });

        socket.on("host-id-request", ({ roomId }) => {
            const hostId = roomManager.getHostId(roomId);
            if (hostId) {
                socket.emit("host-id", hostId);
            }
        });

        //クイズ関連イベント
        socket.on("quiz-next", ({ roomId }) => {
            quizManager.sendNextQuestion(io, roomId);
        });

        socket.on("quiz-answer", ({ roomId, answer }) => {
            quizManager.checkAnswer(io, roomId, socket, answer);
        });

        //切断処理
        socket.on("disconnect", () => {
            const roomId = socket.data.roomId;
            if (roomId) {
                roomManager.leaveRoom(io, roomId, socket.id);
            }
            console.log("❌ 切断:", socket.id);
        });
    });
};
