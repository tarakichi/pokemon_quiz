import { useState } from "react";
import nameMap from "../../pokemonNameMap.json";

interface Pokemon {
  en: string;
  ja: string;
}

function toKatakana(input: string): string {
  return input.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

function pickRandom(list: Pokemon[]): Pokemon {
  return list[Math.floor(Math.random() * list.length)];
}

export default function Quiz() {
  const [remaining, setRemaining] = useState<Pokemon[]>([...nameMap]);
  const [current, setCurrent] = useState<Pokemon | null>(pickRandom([...nameMap]));
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const nextQuestion = () => {
    const nextList = remaining.filter((p) => p.en !== current?.en);
    if (nextList.length === 0) {
      setIsFinished(true);
      setCurrent(null);
    } else {
      const next = pickRandom(nextList);
      setCurrent(next);
      setRemaining(nextList);
    }
    setInput("");
    setResult(null);
    setRevealed(false);
  };

  const restartQuiz = () => {
    const reset = [...nameMap];
    setRemaining(reset);
    setCurrent(pickRandom(reset));
    setInput("");
    setResult(null);
    setRevealed(false);
    setIsFinished(false);
  };

  const handleAnswer = () => {
    if (!current) return;
    const userAnswer = toKatakana(input.trim());
    const correctAnswer = toKatakana(current.ja);

    if (userAnswer === correctAnswer) {
      setResult("correct");
      setRevealed(true);
    } else {
      setResult("wrong");
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-gray-100">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">ポケモン シルエットクイズ</h1>

        {isFinished ? (
          <>
            <p className="text-xl mb-4">全問出題が完了しました 🎉</p>
            <button
              onClick={restartQuiz}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
            >
              最初からやり直す
            </button>
          </>
        ) : current && (
          <>
            <img
              src={`/sprites/${current.en}.png`}
              alt="シルエット"
              className={`w-48 h-48 mb-4 ${revealed ? "" : "filter brightness-0"}`}
            />
            <button
                onClick={() => setShowHint((prev) => !prev)}
                className="mb-2 text-sm text-blue-600 underline"
            >
                {showHint ? "ヒントを隠す" : "ヒントを表示"}
            </button>
            {showHint && !revealed && (
                <p className="text-sm text-gray-600 mb-2">ヒント: {current.en}</p>
            )}

            <input
              type="text"
              className="border p-2 text-xl rounded mb-2 w-64 text-center"
              placeholder="日本語名を入力"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !revealed) handleAnswer();
              }}
              disabled={revealed}
            />

            <div className="flex gap-4 mb-4">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-lg"
                onClick={handleAnswer}
                disabled={revealed}
              >
                回答する
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-lg"
                onClick={handleReveal}
                disabled={revealed}
              >
                答え合わせ
              </button>
            </div>

            {result === "correct" && (
              <p className="text-green-600 text-xl font-bold">⭕ 正解！</p>
            )}
            {result === "wrong" && (
              <p className="text-red-600 text-xl font-bold">❌ 不正解…</p>
            )}

            {revealed && (
              <>
                <p className="text-xl mt-2">正解は「{current.ja}」でした！</p>
                <button
                  className="mt-4 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
                  onClick={nextQuestion}
                >
                  次の問題へ
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* ✅ クレジット表記（フッター） */}
      <footer className="mt-8 text-sm text-gray-500">
        画像提供: Pokémon Showdown（© Nintendo / Game Freak / Creatures Inc.）
      </footer>
    </div>
  );
}
