import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStopStore from "./useStopStore";
import { getFromAPI } from "@/util/fetchFunctions";
import { Stop, StopDepartures, StopDirection } from "typings";
import { useEffect } from "react";

type StopDeparturesQueryProps = {
    stop: string;
    city: string;
    limit?: number;
    time?: number;
    destinations?: string[];
    wait?: number;
    isMainComponent?: boolean;
};

export const useQueryStopDepartures = (props: StopDeparturesQueryProps) => {
    const stopStore = useStopStore((state) => state);
    const queryClient = useQueryClient();
    const queryKey = ["stop", props.stop, props.destinations];

    const limit = props.limit || stopStore.limit;
    const time = props.time || stopStore.time;
    const destinations = props.destinations?.join(",") || stopStore.destination;

    const query = useQuery({
        queryKey,
        queryFn: async ({ signal }) => {
            if (props.wait) await new Promise((resolve) => setTimeout(resolve, props.wait));
            if (signal.aborted) return;

            return getFromAPI<StopDepartures>(
                props.city,
                "stops/getDepartures",
                {
                    id: props.stop,
                    limit,
                    time,
                    destinations,
                },
                signal,
            );
        },
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (!props.isMainComponent) return;

        query.refetch();
    }, [props.isMainComponent, limit, time, destinations]);

    useEffect(() => {
        if (!props.isMainComponent) return;

        return () => {
            stopStore.reset();
            queryClient.removeQueries({ queryKey });
        };
    }, [props.isMainComponent, props.stop]);

    return query;
};

export const useQueryStopDirections = ({ city, stop }: { city: string; stop: string }) => {
    return useQuery({
        queryKey: ["stopDirections", city, stop],
        queryFn: async ({ signal }) => {
            return getFromAPI<StopDirection[]>(city, "stops/getStopDirections", { stop }, signal);
        },
    });
};

type StopGroupQueryProps = {
    city: string;
    stop: string;
    enabled: boolean;
};

export const useQueryStopGroup = ({ city, stop, enabled }: StopGroupQueryProps) => {
    return useQuery({
        queryKey: ["stopGroup", city, stop],
        queryFn: async ({ signal }) => {
            return getFromAPI<Stop[]>(city, "stops/getStopGroup", { id: stop }, signal);
        },
        enabled,
    });
};
