import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/util/fetchFunctions";
import useStopStore from "./useStopStore";
import { useEffect } from "react";
import { StopDepartures } from "typings";

type Props = {
    station: string;
    time?: number;
    destinations?: string[];
    limit?: number;
    wait?: number;
};

const fetchData = (
    station: Props["station"],
    limit: Props["limit"],
    time: Props["time"],
    destinations: Props["destinations"],
    signal: AbortSignal
) => {
    const params = new URLSearchParams();

    params.set("id", station);
    if (limit) params.set("limit", limit.toString());
    if (destinations) params.set("destinations", destinations.join(","));
    if (time) params.set("time", time.toString());

    return fetchWithAuth<StopDepartures>(`${Gay.base}/pkp/stops/getStationDepartures?${params.toString()}`, signal);
};

export default (props: Props, useRefetch: boolean = false) => {
    const stopStore = useStopStore((state) => state);
    const queryClient = useQueryClient();

    const queryKey = ["station", props.station, props.destinations];

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            if (document.hidden) return queryClient.getQueryData(queryKey) as StopDepartures;

            if (props.wait) {
                await new Promise((resolve) => setTimeout(resolve, props.wait));

                if (signal.aborted) return;
            }

            return fetchData(
                props.station,
                props.limit || stopStore.limit,
                props.time || stopStore.time,
                props.destinations || (stopStore.destination ? [stopStore.destination] : undefined),
                signal
            );
        },
        refetchOnWindowFocus: true,
        retry: false,
    });

    useEffect(() => {
        if (!useRefetch) return;

        query.refetch();
    }, [useRefetch, stopStore.limit, stopStore.time, stopStore.destination]);

    useEffect(() => {
        if (!useRefetch) return;

        return () => {
            stopStore.reset();
            queryClient.removeQueries({
                queryKey,
            });
        };
    }, [useRefetch, props.station]);

    return query;
};
