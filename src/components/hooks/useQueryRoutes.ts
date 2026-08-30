import { getFromAPI } from "@/util/fetchFunctions";
import useLocationStore from "./useLocationStore";
import { useQuery } from "@tanstack/react-query";
import { Route, RouteGraph, RouteGraphRawResponse } from "typings";
import { polylineToGeoJson } from "@/util/tools";

export const ROUTE_GRAPH_ROW_HEIGHT = 48;

export const useQueryRoutes = ({ city }: { city: string }) => {
    return useQuery({
        queryKey: ["routes", city],
        queryFn: async ({ signal }) => getFromAPI<Route[]>(city, "routes", {}, signal),
    });
};

export const useQueryRouteGraph = ({ city, route }: { city: string; route: string }) => {
    return useQuery({
        queryKey: ["routeGraph", city, route],
        queryFn: async ({ signal }) => {
            const data = await getFromAPI<RouteGraphRawResponse | { error: string }>(
                city,
                `routes/${route}/graph`,
                {},
                signal,
            );

            if ("error" in data) throw new Error(data.error);

            return {
                ...data,
                shapes: data.shapes.map((direction) => direction.map(polylineToGeoJson)),
            } satisfies RouteGraph;
        },
    });
};

export const useQueryModels = ({ city, enabled = true }: { city: string; enabled?: boolean }) => {
    return useQuery({
        queryKey: ["models", city],
        queryFn: async ({ signal }) => getFromAPI<string[]>(city, "vehicles/models", {}, signal),
        enabled,
        staleTime: 5 * 60 * 1000,
    });
};

export const useQueryRoutesNearby = ({ city }: { city: string }) => {
    const userLocation = useLocationStore((state) => state.userLocation!);

    return useQuery({
        queryKey: ["routesNearby", city],
        queryFn: async ({ signal }) => {
            return getFromAPI<Route[]>(
                city,
                "routes/getNearbyRoutes",
                {
                    lat: userLocation[1],
                    lng: userLocation[0],
                },
                signal,
            );
        },
        enabled: !!userLocation,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};
