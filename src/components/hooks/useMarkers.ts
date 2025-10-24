import useFilterStore from "./useFilterStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState, useRef } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { fetchMarkers } from "./useQueryMarkers";
import { ERoute, MapData, Stop } from "typings";
import { useWebSocket } from "./useWebSocket";

type Props = {
    city: string;
    moveBadge: () => void;
};

export default ({ city, moveBadge }: Props) => {
    const { subscribe } = useWebSocket();
    const { current: map } = useMap();

    const [routes, tempRoutes, models, tempModels] = useFilterStore(
        useShallow((state) => [state.routes, state.tempRoutes, state.models, state.tempModels]),
    );

    const [vehicles, setVehicles] = useState<MapData["positions"]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const [useDots, setUseDots] = useState<MapData["useDots"]>(false);
    const [geoJson, setGeoJson] = useState<MapData["geoJson"]>();
    const [suggestedCity, setSuggestedCity] = useState<string | undefined>(undefined);

    const abortControllerRef = useRef<AbortController | null>(null);

    const refreshMarkers = (fetchStops?: boolean) => {
        if (!map || (!fetchStops && document.visibilityState !== "visible")) return;

        abortControllerRef.current?.abort();

        const newAbortController = new AbortController();
        abortControllerRef.current = newAbortController;

        const bounds = map.getBounds()!;
        const zoom = map.getZoom();
        const zoomAllowed = zoom >= 14.5;

        if (!zoomAllowed) setStops([]);

        fetchMarkers(
            city,
            {
                bounds: bounds.toArray(),
                zoom,
                fetchStops: fetchStops && zoomAllowed,
                filterRoutes: routes.length ? routes.map((route) => route[ERoute.id]) : undefined,
                filterModels: models.length ? models : undefined,
            },
            newAbortController.signal,
        ).then((data) => {
            if (newAbortController.signal.aborted) return;

            setVehicles(data.positions);
            setUseDots(data.useDots || false);
            if (data.stops) setStops(data.stops);
            setGeoJson(data.geoJson);
            setSuggestedCity(data.suggestedCity);

            if ((routes.length || models.length) && !data.positions.length) {
                moveBadge();
            }
        });
    };

    const onMove = (e: any) => {
        if (e.originalEvent) refreshMarkers(true);
    };

    const onVisibilityChange = () => {
        if (document.visibilityState !== "visible") return;

        refreshMarkers();
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
            });
        } else {
            window.skipPadding = false;
        }

        refreshMarkers(true);

        document.addEventListener("visibilitychange", onVisibilityChange);
        const unsubscribe = subscribe("refresh", refreshMarkers);
        map.on("moveend", onMove);

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            unsubscribe();
            map.off("moveend", onMove);
        };
    }, [map, subscribe, city, routes, tempRoutes, models, tempModels]);

    return {
        useDots,
        vehicles,
        stops,
        geoJson,
        suggestedCity,
    };
};
