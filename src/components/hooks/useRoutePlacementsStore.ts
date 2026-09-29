import { create } from "zustand";
import { VehiclePlacement } from "typings";

interface RoutePlacementsState {
    placements: VehiclePlacement[];
    setPlacements: (placements: VehiclePlacement[]) => void;
}

export default create<RoutePlacementsState>()((set) => ({
    placements: [],
    setPlacements: (placements) => set({ placements }),
}));
