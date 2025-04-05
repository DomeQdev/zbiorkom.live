import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Route } from "typings";
import useFilterStore from "./useFilterStore";
import { useEffect } from "react";

type Props = {
    city: string;
};

export type SearchRoutesOrModelsResult = (Route | string)[];

const fetchData = (city: Props["city"], query: string, signal: AbortSignal) => {
    if (!query) return [];

    return fetchWithAuth<SearchRoutesOrModelsResult>(
        `${Gay.base}/${city}/search/filter?query=${encodeURIComponent(query)}`,
        signal
    );
};

export default (props: Props) => {
    const search = useFilterStore((state) => state.search);
    const queryClient = useQueryClient();

    const queryKey = ["filterSearch", props.city];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 150));
            if (signal.aborted) return;

            return fetchData(props.city, search, signal);
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
