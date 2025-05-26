import { Location, SearchPlace } from "typings";
import { create } from "zustand";

export type Place = {
    place?: SearchPlace;
    text: string;
    location?: Location;
};

export interface PlacesState {
    places: Record<"from" | "to", Place>;
    setPlace: (type: "from" | "to", place: Place) => void;
    switchPlaces: () => void;
}

export default create<PlacesState>()((set) => ({
    places: {
        from: { text: "" },
        to: { text: "" },
    },
    setPlace: (type, place) => set((state) => ({ places: { ...state.places, [type]: place } })),
    switchPlaces: () => {
        set((state) => ({
            places: { from: state.places.to, to: state.places.from },
        }));
    },
}));
