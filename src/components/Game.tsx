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
        <div className="p-4 h-fit w-full bg-indigo-50">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">ポケモンシルエットクイズ</h1>

                {isFinished && (
                    <div>
                        <h2>出題終了</h2>
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
                        >
                            もう一度
                        </button>
                    </div>
                )}

                {current && (
                    <>
                        <div className="bg-white rounded-2xl">
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
                                if (e.key === " ") {
                                    e.preventDefault();
                                    if (!reveald) setReveald(true);
                                }
                            }}
                            className="border bg-white text-center"
                            placeholder="名前を入力＜全角＞"
                        />
                        <div>
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                            >
                                回答
                            </button>
                            <button
                                onClick={() => setReveald(true)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                            >
                                答え合わせ
                            </button>
                            {reveald && (
                                <p className="font-bold text-xl">{current.ja}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}