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
        <div className="w-screen h-screen flex flex-col items-center bg-zinc-50 p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-full flex flex-col gap-4 justify-center items-center"
            >
                <h2 className="font-notosans text-2xl font-bold text-zinc-600">ルーム: {roomId}</h2>
                <h3 className="font-notosans font-bold text-md text-zinc-400">参加ユーザー</h3>
                <ul className="w-4/5 flex justify-center items-center overflow-x-auto p-4 border-y border-zinc-200 gap-6">
                    {users.map((user) => (
                        <li key={user.id} className="flex flex-col justify-center items-center gap-2 select-none p-2 shadow-md rounded-md bg-zinc-100">
                            <div className="w-20 h-20 shadow rounded-md bg-white">
                                <img src="/sprites/845.png" alt="" className="pointer-events-none"/>
                            </div>
                            <div className="w-30 h-7 flex items-center font-notosans text-sm justify-center text-zinc-800 font-semibold shadow rounded-md bg-white overflow-x-auto overflow-y-hidden">
                                {user.nickname}
                                {user.id === hostId && <img src="/poke-ball.png" title="ホスト" alt="ホスト" className="inline pointer-events-none"></img>}
                            </div>
                        </li>
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