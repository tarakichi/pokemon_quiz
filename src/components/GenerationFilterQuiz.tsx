import React, { useEffect, useMemo, useState } from "react";
import pokemonData from "../../pokemonNameMap.json";

const generations = [
  { id: "generation-i", label: "第1世代" },
  { id: "generation-ii", label: "第2世代" },
  { id: "generation-iii", label: "第3世代" },
  { id: "generation-iv", label: "第4世代" },
  { id: "generation-v", label: "第5世代" },
  { id: "generation-vi", label: "第6世代" },
  { id: "generation-vii", label: "第7世代" },
  { id: "generation-viii", label: "第8世代" },
];

type PokemonEntry = {
  id: number;
  en: string;
  ja: string;
  types: string[];
  generation: string;
};

export default function GenerationFilterQuiz() {
  const [selectedGen, setSelectedGen] = useState("generation-i");
  const [quizPool, setQuizPool] = useState<PokemonEntry[]>([]);
  const [current, setCurrent] = useState<PokemonEntry | null>(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);

  // 絞り込み
  const filteredList: PokemonEntry[] = useMemo(() => {
    return pokemonData.filter((p) => p.generation === selectedGen);
  }, [selectedGen]);

  // 初期化 or 世代変更時にクイズリスト更新
  useEffect(() => {
    const shuffled = [...filteredList].sort(() => Math.random() - 0.5);
    setQuizPool(shuffled);
    setCurrent(shuffled[0]);
    setAnswer("");
    setRevealed(false);
  }, [filteredList]);

  const handleSubmit = () => {
    if (!current) return;
    const normalized = answer.replace(/[ぁ-ん]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) + 0x60)
    ); // ひらがな→カタカナ
    if (normalized === current.ja) {
      setRevealed(true);
    }
  };

  const handleNext = () => {
    if (quizPool.length <= 1) return;
    const next = quizPool.slice(1);
    setQuizPool(next);
    setCurrent(next[0]);
    setAnswer("");
    setRevealed(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ポケモンクイズ - 世代別</h1>

      <label className="block mb-2">出題する世代：</label>
      <select
        value={selectedGen}
        onChange={(e) => setSelectedGen(e.target.value)}
        className="border px-2 py-1 rounded mb-4"
      >
        {generations.map((g) => (
          <option key={g.id} value={g.id}>
            {g.label}
          </option>
        ))}
      </select>

      {current && (
        <div className="text-center">
          <img
            src={`/sprites/${current.en}.png`}
            className={revealed ? "inline" : "invert inline"}
            alt="pokemon"
            width={120}
            height={120}
          />

          <div className="mt-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="border px-2 py-1 rounded w-48 text-center"
              placeholder="名前を入力"
            />
          </div>

          <div className="mt-2 flex gap-2 justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              回答
            </button>
            <button
              onClick={() => setRevealed(true)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
            >
              答え合わせ
            </button>
            {revealed && (
              <button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                次へ
              </button>
            )}
          </div>

          {revealed && (
            <p className="mt-2 font-bold text-xl">{current.ja}</p>
          )}
        </div>
      )}
    </div>
  );
}
