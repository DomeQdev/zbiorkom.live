import { ERoute, ERouteGraphRow, EStop, ETripStopType, EVehicle, Location, TripStop, Vehicle } from "typings";
import { useEffect, useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-maplibre";
import { LngLatBounds } from "maplibre-gl";
import useGoBack from "@/hooks/useGoBack";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import TripRoute from "@/map/TripRoute";
import useQueryMarkers from "@/hooks/useQueryMarkers";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";
import { getSheetHeight } from "@/util/tools";

export default () => {
    const [direction, setDirection] = useDirectionStore(
        useShallow((state) => [state.direction, state.setDirection]),
    );
    const { city, route } = useParams();
    const { current: map } = useMap();
    const navigate = useNavigate();
    const goBack = useGoBack();

    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";

    const { data, error } = useQueryRouteGraph({
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

    const shapes = data?.shapes[direction];
    const stops = useMemo<TripStop[] | undefined>(
        () =>
            data?.graph[direction]?.stops.map((row) => {
                const stop = row[ERouteGraphRow.stop];
                const code = stop[EStop.code];
                const label = code ? `${stop[EStop.name]} ${code}` : stop[EStop.name];
                return [stop[EStop.id], label, stop[EStop.location], ETripStopType.normal];
            }),
        [data, direction],
    );

    // stops served only by branches (not on the active line shape[0]) — drawn faded
    const branchOnlyStops = useMemo(
        () =>
            data?.graph[direction]?.stops
                .filter((row) => !row[ERouteGraphRow.main])
                .map((row) => row[ERouteGraphRow.stop][EStop.id]),
        [data, direction],
    );

    useEffect(() => {
        if (error || (data && !data.graph.length)) goBack();
    }, [data, error]);

    useEffect(() => {
        if (!shapes?.length) return;

        map?.fitBounds(
            shapes.reduce(
                (bounds, shape) =>
                    shape.geometry.coordinates.reduce((acc, coord) => acc.extend(coord as Location), bounds),
                new LngLatBounds(),
            ),
            {
                padding: {
                    top: 30,
                    left: 30,
                    right: 30,
                    bottom: getSheetHeight(),
                },
                maxDuration: 1000,
            },
        );
    }, [shapes]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState !== "visible") return;

            refetch();
        }, 15000);

        return () => {
            clearInterval(interval);
        };
    }, [refetch]);

    useEffect(() => {
        return () => {
            setDirection(0);
        };
    }, []);

    return (
        <>
            {data && <Helm variable="route" dictionary={{ route: data.route[ERoute.name] }} />}

            {!!shapes?.length && stops && (
                <TripRoute
                    shape={shapes[0]}
                    branches={shapes.slice(1)}
                    stops={stops}
                    branchOnlyStops={branchOnlyStops}
                    color={data!.route[ERoute.color]}
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
