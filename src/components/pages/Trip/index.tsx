import { memo, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-maplibre";
import { LngLatBounds } from "maplibre-gl";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import TripPlatforms from "@/map/TripPlatforms";
import { ERoute, ETrip, ETripStop, EVehicle } from "typings";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryTrip } from "@/hooks/useQueryTrip";
import { getSheetHeight } from "@/util/tools";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useFollowStore } from "@/hooks/useFollowStore";

export default memo(() => {
    const [vehicleData, tripData, sequence, fresh, setFresh] = useVehicleStore(
        useShallow((state) => [
            state.vehicle,
            state.trip,
            state.sequence ?? state.stops?.length! - 1,
            state.fresh,
            state.setFresh,
        ]),
    );
    const { isFollowing, setIsFollowing, reset } = useFollowStore();
    const { subscribe } = useWebSocket();
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

        const onRefresh = () => {
            if (document.visibilityState !== "visible") return;

            refetch();
        };

        const unsubscribe = subscribe(cityId === "pkp" ? "trainRefresh" : "refresh", onRefresh);

        return () => {
            unsubscribe();
        };
    }, [tripData, cityId, refetch, subscribe]);

    useEffect(() => {
        if (isLoading || (!tripData && !vehicleData)) return;
        if (!isFollowing && !fresh) return;

        if (vehicleData?.[EVehicle.location]) {
            map?.flyTo({
                center: vehicleData[EVehicle.location],
                zoom: map.getZoom() > 15 ? map.getZoom() : 15,
            });
        } else if (tripData && fresh) {
            const bounds = tripData[ETrip.stops]
                .slice(sequence, sequence === undefined || sequence === -1 ? undefined : sequence + 3)
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
        }

        if (fresh) setFresh(false);
    }, [tripData, vehicleData, isLoading, fresh, isFollowing]);

    return (
        <>
            {(vehicleData || tripData) && (
                <Helm
                    variable={vehicle ? "vehicle" : "trip"}
                    dictionary={{
                        route: (vehicleData?.[EVehicle.route] || tripData?.[ETrip.route])?.[ERoute.name],
                        vehicle: vehicleData?.[EVehicle.id]?.split("/")[1] || "",
                        headsign: tripData?.[ETrip.headsign],
                    }}
                />
            )}

            {tripData && (
                <>
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
