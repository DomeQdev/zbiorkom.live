import { create } from "zustand";

interface StopState {
    color: string;
    setColor: (color: string) => void;
}

export default create<StopState>()((set) => ({
    color: localStorage.getItem("themeColor") || "#276b2b",
    setColor: (color) => {
        localStorage.setItem("themeColor", color);
        document.querySelector("meta[name=theme-color]")?.setAttribute("content", color);

        set({ color });
    },
}));
