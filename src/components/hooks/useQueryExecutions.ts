import { getFromAPI } from "@/util/fetchFunctions";
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

const timeout = 1000;

export const useQueryExecutionDates = (props: Props) => {
    return useQuery({
        queryKey: ["executionDates", props],
        queryFn: async ({ signal }) => {
            await new Promise((resolve) => setTimeout(resolve, timeout));
            if (signal.aborted) return;

            return getFromAPI<ExecutionDates>(
                props.city,
                "tripExecutions/getDates",
                {
                    date: props.date,
                    route: props.route,
                    brigade: props.brigade,
                    vehicle: props.vehicle,
                },
                signal
            );
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

            return getFromAPI<Execution[]>(
                props.city,
                "tripExecutions/getExecutions",
                {
                    date: props.date,
                    route: props.route,
                    brigade: props.brigade,
                    vehicle: props.vehicle,
                },
                signal
            );
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

            return getFromAPI<ExecutionVehicles[]>(
                props.city,
                "tripExecutions/getExecutionVehicles",
                {
                    date: props.date,
                    route: props.route,
                    brigade: props.brigade,
                    vehicle: props.vehicle,
                },
                signal
            );
        },
        enabled: props.enabled,
    });
};
