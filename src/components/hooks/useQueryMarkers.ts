import { useMemo } from "react";
import { DotVehicle, EVehicle, Vehicle, VehiclePlacement } from "typings";
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
    filterDirection?: number;
    graph?: boolean; // place the vehicles on the route diagram as well
};

export type MarkersData = {
    positions: Vehicle[];
    dots: DotVehicle[];
    placements: VehiclePlacement[];
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
        if (options.graph) params.set("graph", "1");

        const query = params.toString();
        return `mapFeatures/0/0,0,0,0/stream${query ? `?${query}` : ""}`;
    }, [options.filterRoutes, options.filterModels, options.filterDirection, options.graph]);

    const { data: stream, loadingState } = useEventQuery<{
        positions: Vehicle[];
        dots: DotVehicle[];
        placements?: VehiclePlacement[];
    }>(city, endpoint, { enabled: !disabled, resetKey: endpoint });

    const data = useMemo<MarkersData | undefined>(() => {
        if (!stream) return undefined;

        const positions = stream.positions || [];
        const dots = stream.dots || [];
        const placements = stream.placements || [];
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

        return { positions, dots, placements, useDots, bbox };
    }, [stream]);

    return {
        data,
        loadingState,
        refetch: () => {},
    };
};
