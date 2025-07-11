import { useContext, useEffect, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";

type User = {
    id: string;
    nickname: string;
}

export default function Room() {
    const { roomId } = useParams();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [hostId, setHostId] = useState<string | null>(null);
    const [myId, setMyId] = useState<string | null>(null);
    const nickname = localStorage.getItem("nickname") || "名無し";

    useEffect(() => {
        if(socket && roomId) {

            socket.on("your-id", (id: string) => {
                setMyId(id);
            });
            
            socket.on("host-id", (id: string) => {
                setHostId(id);
            });
            
            socket.on("user-joined", (user: User) => {
                console.log(`🟢 ${user.nickname} が参加しました`);
            });
            
            socket.on("user-left", (user: User) => {
                console.log(`🔴 ${user.nickname} が退出しました`);
            });
            
            socket.on("start-game", () => {
                navigate(`/room/${roomId}/game`);
            });
            
            socket.on("room-users", (UserList: User[]) => {
                setUsers(UserList);
            });
            
            socket.emit("join-room", {roomId, nickname});

            return () => {
                socket.off("room-users");
                socket.off("host-id");
                socket.off("your-id");
                socket.off("user-joined");
                socket.off("user-left");
                socket.off("start-game");
            }
        };
    }, [socket, roomId, nickname, navigate]);

    const startGame = () => {
        if (socket && roomId) {
            socket.emit("start-game", { roomId });
        }
    };

    const isHost = myId === hostId;

    return (
        <div className="w-screen h-screen bg-zinc-50 p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h2 className="text-2xl font-bold mb-4">ルーム: {roomId}</h2>
                <p className="mb-2">あなたの名前: {nickname}</p>
                <h3 className="text-xl mb-2">参加ユーザー:</h3>
                <ul className="list-disc pl-6">
                    {users.map((user) => (
                        <li key={user.id}>{user.nickname} {user.id === hostId && "(ホスト)"}</li>
                    ))}
                </ul>

                {isHost && (
                    <button
                        onClick={startGame}
                        className="bg-green-600 text-white rounded-md px-4 py-2"
                    >
                        ゲーム開始！
                    </button>
                )}
            </motion.div>
        </div>
    );
}