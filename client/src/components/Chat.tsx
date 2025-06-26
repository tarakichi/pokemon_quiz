import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Chat() {
    const [messages, setMessegas] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
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
        if (input) {
            console.log("📤 送信:", input);
            socket.emit("chat", input);
            setInput("");
        }
    };

    return (
        <div>
            <h2>チャット</h2>
            <div>
                {messages.map((m, i) => <div key={i}>{m}</div>)}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send}>送信</button>
        </div>
    )
}