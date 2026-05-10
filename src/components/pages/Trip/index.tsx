import { memo, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-maplibre";
import { LngLatBounds } from "maplibre-gl";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import { ERoute, ETrip, EItinerary, EItineraryStop, EStop, EStopTime, EStopUpdate, EVehicle } from "typings";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryTrip } from "@/hooks/useQueryTrip";
import { getSheetHeight, parseVehicleId } from "@/util/tools";
import { useFollowStore } from "@/hooks/useFollowStore";

export default memo(() => {
    const [vehicleData, tripData, rawSequence, stopUpdates, fresh, itinerary, setFresh] = useVehicleStore(
        useShallow((state) => [
            state.vehicle,
            state.trip,
            state.sequence,
            state.stops,
            state.fresh,
            state.itinerary,
            state.setFresh,
        ]),
    );

    const sequence = rawSequence ?? (stopUpdates ? stopUpdates.length - 1 : undefined);
    const { isFollowing, setIsFollowing, reset } = useFollowStore(
        useShallow((state) => ({
            isFollowing: state.isFollowing,
            setIsFollowing: state.setIsFollowing,
            reset: state.reset,
        })),
    );
    const { city, trip, vehicle } = useParams();
    const { current: map } = useMap();
    const cityId = window.location.search.includes("pkp") ? "pkp" : city!;

    const { refetch, isLoading } = useQueryTrip({
        city: window.location.search.includes("pkp") ? "pkp" : city!,
        trip: trip!,
        vehicle: vehicle!,
    });

    useEffect(() => {
        reset();

        const onMoveStart = (e: any) => {
            if (e.originalEvent) setIsFollowing(false);
        };

        map?.on("movestart", onMoveStart);

        return () => {
            map?.off("movestart", onMoveStart);
        };
    }, []);

    useEffect(() => {
        if (!tripData) return;

        const interval = setInterval(() => {
            if (document.visibilityState !== "visible") return;

            refetch();
        }, 15000);

        return () => {
            clearInterval(interval);
        };
    }, [tripData, cityId, refetch]);

    useEffect(() => {
        if (isLoading || (!tripData && !vehicleData)) return;
        if (!isFollowing && !fresh) return;

        if (vehicleData?.[EVehicle.location]) {
            map?.flyTo({
                center: vehicleData[EVehicle.location],
                zoom: map.getZoom() > 15 ? map.getZoom() : 15,
            });
        } else if (tripData && itinerary && fresh) {
            const stops = itinerary[EItinerary.stops];
            const now = Date.now();

            let startIndex: number;
            if (rawSequence !== undefined && rawSequence !== -1) {
                startIndex = rawSequence;
            } else if (stopUpdates?.length) {
                const upcoming = stopUpdates.findIndex((u) => {
                    const dep = u[EStopUpdate.departure];
                    return dep[EStopTime.scheduled] + dep[EStopTime.delay] >= now;
                });
                startIndex = upcoming === -1 ? Math.max(0, stops.length - 3) : upcoming;
            } else {
                startIndex = 0;
            }

            const slice = stops.slice(startIndex, startIndex + 3);

            const bounds = (slice.length ? slice : stops).reduce(
                (bounds, stop) => bounds.extend(stop[EItineraryStop.stop][EStop.location]),
                new LngLatBounds(),
            );

            if (!bounds.isEmpty()) {
                map?.fitBounds(bounds, {
                    padding: {
                        left: 30,
                        right: 30,
                        top: 30,
                        bottom: getSheetHeight(),
                    },
                    maxZoom: 16,
                });
            }
        }

        if (fresh) setFresh(false);
    }, [tripData, vehicleData, itinerary, isLoading, fresh, isFollowing, rawSequence, stopUpdates]);

    return (
        <>
            {(vehicleData || tripData) && (
                <Helm
                    variable={vehicle ? "vehicle" : "trip"}
                    dictionary={{
                        route: (vehicleData?.[EVehicle.route] || tripData?.[ETrip.route])?.[ERoute.name],
                        vehicle: vehicleData?.[EVehicle.id]
                            ? parseVehicleId(vehicleData[EVehicle.id]).vehicleNumber
                            : "",
                        headsign: tripData?.[ETrip.headsign],
                    }}
                />
            )}

            {tripData && itinerary && (
                <>
                    <TripRoute
                        shape={itinerary[EItinerary.shape] as any}
                        stops={itinerary[EItinerary.stops].map((iStop) => {
                            const s = iStop[EItineraryStop.stop];
                            return [s[EStop.id], s[EStop.name], s[EStop.location], 1];
                        })}
                        color={tripData[ETrip.route][ERoute.color]}
                    />
                </>
            )}

            {vehicleData && (
                <VehicleMarker
                    vehicle={vehicleData}
                    showBrigade={localStorage.getItem("brigade") === "true"}
                    showFleet={localStorage.getItem("fleet") === "true"}
                />
            )}

            <Outlet />
        </>
    );
});
