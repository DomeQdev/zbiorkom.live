import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layer, Marker, Source } from "@vis.gl/react-maplibre";
import VehicleMarker from "./VehicleMarker";
import StopMarker from "./StopMarker";
import { Badge, Box, Button, Fab } from "@mui/material";
import { FilterAlt, FilterAltOutlined } from "@mui/icons-material";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";
import useMarkers from "@/hooks/useMarkers";
import DotMarkers from "./DotMarkers";
import { DotVehicle, EStop, EVehicle, Vehicle } from "typings";
import cities from "cities";
import { useTranslation } from "react-i18next";

export default ({ city }: { city: string }) => {
    const [routes, models] = useFilterStore(useShallow((state) => [state.routes, state.models]));
    const badgeRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("Menu");
    const navigate = useNavigate();

    const { vehicles, stops, useDots, geoJson, suggestedCity } = useMarkers({
        city,
        moveBadge: () => {
            badgeRef.current?.animate(
                [{ right: "16px" }, { right: "28px" }, { right: "4px" }, { right: "16px" }],
                {
                    duration: 550,
                    iterations: 1,
                },
            );
        },
    });

    const useStopCodeAsIcon = localStorage.getItem("useStopCodeAsIcon") === "true";
    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";
    const isFiltering = routes.length || models.length;

    return (
        <>
            {useDots && <DotMarkers vehicles={vehicles as DotVehicle[]} />}

            {!useDots &&
                vehicles.map((vehicle) => (
                    <VehicleMarker
                        key={vehicle[EVehicle.id]}
                        vehicle={vehicle as Vehicle}
                        showBrigade={showBrigade}
                        showFleet={showFleet}
                        onClick={() =>
                            navigate(
                                `/${city}/vehicle/${encodeURIComponent(vehicle[EVehicle.id])}` +
                                    (vehicle[EVehicle.city] === "pkp" ? "?pkp" : ""),
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
                        const stopType = stop[EStop.city] === "pkp" ? "station" : "stop";

                        navigate(`/${city}/${stopType}/${encodeURIComponent(stop[EStop.id])}`);
                    }}
                >
                    <StopMarker stop={stop} useStopCodeAsIcon={useStopCodeAsIcon} />
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

            {suggestedCity && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "background.paper",
                        color: "text.primary",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: 1,
                        borderRadius: 2,
                        zIndex: 1000,
                    }}
                >
                    <span style={{ marginLeft: 8 }}>
                        {t("switchTo")} <b>{cities[suggestedCity].name}</b>?
                    </span>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                        color="primary"
                        onClick={() => {
                            navigate(`/${suggestedCity}`, { replace: true });
                            localStorage.setItem("city", suggestedCity);
                        }}
                    >
                        {t("yes")}
                    </Button>
                </Box>
            )}
        </>
    );
};
