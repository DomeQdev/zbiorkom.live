import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { RouteInfo } from "typings";

type Props = {
    city: string;
    route: string;
};

const fetchData = (city: Props["city"], route: Props["route"], signal: AbortSignal) => {
    return fetchWithAuth<RouteInfo>(
        `${Gay.base}/${city}/routes/getRoute?id=${encodeURIComponent(route)}`,
        signal
    );
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["route", props.city, props.route],
        queryFn: ({ signal }) => fetchData(props.city, props.route, signal),
    });
};
