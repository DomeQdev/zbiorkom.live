import useTripPlannerStore, { Place, TripPlannerTime } from "./useTripPlannerStore";
import { ESearchPlace, PlannerResult, SearchPlace } from "typings";
import { getFromAPI } from "@/util/fetchFunctions";
import { useShallow } from "zustand/react/shallow";
import useLocationStore from "./useLocationStore";
import { useQuery } from "@tanstack/react-query";
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
                signal,
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
    { timestamp, arriveBy }: TripPlannerTime,
) => {
    const setResult = useTripPlannerStore(useShallow((state) => state.setResult));

    const fromPlace = from.place?.[ESearchPlace.id];
    const toPlace = to.place?.[ESearchPlace.id];

    return useQuery({
        queryKey: ["tripPlanner", fromPlace, toPlace, timestamp, arriveBy],
        queryFn: async ({ signal }) => {
            if (!fromPlace || !toPlace) return;

            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (signal.aborted) return;

            const result = await getFromAPI<PlannerResult>(
                city,
                "tripPlanner/getJourneys",
                {
                    fromPlace,
                    toPlace,
                    time: timestamp === "now" ? Date.now() : timestamp,
                    arriveBy,
                },
                signal,
            );

            setResult(result);

            return !!result.itineraries.length;
        },
        enabled: Boolean(fromPlace && toPlace),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};
