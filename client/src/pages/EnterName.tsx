import { useContext, useRef, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function createOuterRipple(element: HTMLElement) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.className = "outer-ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
    document.body.appendChild(ripple);
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8);
}

export default function EnterName() {
    const socket = useContext(SocketContext);
    const [name, setName] = useState("");
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const rippleTargetRef = useRef<HTMLDivElement>(null);

    const handleSubmit = () => {
        if (name.trim()) {
            if (socket) {
                if (rippleTargetRef.current) {
                    createOuterRipple(rippleTargetRef.current);
                }
                setDisable(true);
                const roomId = generateRoomId();
                localStorage.setItem("nickname", name);
                setTimeout(() => {
                    navigate(`/room/${roomId}`);
                }, 300);
            }
        } else {
            alert("1文字以上の名前を入力してください。");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-zinc-100">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center justify-center w-full h-full"
                >
                <div
                    className="absolute z-1 h-3/4 aspect-square bg-white shadow-lg ring ring-zinc-50 rounded-full"
                    ref={rippleTargetRef}
                    />
                <div className="z-2 flex flex-col items-center justify-center gap-4 w-full h-full">
                    <h1 className="font-notosans font-bold text-zinc-400">名前を入力してください</h1>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="例: ピカチュウ"
                        className="border-2 border-zinc-200 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-200 text-zinc-500 px-4 py-2 rounded bg-white font-notosans"
                        />
                    <button
                        onClick={handleSubmit}
                        className="bg-sky-500 text-white px-4 py-2 rounded font-notosans"
                        disabled={disable}
                        >
                        ルームを作成
                    </button>
                </div>
            </motion.div>
        </div>
    );
}