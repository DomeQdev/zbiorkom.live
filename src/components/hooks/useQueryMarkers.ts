import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { MapData } from "typings";

type Props = {
    city: string;
    options: Options;
    isFiltering?: boolean;
    disabled?: boolean;
};

type Options = {
    bounds?: number[][];
    zoom?: number;
    fetchStops?: boolean;
    filterModels?: string[];
    filterRoutes?: string[];
    filterDirection?: 0 | 1;
};

const fetchData = (city: Props["city"], options: Props["options"], signal: AbortSignal) => {
    const searchParams = new URLSearchParams();
    if (options.bounds) searchParams.append("bounds", options.bounds.join(","));
    if (options.zoom) searchParams.append("zoom", options.zoom.toString());
    if (options.fetchStops) searchParams.append("fetchStops", "true");
    if (options.filterModels) searchParams.append("filterModels", options.filterModels.join(","));
    if (options.filterRoutes) searchParams.append("filterRoutes", options.filterRoutes.join(","));
    if (options.filterDirection !== undefined)
        searchParams.append("filterDirection", options.filterDirection.toString());

    return fetchWithAuth<MapData>(`${Gay.base}/${city}/map/getFeatures?${searchParams}`, signal);
};

export default (props: Props) => {
    const queryKey = ["markers", props.city, props.isFiltering || false];

    const query = useQuery({
        queryKey,
        queryFn: ({ signal }) => fetchData(props.city, props.options, signal),
        enabled: !props.disabled,
    });

    useEffect(() => {
        if (props.disabled) return;

        query.refetch();
    }, [props.options]);

    return query;
};

export { fetchData as fetchMarkers };
