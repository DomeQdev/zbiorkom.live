import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { ERoute, Route, SearchErrorResponse, SearchResponse } from "typings";
import useFilterStore from "./useFilterStore";
import { useQueryModels, useQueryRoutes } from "./useQueryRoutes";

const isErrorResponse = (data: any): data is SearchErrorResponse =>
    !!data && typeof data === "object" && typeof data.error === "string";

export const useQuerySearch = ({ city, search }: { city: string; search?: string }) => {
    const queryClient = useQueryClient();
    const queryKey = ["search", city, search];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (signal.aborted) return;

            const data = await getFromAPI<SearchResponse | SearchErrorResponse>(
                city,
                "search",
                { query: search },
                signal,
            );

            if (isErrorResponse(data)) throw new Error(data.error);

            return data;
        },
        enabled: !!search,
    });

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ["search", city] });
        };
    }, [search]);

    return query;
};

export type SearchRoutesOrModelsResult = (Route | string)[];

export const useQuerySearchRoutesOrModels = ({ city }: { city: string }) => {
    const search = useFilterStore((state) => state.search);
    const { data: routes, isLoading: routesLoading, error: routesError } = useQueryRoutes({ city });
    const { data: models, isLoading: modelsLoading, error: modelsError } = useQueryModels({ city });

    const data = useMemo<SearchRoutesOrModelsResult | undefined>(() => {
        if (!search || !routes || !models) return undefined;

        const q = search.trim().toLowerCase();
        if (!q) return [];

        const matchedRoutes = routes.filter((r) => {
            return r[ERoute.name].toLowerCase().includes(q) || r[ERoute.longName]?.toLowerCase().includes(q);
        });

        const matchedModels = models.filter((m) => m.toLowerCase().includes(q));

        return [...matchedRoutes, ...matchedModels];
    }, [search, routes, models]);

    return {
        data,
        isLoading: !!search && (routesLoading || modelsLoading),
        error: routesError ?? modelsError,
    };
};
