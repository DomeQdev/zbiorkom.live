import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Execution, ExecutionDates, ExecutionVehicles } from "typings";

type Props = {
    city: string;
    date?: string;
    route?: string;
    brigade?: string;
    vehicle?: string;
    enabled?: boolean;
};

const getURLFromProps = (endpoint: string, props: Props) => {
    const searchParams = new URLSearchParams();
    if (props.date) searchParams.append("date", props.date);
    if (props.route) searchParams.append("route", props.route);
    if (props.brigade) searchParams.append("brigade", props.brigade);
    if (props.vehicle) searchParams.append("vehicle", props.vehicle);

    return `${Gay.base}/${props.city}/tripExecutions/${endpoint}?${searchParams.toString()}`;
};

const timeout = 1000;

export const useQueryExecutionDates = (props: Props) => {
    return useQuery({
        queryKey: ["executionDates", props],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, timeout));
            if (signal.aborted) return;

            return fetchWithAuth<ExecutionDates>(getURLFromProps("getDates", props), signal);
        },
        enabled: props.enabled,
    });
};

export const useQueryExecutions = (props: Props) => {
    return useQuery({
        queryKey: ["executions", props],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, timeout));
            if (signal.aborted) return;

            return fetchWithAuth<Execution[]>(getURLFromProps("getExecutions", props), signal);
        },
        enabled: props.enabled,
    });
};

export const useQueryExectionVehicles = (props: Props) => {
    return useQuery({
        queryKey: ["executionVehicles", props],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, timeout));
            if (signal.aborted) return;

            return fetchWithAuth<ExecutionVehicles[]>(getURLFromProps("getExecutionVehicles", props), signal);
        },
        enabled: props.enabled,
    });
};
