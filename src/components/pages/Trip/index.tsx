import { memo, useEffect } from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useMap } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { Socket } from "socket.io-client";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import TripPlatforms from "@/map/TripPlatforms";
import { ERoute, ETrip, ETripStop, EVehicle } from "typings";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryTrip } from "@/hooks/useQueryTrip";
import { getSheetHeight } from "@/util/tools";

export default memo(() => {
    const [vehicle, tripData, sequence, fresh, setFresh] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.trip, state.sequence ?? 0, state.fresh, state.setFresh])
    );
    const socket = useOutletContext<Socket>();
    const { city, trip } = useParams();
    const { current: map } = useMap();
    const cityId = window.location.search.includes("pkp") ? "pkp" : city!;

    const { refetch, isLoading } = useQueryTrip({
        city: window.location.search.includes("pkp") ? "pkp" : city!,
        trip: trip!,
    });

    useEffect(() => {
        if (!tripData || !socket) return;

        const eventName = cityId === "pkp" ? "trainRefresh" : "refresh";

        const onRefresh = () => {
            if (document.visibilityState !== "visible") return;

            refetch();
        };

        socket.on(eventName, onRefresh);

        return () => {
            socket.off(eventName, onRefresh);
        };
    }, [tripData, socket]);

    useEffect(() => {
        if (!fresh || isLoading || !tripData) return;

        const bounds = vehicle?.[EVehicle.location]
            ? new LngLatBounds(
                  vehicle[EVehicle.location],
                  tripData[ETrip.stops][sequence][ETripStop.location]
              )
            : tripData[ETrip.stops]
                  .slice(sequence, sequence === -1 ? undefined : sequence + 3)
                  .reduce((bounds, stop) => bounds.extend(stop[ETripStop.location]), new LngLatBounds());

        map?.fitBounds(bounds, {
            padding: {
                left: 30,
                right: 30,
                top: 30,
                bottom: getSheetHeight(),
            },
            maxZoom: 16,
        });

        setFresh(false);
    }, [tripData, vehicle, isLoading, fresh]);

    if (!tripData) return null;

    return (
        <>
            {tripData && (
                <Helm
                    variable="trip"
                    dictionary={{
                        route: tripData[ETrip.route][ERoute.name],
                        headsign: tripData[ETrip.headsign],
                    }}
                />
            )}

            <TripRoute
                shape={tripData[ETrip.shape]}
                stops={tripData[ETrip.stops]}
                color={tripData[ETrip.route][ERoute.color]}
            />

            {tripData[ETrip.platforms] && (
                <TripPlatforms
                    platforms={tripData[ETrip.platforms]}
                    color={tripData[ETrip.route][ERoute.color]}
                />
            )}

            {vehicle && (
                <VehicleMarker
                    vehicle={vehicle}
                    showBrigade={localStorage.getItem("brigade") === "true"}
                    showFleet={localStorage.getItem("fleet") === "true"}
                />
            )}

            <Outlet />
        </>
    );
});
