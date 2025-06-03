import { getFromAPI } from "@/util/fetchFunctions";
import useLocationStore from "./useLocationStore";
import { useQuery } from "@tanstack/react-query";
import { Route, RouteInfo } from "typings";

export const useQueryRoutes = ({ city }: { city: string }) => {
    return useQuery({
        queryKey: ["routes", city],
        queryFn: async ({ signal }) => getFromAPI<Route[]>(city, "routes/getAllRoutes", {}, signal),
    });
};

export const useQueryRoute = ({ city, route }: { city: string; route: string }) => {
    return useQuery({
        queryKey: ["route", city, route],
        queryFn: async ({ signal }) => getFromAPI<RouteInfo>(city, "routes/getRoute", { id: route }, signal),
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
                signal
            );
        },
        enabled: !!userLocation,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};
