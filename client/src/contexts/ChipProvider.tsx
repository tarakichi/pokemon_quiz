import { useState } from "react";
import ChipContext from "./ChipContext";

type Chip = { id: number, message: string };

const ChipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chips, setChips] = useState<Chip[]>([]);
    const [idCounter, setIdCounter] = useState(0);

    const showChip = (message: string) => {
        const id = idCounter;
        setIdCounter(id + 1);
        setChips((prev) => [...prev, {id, message}]);

        setTimeout(() => {
            setChips((prev) => prev.filter((chip) => chip.id !== id));
        }, 3000);
    };

    return (
        <ChipContext.Provider value={{ showChip }}>
            {children}
            <div className="chip-container">
                {chips.map((chip) => (
                    <div key={chip.id} className="chip">
                        {chip.message}
                    </div>
                ))}
            </div>
        </ChipContext.Provider>
    );
};

export default ChipProvider;