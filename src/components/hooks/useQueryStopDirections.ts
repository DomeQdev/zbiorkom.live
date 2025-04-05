import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { StopDirection } from "typings";

type Props = {
    city: string;
    stop: string;
};

const fetchData = (city: Props["city"], stop: Props["stop"], signal: AbortSignal) => {
    return fetchWithAuth<StopDirection[]>(
        `${Gay.base}/${city}/stops/getStopDirections?stop=${encodeURIComponent(stop)}`,
        signal
    );
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["stopDirections", props.city, props.stop],
        queryFn: ({ signal }) => fetchData(props.city, props.stop, signal),
    });
};
