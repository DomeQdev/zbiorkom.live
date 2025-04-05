import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Brigade } from "typings";

type Props = {
    city: string;
    route: string;
};

const fetchData = (city: Props["city"], route: Props["route"], signal: AbortSignal) => {
    return fetchWithAuth<Brigade>(
        `${Gay.base}/${city}/brigades/getBrigadeList?route=${encodeURIComponent(route)}`,
        signal
    );
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["brigadeList", props.city, props.route],
        queryFn: ({ signal }) => fetchData(props.city, props.route, signal),
        refetchOnMount: true,
    });
};
