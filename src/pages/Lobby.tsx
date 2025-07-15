import { useContext, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const joinGame = () => {
        if (socket && name.trim()) {
            socket.emit("setName", name);
            // localStorage.setItem("myName", name);
            navigate("/game");
        }
    };

    return (
        <div className='min-h-screen bg-gray-900 overflow-hidden flex flex-col items-center justify-center px-5 py-5'>
            <div>
                <h1>ロビーへようこそ</h1>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="名前を入力"/>
                <button onClick={joinGame}>ゲームに参加</button>
            </div>
        </div>
    );
}