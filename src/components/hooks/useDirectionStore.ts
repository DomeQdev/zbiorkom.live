import { create } from "zustand";

interface DirectionState {
    direction: number;
    setDirection: (direction: number) => void;
}

export default create<DirectionState>()((set) => ({
    direction: 0,
    setDirection: (direction) => set({ direction }),
}));
