import { ESearchPlace, PlannerItinerary, SearchPlace } from "typings";
import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import useLocationStore from "./useLocationStore";
import cities from "cities";
import { Place } from "./usePlacesStore";

export const useQuerySearchPlaces = (city: string, query: string, enabled: boolean) => {
    const [longitude, latitude] = useLocationStore((state) => state.userLocation! || cities[city].location);

    return useQuery({
        queryKey: ["searchPlaces", city, query],
        queryFn: async ({ signal }) => {
            if (!query) return [];

            await new Promise((resolve) => setTimeout(resolve, 300));
            if (signal.aborted) return;

            return fetchWithAuth<SearchPlace[]>(
                `${Gay.base}/${city}/tripPlanner/searchPlaces` +
                    `?query=${encodeURIComponent(query)}` +
                    `&longitude=${longitude}` +
                    `&latitude=${latitude}`
            );
        },
        enabled,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};

export const useQueryPlannerItineraries = (
    city: string,
    from: Place,
    to: Place,
    time: number,
    arriveBy: boolean
) => {
    const fromPlace = from.place?.[ESearchPlace.id] || from.location?.join(",");
    const toPlace = to.place?.[ESearchPlace.id] || to.location?.join(",");

    return useQuery({
        queryKey: ["tripPlanner", fromPlace, toPlace, time, arriveBy],
        queryFn: async ({ signal }) => {
            if (!fromPlace || !toPlace) return;

            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (signal.aborted) return;

            const params = new URLSearchParams();
            params.append("fromPlace", fromPlace);
            params.append("toPlace", toPlace);
            params.append("time", time.toString());
            params.append("arriveBy", arriveBy.toString());

            return fetchWithAuth<PlannerItinerary[]>(
                `${Gay.base}/${city}/tripPlanner/getJourneys?${params.toString()}`
            );
        },
        enabled: Boolean(fromPlace && toPlace),
    });
};
