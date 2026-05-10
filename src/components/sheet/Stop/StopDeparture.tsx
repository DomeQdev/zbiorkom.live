import { Box, ListItemButton, ListItemText } from "@mui/material";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import VehicleDelay from "@/sheet/Trip/TripDelay";
import { StopDeparture, EStopDeparture, EVehicle, ETrip, EStopDepartureStatus, EStopTime } from "typings";
import useTime from "@/hooks/useTime";
import { getTime } from "@/util/tools";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-maplibre";
import StopDepartureActions from "./StopDepartureActions";
import { useTranslation } from "react-i18next";

export default ({ departure, isStation }: { departure: StopDeparture; isStation: boolean }) => {
    const { t } = useTranslation("Vehicle");
    const [isExpanded, setExpanded] = useState(false);

    const { current: map } = useMap();
    const navigate = useNavigate();
    const { city } = useParams();

    const trip = departure[EStopDeparture.trip];
    const vehicle = departure[EStopDeparture.vehicle];
    const departureData = departure[EStopDeparture.departure];
    const scheduled = departureData[EStopTime.scheduled];
    const delay = departureData[EStopTime.delay];
    const status = departureData[EStopTime.status];
    const platform = departureData[EStopTime.platform];

    const route = trip[ETrip.route];
    const headsign = trip[ETrip.headsign];
    const shortName = trip[ETrip.shortName];
    const brigade = trip[ETrip.brigade];

    const estimated = scheduled + delay;
    const hasDelay = Math.abs(delay) >= 59000;
    const minutesToDeparture = useTime(estimated);

    const isCancelled = status === EStopDepartureStatus.Cancelled;
    const showCountdown = !isCancelled && estimated > Date.now();

    const useVehicleRoute = !!vehicle && status !== EStopDepartureStatus.OnPreviousTrip;

    const onSuperClick = () => {
        navigate(
            [
                city,
                useVehicleRoute ? "vehicle" : "trip",
                encodeURIComponent(useVehicleRoute ? vehicle![EVehicle.id] : trip[ETrip.id]),
            ].join("/") + (isStation ? "?pkp" : ""),
            {
                state: -2,
            },
        );
    };

    return (
        <ListItemButton
            onClick={() => {
                if (isStation) return onSuperClick();

                if (vehicle) {
                    map?.flyTo({
                        center: vehicle[EVehicle.location],
                        zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                    });
                } else {
                    setExpanded(!isExpanded);
                }
            }}
            onDoubleClick={onSuperClick}
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: isExpanded ? "background.paper" : "transparent",
                margin: isExpanded ? 1 : 0,
                transition: "background-color 0.2s, margin 0.2s, max-height 0.2s",
                maxHeight: isExpanded ? 125 : 70,
                "& > *": {
                    width: "100%",
                },
                "&:hover, &:focus": {
                    backgroundColor: isExpanded ? "background.paper" : "transparent",
                },
                opacity: isCancelled ? 0.7 : undefined,
            }}
        >
            <ListItemText
                primary={
                    <>
                        <VehicleHeadsign
                            route={route}
                            headsign={headsign}
                            shortName={shortName}
                            brigade={brigade}
                        />

                        {showCountdown && <span>{minutesToDeparture > 0 ? minutesToDeparture : "<1"}</span>}
                    </>
                }
                secondary={
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <VehicleDelay
                                delay={delay}
                                status={status}
                                showGPS={!!vehicle || (isStation ? undefined : false)}
                            />
                            ·
                            {hasDelay || isCancelled ? (
                                <span style={{ textDecoration: "line-through" }}>{getTime(scheduled)}</span>
                            ) : (
                                <span>{getTime(estimated)}</span>
                            )}
                            {hasDelay && <span>{getTime(estimated)}</span>}
                            {platform && (
                                <span>
                                    · {t("platform")} <b>{platform}</b>
                                </span>
                            )}
                        </Box>

                        {showCountdown && <span>min</span>}
                    </>
                }
                primaryTypographyProps={{
                    sx: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 14.5,
                    },
                }}
                secondaryTypographyProps={{
                    component: "div",
                    sx: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12.5,
                    },
                }}
            />

            {isExpanded && <StopDepartureActions departure={departure} />}
        </ListItemButton>
    );
};
