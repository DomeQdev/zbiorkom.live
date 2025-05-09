import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layer, Marker, Source } from "react-map-gl";
import VehicleMarker from "./VehicleMarker";
import StopMarker from "./StopMarker";
import { Badge, Fab } from "@mui/material";
import { FilterAlt, FilterAltOutlined } from "@mui/icons-material";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";
import useMarkers from "@/hooks/useMarkers";
import DotMarkers from "./DotMarkers";
import { DotVehicle, EStop, EVehicle, Vehicle } from "typings";

export default ({ city }: { city: string }) => {
    const [routes, models] = useFilterStore(useShallow((state) => [state.routes, state.models]));
    const badgeRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { vehicles, stops, useDots, geoJson } = useMarkers({
        city,
        moveBadge: () => {
            badgeRef.current?.animate(
                [{ right: "16px" }, { right: "28px" }, { right: "4px" }, { right: "16px" }],
                {
                    duration: 550,
                    iterations: 1,
                }
            );
        },
    });

    const isFiltering = routes.length || models.length;

    return (
        <>
            {useDots && <DotMarkers vehicles={vehicles as DotVehicle[]} />}

            {!useDots &&
                vehicles.map((vehicle) => (
                    <VehicleMarker
                        key={vehicle[EVehicle.id]}
                        vehicle={vehicle as Vehicle}
                        onClick={() =>
                            navigate(
                                `/${city}/vehicle/${encodeURIComponent(vehicle[EVehicle.id])}` +
                                    (vehicle[EVehicle.city] === "pkp" ? "?pkp" : "")
                            )
                        }
                    />
                ))}

            {stops.map((stop) => (
                <Marker
                    key={stop[EStop.id]}
                    pitchAlignment="map"
                    rotationAlignment="map"
                    longitude={stop[EStop.location][0]}
                    latitude={stop[EStop.location][1]}
                    style={{ zIndex: 2 }}
                    onClick={() => {
                        const stopType =
                            stop[EStop.station] && stop[EStop.type] === 2 && stop[EStop.city] === "pkp"
                                ? "station"
                                : "stop";

                        navigate(`/${city}/${stopType}/${encodeURIComponent(stop[EStop.id])}`);
                    }}
                >
                    <StopMarker stop={stop} />
                </Marker>
            ))}

            {geoJson?.map(({ source, layers }, i) => (
                <Source key={"" + i} type="geojson" data={source}>
                    {layers.map((layer, j) => (
                        <Layer key={"" + i + j} {...layer} />
                    ))}
                </Source>
            ))}

            <Badge
                color="primary"
                invisible={!isFiltering}
                badgeContent={routes.length + models.length}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    position: "absolute",
                    right: 16,
                    top: 16 * 4,
                    transition: "right ease 0.3s",
                }}
                ref={badgeRef}
            >
                <Fab color="primary" size="small" onClick={() => navigate(`/${city}/filter`)}>
                    {isFiltering ? <FilterAlt /> : <FilterAltOutlined />}
                </Fab>
            </Badge>
        </>
    );
};
