import { useContext, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8);
}

export default function EnterName() {
    const socket = useContext(SocketContext);
    const [ name, setName ] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = () => {
        if (name.trim()) {
            if (socket) {
                const roomId = generateRoomId();
                localStorage.setItem("nickname", name);
                setInterval(() => {
                    navigate(`/room/${roomId}`);
                }, 1000);
            }
        } else {
            alert("1文字以上の名前を入力してください。");
        }
    };
    return (
        <div className="flex flex-col items-center justify-centerflex flex-col items-center justify-center w-screen h-screen bg-zinc-100">
            <div className="absolute h-3/4 aspect-square bg-white shadow-lg ring ring-zinc-50 rounded-full"></div>
            <div className="z-1 flex flex-col items-center justify-center gap-4 w-full h-full">
                <h1 className="font-notosans font-bold text-zinc-400">名前を入力してください</h1>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: あああああ"
                    className="border-2 border-zinc-200 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-200 text-zinc-500 px-4 py-2 rounded bg-white font-notosans"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-sky-500 text-white px-4 py-2 rounded font-notosans"
                >
                    ルームを作成
                </button>
            </div>
        </div>
    );
}