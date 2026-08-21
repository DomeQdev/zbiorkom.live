import useFilterStore from "./useFilterStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState, useMemo } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { ERoute, EStop, MapData, Stop } from "typings";
import { useEventQuery } from "./useEventQuery";
import { isHidden } from "@/util/hiddenAreas";

type Props = {
    city: string;
    moveBadge: () => void;
};

export default ({ city, moveBadge }: Props) => {
    const { current: map } = useMap();

    const [routes, tempRoutes, models, tempModels] = useFilterStore(
        useShallow((state) => [state.routes, state.tempRoutes, state.models, state.tempModels]),
    );

    const [mapState, setMapState] = useState<{ bounds: string; zoom: number }>();

    const updateMapState = () => {
        if (!map) return;
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        if (bounds) {
            const boundsStr = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(
                ",",
            );
            setMapState({ bounds: boundsStr, zoom });
        }
    };

    const isFiltering = tempRoutes.length > 0 || tempModels.length > 0;

    useEffect(() => {
        if (!map) return;

        if (!window.skipPadding) {
            map.flyTo({
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                duration: 0,
            });
        } else {
            window.skipPadding = false;
        }

        updateMapState();

        const onMove = (e: any) => {
            if (e.originalEvent) updateMapState();
        };

        map.on("moveend", onMove);

        return () => {
            map.off("moveend", onMove);
        };
    }, [map]);

    const endpoint = useMemo(() => {
        const params = new URLSearchParams();

        const activeRoutes = isFiltering ? tempRoutes : routes;
        const activeModels = isFiltering ? tempModels : models;

        const filterRoutes = activeRoutes.map((r) => r[ERoute.id]).join(",");
        const filterModels = activeModels.join(",");

        if (filterRoutes) params.set("filterRoutes", filterRoutes);
        if (filterModels) params.set("filterModels", filterModels);

        const query = params.toString();

        if (isFiltering) {
            return `mapFeatures/0/0,0,0,0/stream${query ? `?${query}` : ""}`;
        }

        if (!mapState) return null;
        return `mapFeatures/${mapState.zoom}/${mapState.bounds}/stream${query ? `?${query}` : ""}`;
    }, [isFiltering, mapState, routes, models, tempRoutes, tempModels]);

    const { data, initialData } = useEventQuery<
        { positions: any[]; dots: any[] },
        { stops: Stop[]; suggestedCity?: string }
    >(city, endpoint || "", { enabled: !!endpoint, resetKey: city });

    useEffect(() => {
        if (data?.positions && data.positions.length === 0 && (routes.length || models.length)) {
            moveBadge();
        }
    }, [data, routes.length, models.length]);

    // no stops inside the blanked out areas, whatever the API returns
    const stops = useMemo(
        () => (initialData?.stops || []).filter((stop) => !isHidden(stop[EStop.location])),
        [initialData],
    );

    return {
        useDots: data?.dots ? data.dots.length > 0 : false,
        vehicles: data?.positions || [],
        dots: data?.dots || [],
        stops,
        geoJson: undefined,
        suggestedCity: initialData?.suggestedCity,
    };
};
