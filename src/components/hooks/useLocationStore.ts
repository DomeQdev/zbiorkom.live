import { create } from "zustand";

interface LocationState {
    userLocation?: [number, number];
    setUserLocation: (userLocation: [number, number]) => void;
}

export default create<LocationState>()((set) => ({
    setUserLocation: (userLocation) => set({ userLocation }),
}));
