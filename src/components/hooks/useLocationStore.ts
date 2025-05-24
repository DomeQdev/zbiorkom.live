import { Location } from "typings";
import { create } from "zustand";

interface LocationState {
    userLocation?: Location;
    setUserLocation: (userLocation: Location) => void;
}

export default create<LocationState>()((set) => ({
    setUserLocation: (userLocation) => set({ userLocation }),
}));
