import { PlannerItinerary, SearchPlace } from "typings";
import { create } from "zustand";

export type Place = {
    place?: SearchPlace;
    text: string;
};

export interface TripPlannerState {
    places: Record<"from" | "to", Place>;
    itineraries?: PlannerItinerary[];
    lastRefresh?: number;
    setPlace: (type: "from" | "to", place: Place) => void;
    switchPlaces: () => void;
    setItineraries: (itineraries: PlannerItinerary[]) => void;
    reset: () => void;
}

export default create<TripPlannerState>()((set) => ({
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
    setItineraries: (itineraries) => {
        set((state) => ({ itineraries, lastRefresh: Date.now() }));
    },
    reset: () => {
        set(() => ({
            places: {
                from: { text: "" },
                to: { text: "" },
            },
            itineraries: undefined,
            lastRefresh: undefined,
        }));
    },
}));
