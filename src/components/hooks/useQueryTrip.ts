import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { APIVehicle } from "typings";

type Props = {
    city: string;
    trip: string;
};

const fetchData = (city: Props["city"], trip: Props["trip"], signal: AbortSignal) => {
    return fetchWithAuth<APIVehicle>(
        `${Gay.base}/${city}/trips/getTrip?id=${encodeURIComponent(trip)}`,
        signal
    );
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["trip", props.city, props.trip],
        queryFn: ({ signal }) => fetchData(props.city, props.trip, signal),
    });
};
