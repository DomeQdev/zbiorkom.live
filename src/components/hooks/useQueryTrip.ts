import { useShallow } from "zustand/react/shallow";
import useVehicleStore from "./useVehicleStore";
import { Itinerary, Trip, Vehicle } from "typings";
import { useEffect, useMemo } from "react";
import { polylineToGeoJson } from "@/util/tools";
import { useEventQuery } from "./useEventQuery";
import { StopUpdate } from "typings";

type TripQueryProps = {
    city: string;
    trip?: string;
    vehicle?: string;
};

type StreamInitial = {
    trip: Trip;
    itinerary: Itinerary;
};

type StreamMessage = {
    position: Vehicle;
    sequence: number;
    stops: [arrival: any, departure: any][]; // StopUpdate maps back to this essentially, but we need to format it to StopUpdate style if needed
};

export const useQueryTrip = ({ city, trip, vehicle }: TripQueryProps) => {
    const setFresh = useVehicleStore((state) => state.setFresh);
    const setItinerary = useVehicleStore((state) => state.setItinerary);
    const setTrip = useVehicleStore((state) => state.setTrip);
    const setVehicle = useVehicleStore((state) => state.setVehicle);
    const setLastPing = useVehicleStore((state) => state.setLastPing);
    const setStops = useVehicleStore((state) => state.setStops);
    const setSequence = useVehicleStore((state) => state.setSequence);
    const reset = useVehicleStore((state) => state.reset);
    const getFresh = useVehicleStore((state) => state.fresh);

    const endpoint = useMemo(() => {
        if (trip) return `trips/${encodeURIComponent(trip)}/stream`;
        if (vehicle) return `positions/${encodeURIComponent(vehicle)}/stream`;
        return "";
    }, [trip, vehicle]);

    const {
        data: rawData,
        initialData: rawInitial,
        loadingState,
    } = useEventQuery<StreamMessage, StreamInitial>(city, endpoint, {
        enabled: !!endpoint,
        resetKey: trip || vehicle,
    });

    useEffect(() => {
        if (getFresh === undefined) setFresh(true);

        if (rawInitial) {
            let newItinerary: Itinerary = [...rawInitial.itinerary] as Itinerary;
            if (newItinerary[1] && typeof newItinerary[1] === "string") {
                newItinerary[1] = polylineToGeoJson(newItinerary[1] as any) as any;
            }
            setItinerary(newItinerary);
            setTrip(rawInitial.trip);
        }

        if (rawData) {
            if (rawData.position) {
                setVehicle(rawData.position);
                setLastPing(rawData.position[6]); // EVehicle.lastPing
            }
            if (rawData.stops) {
                const updates = rawData.stops.map((stop: any) => {
                    return [stop[0], stop[1], "", "", []] as unknown as StopUpdate;
                });
                setStops(updates);
            }
            if (rawData.sequence !== undefined) {
                setSequence(rawData.sequence);
            }
        }
    }, [rawInitial, rawData]);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [city, trip, vehicle]);

    return {
        data: rawData,
        initialData: rawInitial,
        isLoading: loadingState?.loading,
        refetch: () => {},
        error: loadingState?.error,
    };
};
