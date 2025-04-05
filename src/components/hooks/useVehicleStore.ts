import { APIVehicle } from "typings";
import { create } from "zustand";

interface VehicleState extends APIVehicle {
    fresh?: boolean;
    setFresh: (fresh: boolean) => void;
    setVehicle: (vehicle: APIVehicle["vehicle"]) => void;
    setTrip: (trip: APIVehicle["trip"]) => void;
    setStops: (stops: APIVehicle["stops"]) => void;
    setSequence: (sequence: APIVehicle["sequence"]) => void;
    reset: () => void;
}

export default create<VehicleState>()((set) => ({
    setFresh: (fresh) => set({ fresh }),
    setVehicle: (vehicle) => set({ vehicle }),
    setTrip: (trip) => set({ trip }),
    setStops: (stops) => set({ stops }),
    setSequence: (sequence) => set({ sequence }),
    reset: () => {
        set({ vehicle: undefined, trip: undefined, fresh: undefined, stops: undefined, sequence: undefined });
    },
}));
