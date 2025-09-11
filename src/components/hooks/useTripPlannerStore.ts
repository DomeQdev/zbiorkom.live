import { create } from "zustand";
import { getFromAPI } from "@/util/fetchFunctions";
import {
    EStopDeparture,
    EStopTime,
    Location,
    NonTransitLeg,
    PlannerItinerary,
    PlannerResult,
    SearchPlace,
    SelectedTrip,
    StopDeparture,
    TransitLeg,
} from "typings";

export type Place = {
    place?: SearchPlace;
    label?: string;
    input: string;
};

export type TripPlannerTime = {
    timestamp: number | "now";
    arriveBy: boolean;
};

export interface TripPlannerState {
    places: Record<"from" | "to", Place>;
    fromLocation?: Location;
    toLocation?: Location;
    itineraries?: PlannerItinerary[];
    lastRefresh?: number;
    time: TripPlannerTime;
    setPlace: (type: "from" | "to", place: Place) => void;
    switchPlaces: () => void;
    setTime: (time: TripPlannerTime) => void;
    setResult: (result: PlannerResult) => void;
    updateDepartures: (city: string, itineraryIndex?: number) => Promise<void>;
    reset: () => void;
}

export default create<TripPlannerState>()((set, get) => ({
    places: {
        from: { input: "" },
        to: { input: "" },
    },
    time: { timestamp: "now" as const, arriveBy: false },
    setPlace: (type, place) => set((state) => ({ places: { ...state.places, [type]: place } })),
    switchPlaces: () => {
        set((state) => ({
            places: { from: state.places.to, to: state.places.from },
        }));
    },
    setTime: (time) => set({ time }),
    setResult: ({ fromLocation, toLocation, itineraries }) => {
        set(({ time }) => ({
            fromLocation,
            toLocation,
            itineraries: itineraries
                .map((itinerary) => calculateItineraryMetadata(itinerary, time))
                .filter((itinerary) => itinerary.duration > 0)
                .sort((a, b) => a.duration - b.duration),
            lastRefresh: Date.now(),
        }));
    },
    updateDepartures: async (city, itineraryIndex) => {
        const { itineraries, time } = get();
        if (!itineraries?.length) return;

        const tokens = new Set<string>();
        for (let i = 0; i < itineraries.length; i++) {
            if (itineraryIndex !== undefined && itineraryIndex !== i) continue;

            for (const leg of itineraries[i].legs) {
                if (leg.mode === "TRANSIT") {
                    tokens.add(leg.token);
                }
            }
        }

        if (!tokens.size) return;

        const newDeparturesData = await getFromAPI<Record<string, StopDeparture[]>>(
            city,
            "tripPlanner/updateStopDepartures",
            { tokens: Array.from(tokens).join(",") }
        );

        set({
            itineraries: itineraries.map((itinerary) => {
                let hasChanges = false;

                for (const leg of itinerary.legs) {
                    if (leg.mode === "TRANSIT" && newDeparturesData[leg.token]) {
                        leg.departures = newDeparturesData[leg.token];
                        hasChanges = true;
                    }
                }

                if (!hasChanges) return itinerary;
                return calculateItineraryMetadata(itinerary, time, itinerary.selectedTrips);
            }),
            lastRefresh: Date.now(),
        });
    },
    reset: () => {
        set(() => ({
            places: {
                from: { input: "" },
                to: { input: "" },
            },
            itineraries: undefined,
            lastRefresh: undefined,
            time: { timestamp: "now" as const, arriveBy: false },
        }));
    },
}));

