import { createContext } from "react";
type ChipContextType = { showChip: (message: string) => void };

const ChipContext = createContext<ChipContextType | undefined>(undefined);

export default ChipContext;