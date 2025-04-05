import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { BrigadeTrip } from "typings";

type Props = {
    city: string;
    route: string;
    brigade: string;
};

const fetchData = (
    city: Props["city"],
    route: Props["route"],
    brigade: Props["brigade"],
    signal: AbortSignal
) => {
    return fetchWithAuth<BrigadeTrip[]>(
        `${Gay.base}/${city}/brigades/getBrigade?route=${encodeURIComponent(
            route
        )}&brigade=${encodeURIComponent(brigade)}`,
        signal
    );
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["brigade", props.city, props.route, props.brigade],
        queryFn: ({ signal }) => fetchData(props.city, props.route, props.brigade, signal),
        refetchOnMount: true,
    });
};
