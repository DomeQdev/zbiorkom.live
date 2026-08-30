import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Execution, ExecutionAutocomplete, ExecutionDates, ExecutionTrip } from "typings";

type FilterProps = {
    city: string;
    date?: string;
    route?: string;
    brigade?: string;
    vehicle?: string;
    enabled?: boolean;
};

const autocompleteStaleTime = 10 * 60 * 1000;

// Lines + vehicle numbers present in ClickHouse for the city. Text filtering is done
// client-side, so this is fetched once and cached.
export const useQueryExecutionAutocomplete = (city: string) => {
    return useQuery({
        queryKey: ["executionAutocomplete", city],
        queryFn: ({ signal }) =>
            getFromAPI<ExecutionAutocomplete>(city, "dispatches/autocomplete", {}, signal),
        staleTime: autocompleteStaleTime,
    });
};

// Brigades of a selected line.
export const useQueryExecutionBrigades = (city: string, route: string) => {
    return useQuery({
        queryKey: ["executionBrigades", city, route],
        queryFn: ({ signal }) =>
            getFromAPI<{ brigades: string[] }>(city, "dispatches/autocomplete", { route }, signal),
        enabled: !!route,
        staleTime: autocompleteStaleTime,
    });
};

// Days with data for the current filter (route and/or vehicle required).
export const useQueryExecutionDates = (props: FilterProps) => {
    return useQuery({
        queryKey: ["executionDates", props],
        queryFn: ({ signal }) =>
            getFromAPI<ExecutionDates>(
                props.city,
                "dispatches/dates",
                {
                    route: props.route,
                    brigade: props.brigade,
                    vehicle: props.vehicle,
                },
                signal,
            ),
        enabled: props.enabled,
    });
};

// Unique dispatches of a day for the current filter.
export const useQueryExecutions = (props: FilterProps) => {
    return useQuery({
        queryKey: ["executions", props],
        queryFn: ({ signal }) =>
            getFromAPI<Execution[]>(
                props.city,
                "dispatches",
                {
                    route: props.route,
                    brigade: props.brigade,
                    vehicle: props.vehicle,
                    date: props.date,
                },
                signal,
            ),
        enabled: props.enabled,
    });
};

// Per-stop times of a single dispatch.
export const useQueryExecutionTrip = (props: {
    city: string;
    trip?: string;
    date?: string;
    vehicle?: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ["executionTrip", props],
        queryFn: ({ signal }) =>
            getFromAPI<ExecutionTrip>(
                props.city,
                "dispatches/trip",
                {
                    trip: props.trip,
                    date: props.date,
                    vehicle: props.vehicle,
                },
                signal,
            ),
        enabled: props.enabled,
    });
};
