import { Marker, useMap } from "@vis.gl/react-maplibre";
import { memo, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import StopMarker from "@/map/StopMarker";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import {
    EStop,
    EStopDeparture,
    EStopDepartures,
    EStopDepartureStatus,
    EStopTime,
    ETrip,
    EVehicle,
} from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";
import { buildCitySuffix, getCityFromUrl } from "@/util/tools";
import { isHidden } from "@/util/hiddenAreas";

export default memo(() => {
    const [hasDataFetched, setHasDataFetched] = useState<boolean>(false);
    const { city, stop } = useParams();
    const { current: map } = useMap();
    const navigate = useNavigate();

    const effectiveCity = getCityFromUrl(city);
    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";

    const { data } = useQueryStopDepartures({
        city: effectiveCity,
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
    }, [data, stopData, map, hasDataFetched]);

    const liveDepartures = useMemo(() => {
        if (!data) return [];

        const uniqueTrips = [];
        const seenVehicles = new Set<string>();

        for (const departure of data?.[EStopDepartures.departures] ?? []) {
            const vehicle = departure[EStopDeparture.vehicle];
            if (!vehicle) continue;

            const status = departure[EStopDeparture.departure][EStopTime.status];
            if (status === EStopDepartureStatus.OnPreviousTrip) continue;

            const vehicleId = vehicle[EVehicle.id];
            if (seenVehicles.has(vehicleId)) {
                continue;
            }

            seenVehicles.add(vehicleId);
            uniqueTrips.push(departure);
        }

        return uniqueTrips;
    }, [data]);

    if (!stopData) return null;

    return (
        <>
            <Helm variable="stop" dictionary={{ stop: stopData[EStop.name] }} />

            {!isHidden(stopData[EStop.location]) && (
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
            )}

            {liveDepartures.map((departure) => (
                <VehicleMarker
                    key={departure[EStopDeparture.trip][ETrip.id]}
                    vehicle={departure[EStopDeparture.vehicle]!}
                    showBrigade={showBrigade}
                    showFleet={showFleet}
                    onClick={() => {
                        const vehicle = departure[EStopDeparture.vehicle]!;
                        navigate(
                            `/${city}/vehicle/${encodeURIComponent(vehicle[EVehicle.id])}` +
                                buildCitySuffix(vehicle[EVehicle.city], city),
                            { state: -2 },
                        );
                    }}
                />
            ))}

            <Outlet />
        </>
    );
});
