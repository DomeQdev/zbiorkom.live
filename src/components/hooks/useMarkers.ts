import useFilterStore from "./useFilterStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState, useMemo } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { ERoute, MapData, Stop } from "typings";
import { useEventQuery } from "./useEventQuery";

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

    useEffect(() => {
        if (!map || tempRoutes.length || tempModels.length) return;

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
    }, [map, tempRoutes, tempModels]);

    const endpoint = useMemo(() => {
        if (!mapState) return null;
        const params = new URLSearchParams();
        const filterRoutes = routes.map((r) => r[ERoute.id]).join(",");
        const filterModels = models.join(",");

        if (filterRoutes) params.set("routes", filterRoutes);
        if (filterModels) params.set("models", filterModels);

        const query = params.toString();
        return `mapFeatures/${mapState.zoom}/${mapState.bounds}/stream${query ? `?${query}` : ""}`;
    }, [mapState, routes, models]);

    const { data, initialData } = useEventQuery<{ positions: any[]; dots: any[] }, { stops: Stop[] }>(
        city,
        endpoint || "",
        { enabled: !!endpoint && !tempRoutes.length && !tempModels.length, resetKey: city },
    );

    useEffect(() => {
        if (data?.positions && data.positions.length === 0 && (routes.length || models.length)) {
            moveBadge();
        }
    }, [data, routes.length, models.length]);

    return {
        useDots: data?.dots ? data.dots.length > 0 : false,
        vehicles: data?.positions || [],
        dots: data?.dots || [],
        stops: initialData?.stops || [],
        geoJson: undefined,
        suggestedCity: undefined,
    };
};
