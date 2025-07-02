import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "../contexts/SocketContext";
import { useNavigate, useParams } from "react-router-dom";

type QuizQuestion = {
    id: number;
    ja: string;
    sprite_url: string;
};

type Result = {
    winnerId: string;
    nickname: string;
};

type ScoreEntry = {
    id: string;
    nickname: string;
    score: number;
};

export default function RoomQuiz() {
    const socket = useContext(SocketContext);
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [question, setQuestion] = useState<QuizQuestion | null>(null);
    const [answer, setAnswer] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [myId, setMyId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);
    const hasSentInitialQuestion = useRef(false);
    const [isFinished, setIsFinished] = useState(false);
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    const nickname = localStorage.getItem("nickname") || "名無し";

    useEffect(() => {
        if (socket && roomId) {
            socket.emit("get-my-id");
            socket.on("your-id", (id) => {
                setMyId(id);
            });

            socket.on("quiz-question", (q: QuizQuestion) => {
                setQuestion(q);
                setRevealed(false);
                setResult(null);
            });

            socket.on("quiz-result", (res: Result) => {
                setResult(res);
                setRevealed(true);
            });

            socket.on("host-id", (hostId: string) => {
                setIsHost(hostId === socket.id);
            });

            socket.emit("host-id-request", { roomId });

            if (isHost && !hasSentInitialQuestion.current) {
                socket.emit("quiz-next", { roomId });
                hasSentInitialQuestion.current = true;
            }

            socket.on("quiz-finished", (finalScores: ScoreEntry[]) => {
                setIsFinished(true);
                setScores(finalScores);
            });

            return () => {
                socket.off("quiz-question");
                socket.off("quiz-result");
                socket.off("your-id");
                socket.off("host-id");
                socket.off("quiz-finished");
            };
        }
    }, [socket, roomId, isHost]);

    const handleAnswer = () => {
        if (socket && roomId && question && !revealed) {
            socket.emit("quiz-answer", {
                roomId,
                answer,
            });
            setAnswer("");
        }
    };

    const handleNext = () => {
        if (isHost && socket && roomId) {
            socket.emit("quiz-next", { roomId });
        }
    };

    return (
        <div className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">クイズ</h2>
            <p className="mb-2">あなたの名前: {nickname}</p>
            {question ? (
                <>
                    <img
                        src={`/sprites/${question.id}.png`}
                        alt="シルエット"
                        className={`w-48 h-48 mb-4 ${revealed ? "" : "brightness-0"}`}
                    />
                    {revealed && <p className="text-xl mb-2">{question.ja}</p>}
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAnswer()}
                        className="mb-2 border px-2 py-1 rounded text-center"
                        placeholder="ポケモンの名前"
                        disabled={revealed}
                    />
                    <div className="flex gap-2">
                        {!revealed && (
                            <button
                                onClick={handleAnswer}
                                className="bg-blue-500 text-white px-4 py-1 rounded"
                            >
                                回答
                            </button>
                        )}
                        {revealed && isHost && (
                            <button
                                onClick={handleNext}
                                className="bg-green-500 text-white px-4 py-1 rounded"
                            >
                                次の問題
                            </button>
                        )}
                    </div>
                    {result && (
                        <div className="mt-4 text-center">
                            <p>🏆 最速正解者: {result.nickname}</p>
                        </div>
                    )}
                </>
            ) : (
                <p>問題を待っています...</p>
            )}
            {isFinished && (
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-bold mb-4">🎉 ゲーム終了！</h2>
                    <h3 className="text-lg mb-2">スコア一覧</h3>
                    <ul className="mb-4">
                        {scores.map((s) => (
                            <li key={s.id}>
                                {s.nickname}: {s.score} 点
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => navigate(`/room/${roomId}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        ルームに戻る
                    </button>
                </div>
            )}
        </div>
    );
}