import { useContext, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const joinGame = () => {
        if (!socket) return;
        if (name.trim()) {
            socket.emit("setName", name);
            navigate("/game");
        }
    };

    return (
        <div>
            <h1>ロビーへようこそ</h1>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="名前を入力"/>
            <button onClick={joinGame}>ゲームに参加</button>
        </div>
    );
}