const findBestDeparture = (
    leg: TransitLeg,
    legIndex: number,
    currentTime: number,
    arriveBy: boolean,
    previousSelectedTrips?: SelectedTrip[]
) => {
    const previousSelection = previousSelectedTrips?.find((s) => s.legIndex === legIndex);

    if (previousSelection) {
        const foundTrip = leg.departures.find((d) => d[EStopDeparture.id] === previousSelection.tripId);

        if (foundTrip) {
            if (
                (arriveBy && foundTrip[EStopDeparture.destination]![EStopTime.estimated] > currentTime) ||
                (!arriveBy && foundTrip[EStopDeparture.departure][EStopTime.estimated] < currentTime)
            ) {
                return undefined;
            }

            return foundTrip;
        }
    }

    if (arriveBy) {
        let bestDeparture: StopDeparture | undefined;

        for (let i = leg.departures.length - 1; i >= 0; i--) {
            const departure = leg.departures[i];

            if (
                departure[EStopDeparture.destination] &&
                departure[EStopDeparture.destination]![EStopTime.estimated] <= currentTime
            ) {
                bestDeparture = departure;
                break;
            }
        }

        return bestDeparture;
    } else {
        const availableDepartures = leg.departures.filter(
            (departure) => departure[EStopDeparture.departure][EStopTime.estimated] >= currentTime
        );
        if (availableDepartures.length === 0) return undefined;

        if (previousSelection) {
            let closestDeparture: StopDeparture | undefined;
            let closestDiff = Infinity;

            for (const departure of availableDepartures) {
                const diff = Math.abs(
                    departure[EStopDeparture.departure][EStopTime.scheduled] - previousSelection.scheduled
                );

                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestDeparture = departure;
                }
            }

            if (closestDeparture) return closestDeparture;
        }

        return availableDepartures[0];
    }
};

const calculateItineraryMetadata = (
    itinerary: PlannerItinerary,
    { timestamp, arriveBy }: TripPlannerTime,
    previousSelectedTrips?: SelectedTrip[]
) => {
    const startTime = timestamp === "now" ? Date.now() : timestamp;
    const selectedTrips: SelectedTrip[] = [];
    let liveTrips = 0;

    if (arriveBy) {
        let currentTime = startTime;

        for (let legIndex = itinerary.legs.length - 1; legIndex >= 0; legIndex--) {
            const leg = itinerary.legs[legIndex];

            if (leg.mode === "TRANSIT") {
                const selectedDeparture = findBestDeparture(
                    leg,
                    legIndex,
                    currentTime,
                    true,
                    previousSelectedTrips
                );

                if (!selectedDeparture) return itinerary;

                if (selectedDeparture[EStopDeparture.departure][EStopTime.delay] !== "scheduled") {
                    liveTrips++;
                }

                currentTime = selectedDeparture[EStopDeparture.departure][EStopTime.estimated];
                selectedTrips.unshift({
                    tripId: selectedDeparture[EStopDeparture.id],
                    scheduled: selectedDeparture[EStopDeparture.departure][EStopTime.scheduled],
                    legIndex,
                });
            } else {
                currentTime -= leg.duration;
            }
        }

        return {
            ...itinerary,
            departureTime: currentTime,
            arrivalTime: startTime,
            duration: startTime - currentTime,
            isLive: liveTrips / selectedTrips.length >= 0.5,
            selectedTrips,
        };
    } else {
        let currentTime = startTime;

        for (const [legIndex, leg] of itinerary.legs.entries()) {
            if (leg.mode === "TRANSIT") {
                const selectedDeparture = findBestDeparture(
                    leg,
                    legIndex,
                    currentTime,
                    false,
                    previousSelectedTrips
                );

                if (!selectedDeparture) return itinerary;

                if (selectedDeparture[EStopDeparture.departure][EStopTime.delay] !== "scheduled") {
                    liveTrips++;
                }

                currentTime = selectedDeparture[EStopDeparture.destination]![EStopTime.estimated];
                selectedTrips.push({
                    tripId: selectedDeparture[EStopDeparture.id],
                    scheduled: selectedDeparture[EStopDeparture.departure][EStopTime.scheduled],
                    legIndex,
                });
            } else {
                currentTime += leg.duration;
            }
        }

        let departureTime = startTime;

        if (selectedTrips.length > 0) {
            const firstTrip = selectedTrips[0];
            const firstLegDepartures = (itinerary.legs[firstTrip.legIndex] as TransitLeg).departures;

            departureTime = firstLegDepartures.find(
                (departure) => departure[EStopDeparture.id] === firstTrip.tripId
            )![EStopDeparture.departure][EStopTime.estimated];

            for (let i = 0; i < firstTrip.legIndex; i++) {
                const leg = itinerary.legs[i] as NonTransitLeg;
                departureTime -= leg.duration;
            }
        }

        return {
            ...itinerary,
            departureTime,
            arrivalTime: currentTime,
            duration: currentTime - departureTime,
            isLive: liveTrips / selectedTrips.length >= 0.5,
            selectedTrips,
        };
    }
};
