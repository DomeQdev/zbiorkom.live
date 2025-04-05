import { create } from "zustand";

interface DirectionState {
    direction: 0 | 1;
    setDirection: (direction: 0 | 1) => void;
}

export default create<DirectionState>()((set) => ({
    direction: 0,
    setDirection: (direction) => set({ direction }),
}));
