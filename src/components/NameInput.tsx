import { useState } from "react";

type Props = {
    onSubmit: (name: string) => void;
}

export default function NameInput({ onSubmit }: Props) {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim());
            setName("");
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前を入力"
                className="border px-2 py-1 rounded"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-3 py-1 rounded"
            >
                決定
            </button>
        </div>
    )
}