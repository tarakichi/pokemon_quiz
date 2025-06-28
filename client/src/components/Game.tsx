import { useEffect, useMemo, useState } from "react";
import pokemonData from "../../pokemonNameMap.json";

const quizRangeTypes = [
    { category: "other", id: "all", label: "全てのポケモン"},
    { category: "generation", id: "generation-i", label: "第1世代" },
    { category: "generation", id: "generation-ii", label: "第2世代" },
    { category: "generation", id: "generation-iii", label: "第3世代"},
    { category: "generation", id: "generation-iv", label: "第4世代"},
    { category: "generation", id: "generation-v", label: "第5世代"},
    { category: "generation", id: "generation-vi", label: "第6世代"},
    { category: "generation", id: "generation-vii", label: "第7世代"},
    { category: "generation", id: "generation-viii", label: "第8世代"},
];

type PokemonEntry = {
    id: number;
    en: string;
    ja: string;
    types: string[];
    generation: string;
    height: number;
    weight: number;
    base_stats: {
        hp: number;
        attack: number;
        defense: number;
        special_attack: number;
        special_defense: number;
        speed: number;
    };
    abilities: string[];
    is_legendary: boolean;
    is_mythical: boolean;
    genera: string;
}

export default function Game() {
    const [selectedQuizRange, setSelectedQuizRange] = useState(quizRangeTypes[1]);
    const [quizPool, setQuizPool] = useState<PokemonEntry[]>([]);
    const [current, setCurrent] = useState<PokemonEntry | null>(null);
    const [answer, setAnswer] = useState<string>("");
    const [reveald, setReveald] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const filteredlList: PokemonEntry[] = useMemo(() => {
        if (selectedQuizRange.category === "generation") {
            return pokemonData.filter((p) => p.generation === selectedQuizRange.id);
        } else {
            return pokemonData;
        }
    }, [selectedQuizRange]);
    const currentIndex = filteredlList.length - quizPool.length + 1;

    useEffect(() => {
        const shuffled = [...filteredlList].sort(() => Math.random() - 0.5);
        setQuizPool(shuffled);
        setCurrent(shuffled[0]);
        setAnswer("");
        setReveald(false);
        setScore(0)
        setIsFinished(false);
    }, [filteredlList]);

    const handleSubmit = () => {
        if (!current || reveald) return;
        const normalized = answer.replace(/[ぁ-ん]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) + 0x60)
        );
        if (normalized === current.ja) {
            setReveald(true);
            setScore((prev) => prev + 1);
        }
        setAnswer("");
    };

    const handleNext = () => {
        if (quizPool.length <= 1) {
            setCurrent(null);
            setIsFinished(true);
            return;
        }
        const next = quizPool.slice(1);
        setQuizPool(next);
        setCurrent(next[0]);
        setAnswer("");
        setReveald(false);
    };

    return (
        <div className="p-4 h-fit w-full">
            <div className="flex flex-col items-center">
                <div className="relative z-0 flex items-start w-full pointer-events-none">
                    <h1 className="absolute mb-5 text-6xl font-extrabold font-notosans text-gray-900/5">Pokemon</h1>
                    <h1 className="absolute mb-5 text-6xl font-extrabold font-notosans text-gray-900/5 top-25">Silhouette</h1>
                    <h1 className="absolute mb-5 text-6xl font-extrabold font-notosans text-gray-900/5 top-50">Quiz</h1>
                </div>
                <div className="z-10 flex items-center mb-5">
                    <label className="font-notosans font-light">出題する世代：</label>
                    <select
                        value={selectedQuizRange.id}
                        onChange={(e) => setSelectedQuizRange(quizRangeTypes.find(q => q.id === e.target.value) || quizRangeTypes[0])}
                        className="border px-2 py-1 rounded bg-white font-notosans font-medium text-center"
                    >
                        {quizRangeTypes.map((q) => (
                            <option key={q.id} value={q.id}>
                                {q.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="z-10 mb-5 flex flex-col items-center">
                    <h3 className="mb-1 font-notosans font-light">スコア: {score}</h3>
                    <h3 className="font-notosans font-light">{currentIndex} / {filteredlList.length} 問中</h3>
                </div>
                <div className="z-10 flex flex-col items-center">
                    {isFinished && (
                        <div className="flex flex-col items-center">
                            <h2 className="mb-3">出題終了</h2>
                            <button
                                onClick={() => {
                                    const reshuffled = [...filteredlList].sort(() => Math.random() - 0.5);
                                    setQuizPool(reshuffled);
                                    setCurrent(reshuffled[0]);
                                    setAnswer("");
                                    setReveald(false);
                                    setScore(0);
                                    setIsFinished(false);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                もう一度
                            </button>
                        </div>
                    )}
                    {current && (
                        <>
                            {reveald ? (
                                <p className="text-xl font-notosans font-medium mb-3">{current.ja}</p>
                            ) : (
                                <p className="text-xl font-notosans font-medium mb-3">???</p>
                            )}
                            <div className="mb-7 bg-white rounded-2xl pointer-events-none shadow-xl ring-gray-900/5 select-none">
                                <img
                                    src={`/sprites/${current.en}.png`}
                                    alt="シルエット"
                                    className={`w-48 h-48 ${reveald ? "" : "brightness-0"}`}
                                />
                            </div>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (reveald) {
                                            handleNext();
                                        } else {
                                            handleSubmit();
                                        }
                                    }
                                    if (e.ctrlKey && e.key === "Enter") {
                                        e.preventDefault();
                                        if (!reveald) setReveald(true);
                                    }
                                }}
                                className="mb-3 border bg-white text-center font-notosans font-medium rounded"
                                placeholder="名前を入力＜全角＞"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded font-notosans font-light"
                                >
                                    回答
                                </button>
                                <button
                                    onClick={() => setReveald(true)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded font-notosans font-light"
                                >
                                    答え合わせ
                                </button>
                                {reveald && (
                                    <button
                                        onClick={handleNext}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded font-notosans font-light"
                                    >
                                        次へ
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}