import { ESearchPlace, PlannerResult, SearchPlace } from "typings";
import { getFromAPI } from "@/util/fetchFunctions";
import useLocationStore from "./useLocationStore";
import { useQuery } from "@tanstack/react-query";
import { Place } from "./usePlacesStore";
import cities from "cities";

export const useQuerySearchPlaces = (city: string, query: string) => {
    const [longitude, latitude] = useLocationStore((state) => state.userLocation! || cities[city].location);

    return useQuery({
        queryKey: ["searchPlaces", city, query],
        queryFn: async ({ signal }) => {
            if (!query) return [];

            await new Promise((resolve) => setTimeout(resolve, 300));
            if (signal.aborted) return;

            return getFromAPI<SearchPlace[]>(
                city,
                "tripPlanner/searchPlaces",
                {
                    query,
                    longitude,
                    latitude,
                },
                signal
            );
        },
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

            return getFromAPI<PlannerResult>(
                city,
                "tripPlanner/getJourneys",
                {
                    fromPlace,
                    toPlace,
                    time,
                    arriveBy,
                },
                signal
            );
        },
        enabled: Boolean(fromPlace && toPlace),
    });
};
