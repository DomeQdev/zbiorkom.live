import { memo, useEffect, useState } from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { useMap } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { Socket } from "socket.io-client";
import VehicleMarker from "@/map/VehicleMarker";
import getSheetHeight from "@/util/getSheetHeight";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import useQueryTrip from "@/hooks/useQueryTrip";
import useQueryTripUpdate from "@/hooks/useQueryTripUpdate";
import TripPlatforms from "@/map/TripPlatforms";
import { ERoute, ETrip, ETripStop, EVehicle } from "typings";

export default memo(() => {
    const socket = useOutletContext<Socket>();
    const [hasFlied, setHasFlied] = useState(false);
    const { city, trip } = useParams();
    const { current: map } = useMap();
    const cityId = window.location.search.includes("pkp") ? "pkp" : city!;

    const { data } = useQueryTrip({ city: cityId, trip: trip! });
    const tripData = data?.trip;

    const {
        data: tripUpdate,
        refetch,
        isLoading: isTripUpdateLoading,
    } = useQueryTripUpdate({ city: cityId, trip: trip! }, true);

    useEffect(() => {
        if (!tripData || !socket) return;

        const eventName = cityId === "pkp" ? "trainRefresh" : "refresh";

        socket.on(eventName, refetch);

        return () => {
            socket.off(eventName, refetch);
        };
    }, [tripData, socket]);

    useEffect(() => {
        if (hasFlied || isTripUpdateLoading || !tripData) return;

        const sequence = tripUpdate?.sequence || 0;

        const bounds = tripUpdate?.vehicle?.[EVehicle.location]
            ? new LngLatBounds(
                  tripUpdate.vehicle[EVehicle.location],
                  tripData[ETrip.stops][tripUpdate.sequence!][ETripStop.location]
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

        if (!hasFlied) {
            setHasFlied(true);
        }
    }, [tripData, tripUpdate, isTripUpdateLoading, hasFlied]);

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

            {tripUpdate?.vehicle && <VehicleMarker vehicle={tripUpdate.vehicle} />}

            <Outlet />
        </>
    );
});
