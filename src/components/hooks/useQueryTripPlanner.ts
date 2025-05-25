import { ESearchPlace, PlannerItinerary, SearchPlace } from "typings";
import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import useLocationStore from "./useLocationStore";
import cities from "cities";
import { Place } from "./usePlacesStore";

export const useQuerySearchPlaces = (city: string, query: string) => {
    const [longitude, latitude] = useLocationStore((state) => state.userLocation! || cities[city].location);
    const params = new URLSearchParams();

    params.append("query", query);
    params.append("longitude", longitude.toString());
    params.append("latitude", latitude.toString());

    return useQuery({
        queryKey: ["searchPlaces", city, query],
        queryFn: async ({ signal }) => {
            if (!query) return [];

            await new Promise((resolve) => setTimeout(resolve, 300));
            if (signal.aborted) return;

            return fetchWithAuth<SearchPlace[]>(
                `${Gay.base}/${city}/tripPlanner/searchPlaces?${params.toString()}`
            );
        },
    });
};

export const useQueryPlannerItineraries = (
    city: string,
    from: Place,
    to: Place,
    time: number,
    arriveBy: boolean
) => {
    const params = new URLSearchParams();

    const fromPlace = from.place?.[ESearchPlace.id] || from.location?.join(",");
    const toPlace = to.place?.[ESearchPlace.id] || to.location?.join(",");

    params.append("fromPlace", fromPlace || "");
    params.append("toPlace", toPlace || "");
    params.append("time", time.toString());
    params.append("arriveBy", arriveBy.toString());

    return useQuery({
        queryKey: ["tripPlanner", fromPlace, toPlace, time, arriveBy],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (signal.aborted) return;

            return fetchWithAuth<{ journeys: PlannerItinerary[] }>(
                `${Gay.base}/${city}/tripPlanner/getJourneys?${params.toString()}`
            );
        },
        enabled: Boolean(fromPlace && toPlace),
    });
};
