import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Route } from "typings";

type Props = {
    city: string;
};

const fetchData = (city: Props["city"], signal: AbortSignal) => {
    return fetchWithAuth<Route[]>(`${Gay.base}/${city}/routes/getAllRoutes`, signal);
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["routes", props.city],
        queryFn: ({ signal }) => fetchData(props.city, signal),
    });
};
