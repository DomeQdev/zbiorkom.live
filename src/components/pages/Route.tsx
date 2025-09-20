import { ERoute, ERouteDirection, ERouteInfo, EVehicle, Location, Vehicle } from "typings";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
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
import { useWebSocket } from "@/hooks/useWebSocket";

export default () => {
    const [direction, setDirection] = useDirectionStore(
        useShallow((state) => [state.direction, state.setDirection])
    );
    const { subscribe } = useWebSocket();
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
        const onRefresh = () => {
            if (document.visibilityState !== "visible") return;

            refetch();
        };

        const unsubscribe = subscribe("refresh", onRefresh);

        return () => {
            unsubscribe();
        };
    }, [subscribe, refetch]);

    useEffect(() => {
        return () => {
            setDirection(0);
        };
    }, []);

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
