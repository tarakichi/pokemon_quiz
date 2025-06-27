import { useContext, useEffect, useState } from "react";
import SocketContext from "../contexts/SocketContext";

export default function Chat() {
    const socket = useContext(SocketContext);
    const [messages, setMessegas] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            console.log("✅ クライアントが接続されました");
        });

        socket.on("chat", (msg: string) => {
            console.log("📥 メッセージ受信:", msg);
            setMessegas(prev => [...prev, msg]);
        });

        return () => {
            socket.off("chat");
        };
    }, []);

    const send = () => {
        if (socket && input) {
            console.log("📤 送信:", input);
            socket.emit("chat", input);
            setInput("");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h2>チャット</h2>
            <div>
                {messages.map((m, i) => <div key={i}>{m}</div>)}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="bg-white border"
            />
            <button onClick={send} className="bg-indigo-600 text-white rounded-md px-4 py-2">送信</button>
        </div>
    )
}