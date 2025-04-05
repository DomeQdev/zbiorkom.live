import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Route } from "typings";
import useLocationStore from "./useLocationStore";

type Props = {
    city: string;
};

const fetchData = (city: Props["city"], location: number[], signal: AbortSignal) => {
    return fetchWithAuth<Route[]>(
        `${Gay.base}/${city}/routes/getNearbyRoutes?lat=${location[1]}&lng=${location[0]}`,
        signal
    );
};

export default (props: Props) => {
    const userLocation = useLocationStore((state) => state.userLocation!);

    return useQuery({
        queryKey: ["routesNearby", props.city],
        queryFn: ({ signal }) => fetchData(props.city, userLocation, signal),
        enabled: !!userLocation,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};
