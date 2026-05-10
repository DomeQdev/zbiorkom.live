import { useQueryClient, useQuery } from "@tanstack/react-query";
import useStopStore from "./useStopStore";
import { getFromAPI } from "@/util/fetchFunctions";
import { Stop, StopDepartures, StopDirection } from "typings";
import { useEffect, useMemo, useRef } from "react";
import { useEventQuery } from "./useEventQuery";
import { useShallow } from "zustand/react/shallow";

type StopDeparturesQueryProps = {
    stop: string;
    city: string;
    limit?: number;
    time?: number;
    destinations?: string[];
    wait?: number;
    isMainComponent?: boolean;
    expectStream?: boolean;
};

export const useQueryStopDepartures = (props: StopDeparturesQueryProps) => {
    const storeLimit = useStopStore((state) => state.limit);
    const storeTime = useStopStore((state) => state.time);
    const storeDest = useStopStore((state) => state.destination);
    const reset = useStopStore((state) => state.reset);

    const queryClient = useQueryClient();

    const originalLimit = props.limit || storeLimit;
    const fetchLimit = originalLimit + 1;
    const time = props.time || storeTime;
    const destinations = props.destinations?.join(",") || storeDest;

    const queryKey = useMemo(() => ["stop", props.stop, destinations], [props.stop, destinations]);
    const stateKey = useMemo(() => ["stopState", props.stop, destinations], [props.stop, destinations]);

    const endpoint = useMemo(() => {
        const query = new URLSearchParams();
        if (time) query.set("time", time.toString());
        query.set("limit", fetchLimit.toString());
        if (destinations) query.set("destination", destinations);

        return `stops/${encodeURIComponent(props.stop)}/stream?${query.toString()}`;
    }, [props.stop, fetchLimit, time, destinations]);

    // ONLY main component initializes connection (prevents 3 simultaneous streams)
    const {
        data: rawDepartures,
        initialData: stopTuple,
        loadingState,
    } = useEventQuery<any[], Stop>(props.city, endpoint, {
        enabled: !!props.isMainComponent,
        resetKey: props.stop,
    });

    const eventData = useMemo<StopDepartures | undefined>(() => {
        if (!stopTuple || !rawDepartures) return undefined;

        const hasMore = rawDepartures.length > originalLimit;
        const departures = hasMore ? rawDepartures.slice(0, originalLimit) : rawDepartures;

        return [stopTuple, departures as any, hasMore];
    }, [stopTuple, rawDepartures, originalLimit]);

    useEffect(() => {
        if (props.isMainComponent && eventData) {
            queryClient.setQueryData(queryKey, eventData);
        }
    }, [props.isMainComponent, eventData, queryClient, queryKey]);

    useEffect(() => {
        if (!props.isMainComponent) return;
        queryClient.setQueryData(stateKey, {
            loading: loadingState?.loading,
            error: loadingState?.error,
        });
    }, [props.isMainComponent, loadingState?.loading, loadingState?.error, queryClient, stateKey]);

    const query = useQuery({
        queryKey,
        queryFn: () => eventData as StopDepartures,
        enabled: false,
        initialData: props.isMainComponent ? eventData : undefined,
    });

    const stateQuery = useQuery<{ loading?: boolean; error?: string }>({
        queryKey: stateKey,
        queryFn: () => ({}),
        enabled: false,
        initialData: { loading: !props.isMainComponent && !!props.expectStream },
    });

    useEffect(() => {
        if (!props.isMainComponent) return;

        return () => {
            reset();
            queryClient.removeQueries({ queryKey });
            queryClient.removeQueries({ queryKey: stateKey });
        };
    }, [props.isMainComponent, props.stop, reset, queryClient, queryKey, stateKey]);

    const sharedState = stateQuery.data;

    return {
        ...query,
        data: props.isMainComponent ? eventData : query.data,
        isLoading: props.isMainComponent ? loadingState?.loading : sharedState?.loading,
        error: props.isMainComponent ? loadingState?.error : sharedState?.error,
        refetch: () => {},
    };
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
