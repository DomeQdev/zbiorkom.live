import { create } from "zustand";
import { mapStyles } from "@/map/mapStyle";

export type MapStyleId = keyof typeof mapStyles;
export type MapAppearance = "light" | "dark";

interface MapStyleState {
    selectedStyle: string;
    basicAppearance: string;
    selectStyle: (style: MapStyleId) => void;
    setBasicAppearance: (appearance: MapAppearance) => void;
}

export const useMapStyleStore = create<MapStyleState>((set) => ({
    selectedStyle: localStorage.getItem("mapStyle") || "basic",
    basicAppearance: localStorage.getItem("mapStyleBasicVariant") || "light",
    selectStyle: (style) => {
        localStorage.setItem("mapStyle", style);
        set({ selectedStyle: style });
    },
    setBasicAppearance: (appearance) => {
        localStorage.setItem("mapStyleBasicVariant", appearance);
        set({ basicAppearance: appearance });
    },
}));
