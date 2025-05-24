import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Location, NominatimPlace, PlannerItinerary } from "typings";

export const useQueryGeocode = (query: string) => {
    const params = new URLSearchParams();

    params.append("q", query);
    params.append("format", "json");
    params.append("addressdetails", "1");
    params.append("countrycodes", "pl");

    return useQuery({
        queryKey: ["geocode", query],
        queryFn: async ({ signal }) => {
            if (!query) return [];

            await new Promise((resolve) => setTimeout(resolve, 300));
            if (signal.aborted) return;

            return fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
                headers: {
                    "Accept-Language": "pl",
                },
            })
                .then((res) => res.json() as Promise<NominatimPlace[]>)
                .catch(() => []);
        },
    });
};

export const useQueryPlannerItineraries = (
    city: string,
    [fromLon, fromLat]: Location,
    [toLon, toLat]: Location,
    time: number,
    arriveBy: boolean
) => {
    const params = new URLSearchParams();

    params.append("fromPlace", `${fromLat},${fromLon}`);
    params.append("toPlace", `${toLat},${toLon}`);
    params.append("time", time.toString());
    params.append("arriveBy", arriveBy.toString());

    return useQuery({
        queryKey: ["trip-planner", fromLon, fromLat, toLon, toLat, time, arriveBy],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (signal.aborted) return;

            return fetchWithAuth<PlannerItinerary[]>(
                `${Gay.base}/${city}/tripPlanner/getJourneys?${params.toString()}`
            );
        },
    });
};
