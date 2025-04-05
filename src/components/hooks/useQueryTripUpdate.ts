import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIVehicle } from "typings";
import { useEffect } from "react";

type Props = {
    city: string;
    trip: string;
};

const fetchData = (city: Props["city"], trip: Props["trip"], signal: AbortSignal) => {
    return fetchWithAuth<APIVehicle>(
        `${Gay.base}/${city}/trips/getTripUpdate?trip=${encodeURIComponent(trip)}`,
        signal
    );
};

export default (props: Props, useRefetch: boolean = false) => {
    const queryClient = useQueryClient();

    const queryKey = ["tripUpdate", props.city, props.trip];

    const query = useQuery({
        queryKey,
        queryFn: ({ signal }) => fetchData(props.city, props.trip, signal),
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (!useRefetch) return;

        return () => {
            queryClient.removeQueries({
                queryKey,
            });
        };
    }, [props.city, props.trip]);

    return query;
};
