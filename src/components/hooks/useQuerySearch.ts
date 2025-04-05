import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { APISearch } from "typings";

type Props = {
    city: string;
    query?: string;
};

const fetchData = (city: Props["city"], query: Props["query"], signal: AbortSignal) => {
    if (!query) return;

    return fetchWithAuth<APISearch>(
        `${Gay.base}/${city}/search?query=${encodeURIComponent(query || "")}`,
        signal
    );
};

export default (props: Props) => {
    const queryClient = useQueryClient();

    const queryKey = ["search", props.city];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, 150));
            if (signal.aborted) return;

            return fetchData(props.city, props.query, signal);
        },
        enabled: !!props.query,
    });

    useEffect(() => {
        return () => {
            queryClient.removeQueries({
                queryKey,
            });
        };
    }, [props.query]);

    return query;
};
