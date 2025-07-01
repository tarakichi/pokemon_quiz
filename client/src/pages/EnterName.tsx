import { useContext, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8);
}

export default function EnterName() {
    const socket = useContext(SocketContext);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = () => {
        if (socket && name.trim()) {
            const roomId = generateRoomId();
            localStorage.setItem("nickname", name);
            navigate(`/room/${roomId}`);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1>名前を入力してください</h1>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: ピカチュウ"
                className="border px-4 py-2 rounded"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                ルームを作成
            </button>
        </div>
    );
}