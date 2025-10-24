import { Layer, Marker, Source, useMap } from "@vis.gl/react-maplibre";
import { memo, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import StopMarker from "@/map/StopMarker";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import { EStop, EStopDeparture, EStopDepartures, EStopExit } from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";
import { useWebSocket } from "@/hooks/useWebSocket";

export default memo(() => {
    const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);
    const { subscribe } = useWebSocket();
    const { city, stop } = useParams();
    const { current: map } = useMap();
    const navigate = useNavigate();

    const isStation = window.location.pathname.includes("/station");
    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";

    const { data, refetch } = useQueryStopDepartures({
        city: isStation ? "pkp" : city!,
        stop: stop!,
        isMainComponent: true,
    });

    const stopData = data?.[EStopDepartures.stop];

    useEffect(() => {
        if (!stopData) return;

        if (!hasDataFetched) {
            map?.flyTo({
                center: stopData[EStop.location],
                zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                padding: { top: 0, left: 0, right: 0, bottom: 0 },
            });

            setHasDataFetched(true);
        }

        const onRefresh = () => {
            if (document.visibilityState !== "visible") return;

            refetch();
        };

        const unsubscribe = subscribe(isStation ? "trainRefresh" : "refresh", onRefresh);

        return () => {
            unsubscribe();
        };
    }, [data, subscribe, refetch]);

    const liveDepartures = useMemo(() => {
        if (!data) return [];

        const uniqueTrips = [];
        const map = new Set<string>();

        for (const departure of data?.[EStopDepartures.departures] ?? []) {
            if (!departure[EStopDeparture.vehicle] || map.has(departure[EStopDeparture.vehicleId])) {
                continue;
            }

            map.add(departure[EStopDeparture.vehicleId]);
            uniqueTrips.push(departure);
        }

        return uniqueTrips;
    }, [data]);

    const stopExits: GeoJSON.GeoJSON | null = useMemo(() => {
        if (!stopData?.[EStop.exits]?.length) return null;

        return {
            type: "FeatureCollection",
            features: stopData[EStop.exits].map((exit) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: exit[EStopExit.location],
                },
                properties: {
                    name: exit[EStopExit.name],
                },
            })),
        };
    }, [stopData]);

    if (!stopData) return null;

    return (
        <>
            <Helm variable="stop" dictionary={{ stop: stopData[EStop.name] }} />

            <Marker
                key={stopData[EStop.id]}
                longitude={stopData[EStop.location][0]}
                latitude={stopData[EStop.location][1]}
                style={{ zIndex: 2 }}
                pitchAlignment="map"
                rotationAlignment="map"
            >
                <StopMarker
                    stop={stopData}
                    useStopCodeAsIcon={localStorage.getItem("useStopCodeAsIcon") === "true"}
                />
            </Marker>

            {stopExits && (
                <Source type="geojson" data={stopExits}>
                    <Layer
                        id="stop-exits"
                        type="symbol"
                        layout={{
                            "icon-image": "entrance",
                            "icon-size": 1.3,
                            "icon-allow-overlap": true,
                        }}
                        filter={[">=", ["zoom"], 16]}
                    />
                    <Layer
                        id="stop-exit-labels"
                        type="symbol"
                        layout={{
                            "text-field": ["get", "name"],
                            "text-size": 14,
                            "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                            "text-anchor": "top",
                            "text-justify": "center",
                            "text-offset": [0, 0.8],
                            "text-allow-overlap": false,
                        }}
                        paint={{
                            "text-color": "#fff",
                            "text-halo-color": "#5373d4",
                            "text-halo-width": 1.5,
                        }}
                        filter={[">=", ["zoom"], 16]}
                    />
                </Source>
            )}

            {liveDepartures.map((departure) => (
                <VehicleMarker
                    key={departure[EStopDeparture.vehicleId]}
                    vehicle={departure[EStopDeparture.vehicle]!}
                    showBrigade={showBrigade}
                    showFleet={showFleet}
                    onClick={() => {
                        navigate(
                            `/${city}/vehicle/${encodeURIComponent(departure[EStopDeparture.vehicleId])}` +
                                (isStation ? "?pkp" : ""),
                            { state: -2 },
                        );
                    }}
                />
            ))}

            <Outlet />
        </>
    );
});
