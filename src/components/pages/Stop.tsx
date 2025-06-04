import { Marker, useMap } from "react-map-gl";
import { memo, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import StopMarker from "@/map/StopMarker";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import { EStop, EStopDeparture, EStopDepartures } from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";

export default memo(() => {
    const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);
    const socket = useOutletContext<Socket>();
    const { city, stop } = useParams();
    const { current: map } = useMap();
    const navigate = useNavigate();

    const { data, refetch } = useQueryStopDepartures({
        city: city!,
        stop: stop!,
        isMainComponent: true,
    });

    const stopData = data?.[EStopDepartures.stop];

    useEffect(() => {
        if (!stopData || !socket) return;

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

        socket.on("refresh", onRefresh);

        return () => {
            socket.off("refresh", onRefresh);
        };
    }, [data, socket]);

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

    return (
        <>
            {stopData && <Helm variable="stop" dictionary={{ stop: stopData[EStop.name] }} />}

            {stopData && (
                <Marker
                    key={stopData[EStop.id]}
                    longitude={stopData[EStop.location][0]}
                    latitude={stopData[EStop.location][1]}
                    style={{ zIndex: 2 }}
                    pitchAlignment="map"
                    rotationAlignment="map"
                >
                    <StopMarker stop={stopData} />
                </Marker>
            )}

            {liveDepartures.map((departure) => (
                <VehicleMarker
                    key={departure[EStopDeparture.vehicleId]}
                    vehicle={departure[EStopDeparture.vehicle]!}
                    onClick={() => {
                        navigate(
                            `/${city}/vehicle/${encodeURIComponent(departure[EStopDeparture.vehicleId])}`,
                            {
                                state: -2,
                            }
                        );
                    }}
                />
            ))}

            <Outlet />
        </>
    );
});
