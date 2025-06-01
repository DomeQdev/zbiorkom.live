import { getFromAPI } from "@/util/fetchFunctions";
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
    return getFromAPI<MapData>(
        city,
        "map/getFeatures",
        {
            bounds: options.bounds?.join(","),
            zoom: options.zoom?.toString(),
            fetchStops: options.fetchStops ? "true" : undefined,
            filterModels: options.filterModels?.join(","),
            filterRoutes: options.filterRoutes?.join(","),
            filterDirection: options.filterDirection?.toString(),
        },
        signal
    );
};

export default ({ city, options, isFiltering, disabled }: Props) => {
    const query = useQuery({
        queryKey: ["markers", city, isFiltering || false],
        queryFn: ({ signal }) => fetchData(city, options, signal),
        enabled: !disabled,
    });

    useEffect(() => {
        if (disabled) return;

        query.refetch();
    }, [options]);

    return query;
};

export { fetchData as fetchMarkers };
