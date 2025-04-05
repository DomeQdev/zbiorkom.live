import { create } from "zustand";

interface StopState {
    limit: number;
    time?: number;
    destination?: string;
    destinationName?: string;
    expandLimit: (by: number) => void;
    setTime: (time: number) => void;
    setDestination: (id: string, name: string) => void;
    reset: () => void;
}

export default create<StopState>()((set) => ({
    limit: 20,
    expandLimit: (by) => set((state) => ({ limit: state.limit + by })),
    setTime: (time) => set({ time }),
    setDestination: (destination, destinationName) => set({ destination, destinationName }),
    reset: () => set({ limit: 20, time: undefined, destination: undefined, destinationName: undefined }),
}));
