import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFromAPI } from "@/util/fetchFunctions";
import { useShallow } from "zustand/react/shallow";
import useVehicleStore from "./useVehicleStore";
import { APIVehicle, ETrip } from "typings";
import { useEffect } from "react";
import { polylineToGeoJson } from "@/util/tools";

type TripQueryProps = {
    city: string;
    trip?: string;
    vehicle?: string;
};

export const useQueryTrip = ({ city, trip, vehicle }: TripQueryProps) => {
    const vehicleStore = useVehicleStore(useShallow((state) => state));
    const queryClient = useQueryClient();
    const queryKey = ["trip", city, trip || vehicle];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            const response = await getFromAPI<APIVehicle>(
                city,
                trip ? "trips/getTripUpdate" : "trips/getTripByVehicle",
                {
                    trip,
                    vehicle,
                    currentTrip: vehicleStore.trip?.[ETrip.id],
                },
                signal
            );

            if (response.trip?.[ETrip.shape]) {
                response.trip[ETrip.shape] = polylineToGeoJson(response.trip[ETrip.shape] as any);
            }

            return response;
        },
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (vehicleStore.fresh === undefined) vehicleStore.setFresh(true);
        if (query.data?.vehicle) vehicleStore.setVehicle(query.data.vehicle);
        if (query.data?.trip) vehicleStore.setTrip(query.data.trip);
        if (query.data?.stops?.length) vehicleStore.setStops(query.data.stops);
        if (query.data?.sequence !== undefined) vehicleStore.setSequence(query.data.sequence);
        if (query.data?.lastPing !== undefined) vehicleStore.setLastPing(query.data.lastPing);
    }, [query.data, vehicleStore]);

    useEffect(() => {
        return () => {
            vehicleStore.reset();
            queryClient.removeQueries({ queryKey });
        };
    }, [city, trip, vehicle]);

    return query;
};
