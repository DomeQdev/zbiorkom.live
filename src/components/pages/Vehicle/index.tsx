import { useMap } from "react-map-gl";
import { useEffect } from "react";
import VehicleMarker from "@/map/VehicleMarker";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { ERoute, ETrip, EVehicle } from "typings";
import { useQueryTrip } from "@/hooks/useQueryTrip";

export default () => {
    const [vehicle, trip, fresh, setFresh] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.trip, state.fresh, state.setFresh])
    );

    const socket = useOutletContext<Socket>();
    const { current: map } = useMap();
    const params = useParams();

    const { data, refetch, isLoading } = useQueryTrip({
        city: window.location.search.includes("pkp") ? "pkp" : params.city!,
        vehicle: params.vehicle!,
    });

    useEffect(() => {
        if (!fresh || isLoading || !data) return;

        if (data.vehicle) {
            map?.flyTo({
                center: data.vehicle[EVehicle.location],
                zoom: map.getZoom() > 15 ? map.getZoom() : 15,
            });
        }

        setFresh(false);
    }, [fresh, data, isLoading]);

    useEffect(() => {
        if (!socket) return;

        const onRefresh = () => {
            if (document.visibilityState !== "visible") return;

            refetch();
        };

        socket.on("refresh", onRefresh);

        return () => {
            socket.off("refresh", onRefresh);
        };
    }, [socket]);

    if (!vehicle) return null;

    return (
        <>
            <Helm
                variable="vehicle"
                dictionary={{
                    vehicle: params.vehicle?.split("/")[1],
                    route: vehicle[EVehicle.route][ERoute.name],
                }}
            />
            <VehicleMarker vehicle={vehicle} />

            {trip && (
                <TripRoute
                    stops={trip[ETrip.stops]}
                    shape={trip[ETrip.shape]}
                    color={vehicle[EVehicle.route][ERoute.color]}
                />
            )}

            <Outlet />
        </>
    );
};
