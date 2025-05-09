import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import useLocationStore from "./useLocationStore";
import cities from "cities";
import { GeocodePlace } from "typings";

const timeout = 300;

export const useQueryGeocode = (city: string, query: string) => {
    const userLocation = useLocationStore((state) => state.userLocation);

    return useQuery({
        queryKey: ["geocode", query],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, timeout));
            if (signal.aborted) return;

            return fetchWithAuth<GeocodePlace[]>(
                `${Gay.base}/${city}/tripPlanner/geocode?query=${query}&place=${userLocation || cities[city].location}`,
                signal
            );
        },
        enabled: !!query,
    });
};
