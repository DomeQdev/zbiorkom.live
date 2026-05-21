import { useMemo } from "react";
import { DotVehicle, EVehicle, Vehicle } from "typings";
import { useEventQuery } from "./useEventQuery";

type Props = {
    city: string;
    options: Options;
    isFiltering?: boolean;
    disabled?: boolean;
};

type Options = {
    fetchStops?: boolean;
    filterModels?: string[];
    filterRoutes?: string[];
    filterDirection?: 0 | 1;
};

export type MarkersData = {
    positions: Vehicle[];
    dots: DotVehicle[];
    useDots: boolean;
    bbox?: [number, number, number, number];
};

export default ({ city, options, disabled }: Props) => {
    const endpoint = useMemo(() => {
        const params = new URLSearchParams();
        const filterRoutes = options.filterRoutes?.join(",");
        const filterModels = options.filterModels?.join(",");

        if (filterRoutes) params.set("filterRoutes", filterRoutes);
        if (filterModels) params.set("filterModels", filterModels);
        if (options.filterDirection !== undefined) {
            params.set("filterDirection", options.filterDirection.toString());
        }

        const query = params.toString();
        return `mapFeatures/0/0,0,0,0/stream${query ? `?${query}` : ""}`;
    }, [options.filterRoutes, options.filterModels, options.filterDirection]);

    const { data: stream, loadingState } = useEventQuery<{ positions: Vehicle[]; dots: DotVehicle[] }>(
        city,
        endpoint,
        { enabled: !disabled, resetKey: endpoint },
    );

    const data = useMemo<MarkersData | undefined>(() => {
        if (!stream) return undefined;

        const positions = stream.positions || [];
        const dots = stream.dots || [];
        const useDots = dots.length > 0;

        let bbox: [number, number, number, number] | undefined;
        if (positions.length) {
            let minLng = Infinity,
                minLat = Infinity,
                maxLng = -Infinity,
                maxLat = -Infinity;
            for (const v of positions) {
                const [lng, lat] = v[EVehicle.location];
                if (lng < minLng) minLng = lng;
                if (lat < minLat) minLat = lat;
                if (lng > maxLng) maxLng = lng;
                if (lat > maxLat) maxLat = lat;
            }
            bbox = [minLng, minLat, maxLng, maxLat];
        }

        return { positions, dots, useDots, bbox };
    }, [stream]);

    return {
        data,
        loadingState,
        refetch: () => {},
    };
};
