import { ERoute, ERouteDirection, ERouteInfo, EVehicle, Location, Vehicle } from "typings";
import { useEffect } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useMap } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import useGoBack from "@/hooks/useGoBack";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import useQueryMarkers from "@/hooks/useQueryMarkers";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRoute } from "@/hooks/useQueryRoutes";
import { getSheetHeight } from "@/util/tools";

export default () => {
    const direction = useDirectionStore(useShallow((state) => state.direction));
    const socket = useOutletContext<Socket>();
    const { city, route } = useParams();
    const { current: map } = useMap();
    const navigate = useNavigate();
    const goBack = useGoBack();

    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";

    const { data } = useQueryRoute({
        city: city!,
        route: route!,
    });

    const { data: positions, refetch } = useQueryMarkers({
        city: city!,
        options: {
            filterRoutes: [route!],
            filterDirection: direction,
        },
    });

    useEffect(() => {
        if (!data) return;

        if (!data[ERouteInfo.directions].length) return goBack();

        map?.fitBounds(
            data[ERouteInfo.directions][direction][ERouteDirection.shape].geometry.coordinates.reduce(
                (bounds, coord) => bounds.extend(coord as Location),
                new LngLatBounds()
            ),
            {
                padding: {
                    top: 30,
                    left: 30,
                    right: 30,
                    bottom: getSheetHeight(),
                },
                maxDuration: 1000,
            }
        );
    }, [data, direction]);

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
    }, [socket, refetch]);

    return (
        <>
            {data && <Helm variable="route" dictionary={{ route: data[ERouteInfo.route][ERoute.name] }} />}

            {data?.[ERouteInfo.directions][direction] && (
                <TripRoute
                    shape={data[ERouteInfo.directions][direction][ERouteDirection.shape]}
                    stops={data[ERouteInfo.directions][direction][ERouteDirection.stops]}
                    color={data[ERouteInfo.route][ERoute.color]}
                />
            )}

            {positions?.positions.map((vehicle) => (
                <VehicleMarker
                    key={vehicle[EVehicle.id]}
                    vehicle={vehicle as Vehicle}
                    showBrigade={showBrigade}
                    showFleet={showFleet}
                    onClick={() =>
                        navigate(`/${city}/vehicle/${encodeURIComponent(vehicle[EVehicle.id])}`, {
                            state: -3,
                        })
                    }
                />
            ))}

            <Outlet />
        </>
    );
};
