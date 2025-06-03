import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { APISearch, Route } from "typings";
import useFilterStore from "./useFilterStore";

export const useQuerySearch = ({ city, search }: { city: string; search?: string }) => {
    const queryClient = useQueryClient();
    const queryKey = ["search", city];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 150));
            if (signal.aborted) return;

            return getFromAPI<APISearch>(city, "search", { query: search }, signal);
        },
        enabled: !!search,
    });

    useEffect(() => {
        return () => {
            queryClient.removeQueries({
                queryKey,
            });
        };
    }, [search]);

    return query;
};

export type SearchRoutesOrModelsResult = (Route | string)[];

export const useQuerySearchRoutesOrModels = ({ city }: { city: string }) => {
    const search = useFilterStore((state) => state.search);
    const queryClient = useQueryClient();
    const queryKey = ["filterSearch", city];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 150));
            if (signal.aborted) return;

            return getFromAPI<SearchRoutesOrModelsResult>(city, "search/filter", { query: search }, signal);
        },
        enabled: !!search,
    });

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey });
        };
    }, [search]);

    return query;
};
