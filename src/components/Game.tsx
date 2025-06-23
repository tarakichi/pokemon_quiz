import { useEffect, useMemo, useState } from "react";
import pokemonData from "../../pokemonNameMap.json";

const quizPoolTypes = [
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
    const [selectedQuizPoolType, setSelectedQuizPoolType] = useState(quizPoolTypes[1]);
    const [quizPool, setQuizPool] = useState<PokemonEntry[]>([]);
    const [current, setCurrent] = useState<PokemonEntry | null>(null);
    const [answer, setAnswer] = useState<string>("");
    const [reveald, setReveald] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const filteredlList: PokemonEntry[] = useMemo(() => {
        if (selectedQuizPoolType.category === "generation") {
            return pokemonData.filter((p) => p.generation === selectedQuizPoolType.id);
        } else {
            return pokemonData;
        }
    }, [selectedQuizPoolType]);
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
        <div className="p-4 max-w-xl mx-auto bg-indig-900">
            <h1 className="text-2xl">ポケモンシルエットクイズ</h1>
        </div>
    )
}