import { ERoute, EStop, ETripStopType, EVehicle, Location, RouteGraphStop, TripStop, Vehicle } from "typings";
import { useEffect, useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-maplibre";
import { LngLatBounds } from "maplibre-gl";
import useGoBack from "@/hooks/useGoBack";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import TripRoute, { TripRouteVariant } from "@/map/TripRoute";
import useQueryMarkers from "@/hooks/useQueryMarkers";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";
import { getSheetHeight, VARIANT_COLOR } from "@/util/tools";

const toTripStop = (stop: RouteGraphStop): TripStop => {
    const code = stop[EStop.code];
    const label = code ? `${stop[EStop.name]} ${code}` : stop[EStop.name];
    return [stop[EStop.id], label, stop[EStop.location], ETripStopType.normal];
};

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

    const graph = data?.graph[direction];
    const shapes = data?.shapes[direction];
    const color = data?.route[ERoute.color];

    const stops = useMemo<TripStop[] | undefined>(() => graph?.trunk.map(toTripStop), [graph]);

    // shapes[0] is the trunk and shapes[b + 1] the polyline of branch b; variants on the map and in the
    // sheet share VARIANT_COLOR
    const variants = useMemo<TripRouteVariant[] | undefined>(
        () =>
            graph && shapes && color
                ? graph.branches.flatMap((branch, b) => {
                      const shape = shapes[b + 1];
                      if (!shape) return [];
                      return [{ shape, stops: branch.stops.map(toTripStop), color: VARIANT_COLOR }];
                  })
                : undefined,
        [graph, shapes, color],
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

            {!!shapes?.length && stops && color && (
                <TripRoute shape={shapes[0]} stops={stops} color={color} variants={variants} />
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
