import {
    ERoute,
    EStop,
    ETripStopType,
    EVehicle,
    Location,
    RouteGraphStop,
    Shape,
    TripStop,
    Vehicle,
    VehiclePlacement,
} from "typings";
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
import useRoutePlacementsStore from "@/hooks/useRoutePlacementsStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";
import { buildCitySuffix, getCityFromUrl, getSheetHeight } from "@/util/tools";

const NO_SHAPES: Shape[] = [];
const NO_PLACEMENTS: VehiclePlacement[] = [];

const toTripStop = (stop: RouteGraphStop): TripStop => {
    const code = stop[EStop.code];
    const label = code ? `${stop[EStop.name]} ${code}` : stop[EStop.name];
    return [stop[EStop.id], label, stop[EStop.location], ETripStopType.normal];
};

export default () => {
    const [direction, setDirection] = useDirectionStore(
        useShallow((state) => [state.direction, state.setDirection]),
    );
    const setPlacements = useRoutePlacementsStore((state) => state.setPlacements);
    const { city, route } = useParams();
    const { current: map } = useMap();
    const navigate = useNavigate();
    const goBack = useGoBack();

    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";

    // the routes list folds in lines of neighbouring cities, which only their own city can serve the graph of
    const routeCity = getCityFromUrl(city);

    const { data, error } = useQueryRouteGraph({
        city: routeCity,
        route: route!,
    });

    // no viewport, so every vehicle of the direction comes in wherever it is, placed on the diagram
    const { data: markers } = useQueryMarkers({
        city: routeCity,
        options: {
            filterRoutes: [route!],
            filterDirection: direction,
            graph: true,
        },
    });

    const graph = data?.graph[direction];
    const shapes = data?.shapes[direction] ?? NO_SHAPES; // the trunk's polyline, then one per branch
    const color = data?.route[ERoute.color];

    const lines = useMemo(() => shapes.slice(0, 1), [shapes]);
    const variantLines = useMemo(() => shapes.slice(1), [shapes]);
    const stops = useMemo(() => graph?.trunk.map(toTripStop), [graph]);
    const variantStops = useMemo(
        () => graph?.branches.flatMap((branch) => branch.stops.map(toTripStop)),
        [graph],
    );

    useEffect(() => {
        if (error) goBack();
    }, [error]);

    useEffect(() => {
        setPlacements(markers?.placements ?? NO_PLACEMENTS);
    }, [markers]);

    useEffect(() => {
        if (!shapes.length) return;

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
        return () => {
            setDirection(0);
            setPlacements(NO_PLACEMENTS);
        };
    }, []);

    return (
        <>
            {data && <Helm variable="route" dictionary={{ route: data.route[ERoute.name] }} />}

            {lines.length > 0 && stops && variantStops && color && (
                <TripRoute
                    lines={lines}
                    stops={stops}
                    variantLines={variantLines}
                    variantStops={variantStops}
                    color={color}
                />
            )}

            {markers?.positions.map((vehicle) => (
                <VehicleMarker
                    key={`${vehicle[EVehicle.city]}:${vehicle[EVehicle.id]}`}
                    vehicle={vehicle as Vehicle}
                    showBrigade={showBrigade}
                    showFleet={showFleet}
                    onClick={() =>
                        navigate(
                            `/${city}/vehicle/${encodeURIComponent(vehicle[EVehicle.id])}` +
                                buildCitySuffix(vehicle[EVehicle.city], city),
                            { state: -3 },
                        )
                    }
                />
            ))}

            <Outlet />
        </>
    );
};
