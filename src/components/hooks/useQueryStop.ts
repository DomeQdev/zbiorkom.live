import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/util/fetchFunctions";
import useStopStore from "./useStopStore";
import { useEffect } from "react";
import { StopDepartures } from "typings";

type Props = {
    city: string;
    stop: string;
    destinations?: string[];
    limit?: number;
    wait?: number;
};

const fetchData = (
    city: Props["city"],
    stop: Props["stop"],
    limit: Props["limit"],
    destinations: Props["destinations"],
    signal: AbortSignal
) => {
    const params = new URLSearchParams();

    params.set("id", stop);
    if (limit) params.set("limit", limit.toString());
    if (destinations) params.set("destinations", destinations.join(","));

    return fetchWithAuth<StopDepartures>(`${Gay.base}/${city}/stops/getDepartures?${params.toString()}`, signal);
};

export default (props: Props, useRefetch: boolean = false) => {
    const stopStore = useStopStore((state) => state);
    const queryClient = useQueryClient();

    const queryKey = ["stop", props.city, props.stop, props.destinations];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            if (document.hidden) return queryClient.getQueryData(queryKey) as StopDepartures;

            if (props.wait) {
                await new Promise((resolve) => setTimeout(resolve, props.wait));

                if (signal.aborted) return;
            }

            return fetchData(
                props.city,
                props.stop,
                props.limit || stopStore.limit,
                props.destinations,
                signal
            );
        },
        refetchOnWindowFocus: true,
        retry: false,
    });

    useEffect(() => {
        if (!useRefetch) return;

        query.refetch();
    }, [useRefetch, stopStore.limit]);

    useEffect(() => {
        if (!useRefetch) return;

        return () => {
            stopStore.reset();
            queryClient.removeQueries({
                queryKey,
            });
        };
    }, [useRefetch, props.city, props.stop]);

    return query;
};
