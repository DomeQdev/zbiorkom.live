import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIVehicle, ETrip } from "typings";
import useVehicleStore from "./useVehicleStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
    city: string;
    id: string;
};

const fetchData = (
    city: Props["city"],
    id: Props["id"],
    currentTrip: string | undefined,
    signal: AbortSignal
) => {
    const params = new URLSearchParams();

    params.set("id", id);
    if (currentTrip) params.set("trip", currentTrip);

    return fetchWithAuth<APIVehicle>(
        `${Gay.base}/${city}/trips/getTripByVehicle?${params.toString()}`,
        signal
    );
};

export default (props: Props) => {
    const queryClient = useQueryClient();
    const vehicleStore = useVehicleStore(useShallow((state) => state));

    const queryKey = ["vehicle", props.city, props.id];

    const query = useQuery({
        queryKey,
        queryFn: ({ signal }) => fetchData(props.city, props.id, vehicleStore.trip?.[ETrip.id], signal),
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (vehicleStore.fresh === undefined) vehicleStore.setFresh(true);
        if (query.data?.vehicle) vehicleStore.setVehicle(query.data.vehicle);
        if (query.data?.trip) vehicleStore.setTrip(query.data.trip);
        if (query.data?.stops?.length) vehicleStore.setStops(query.data.stops);
        if (query.data?.sequence !== undefined) vehicleStore.setSequence(query.data.sequence);
    }, [query.data, vehicleStore]);

    useEffect(() => {
        return () => {
            vehicleStore.reset();
            queryClient.removeQueries({
                queryKey,
            });
        };
    }, [props.city, props.id]);

    return query;
};
