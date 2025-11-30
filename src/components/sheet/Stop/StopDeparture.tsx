import { Box, ListItemButton, ListItemText } from "@mui/material";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import VehicleDelay from "@/sheet/Trip/TripDelay";
import { StopDeparture, EStopTime, EStopDeparture, EVehicle } from "typings";
import useTime from "@/hooks/useTime";
import { getTime } from "@/util/tools";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMap } from "@vis.gl/react-maplibre";
import StopDepartureActions from "./StopDepartureActions";
import SmallAlert from "@/ui/SmallAlert";
import { useTranslation } from "react-i18next";
import { useChristmasStore } from "@/hooks/useChristmasVehicles";

export default ({ departure, isStation }: { departure: StopDeparture; isStation: boolean }) => {
    const { t } = useTranslation("Vehicle");
    const [isExpanded, setExpanded] = useState(false);

    const { current: map } = useMap();
    const navigate = useNavigate();
    const { city } = useParams();

    const vehicle = departure[EStopDeparture.vehicle];
    const vehicleId = vehicle?.[EVehicle.id] || departure[EStopDeparture.vehicleId];
    const scheduled = departure[EStopDeparture.departure][EStopTime.scheduled];
    const estimated = departure[EStopDeparture.departure][EStopTime.estimated];
    const delay = departure[EStopDeparture.departure][EStopTime.delay];
    const alert = departure[EStopDeparture.alert];

    const hasDelay = typeof delay === "number" && !!Math.floor(Math.abs(delay) / 60000);
    const minutesToDeparture = useTime(estimated);

    const isCancelled = delay === "cancelled";
    const showCountdown = !isCancelled && estimated > Date.now();

    // Sprawdź czy to świąteczny pojazd
    const isChristmasVehicle = useChristmasStore((state) =>
        vehicleId ? state.isChristmasVehicle(vehicleId) : false,
    );

    const onSuperClick = () => {
        navigate(
            [
                city,
                vehicle ? "vehicle" : "trip",
                encodeURIComponent(vehicle ? vehicle[EVehicle.id] : departure[EStopDeparture.id]),
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
            className={isChristmasVehicle ? "departure-snow" : undefined}
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: isExpanded ? "background.paper" : "transparent",
                margin: isExpanded ? 1 : 0,
                transition: "background-color 0.2s, margin 0.2s, max-height 0.2s",
                maxHeight: (isExpanded ? 125 : 70) + (alert ? 30 : 0),
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
                            route={departure[EStopDeparture.route]}
                            headsign={departure[EStopDeparture.headsign]}
                            shortName={departure[EStopDeparture.shortName]}
                            brigade={departure[EStopDeparture.brigade]}
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
                                showGPS={
                                    !!departure[EStopDeparture.vehicleId] || (isStation ? undefined : false)
                                }
                            />
                            ·
                            {hasDelay || isCancelled ? (
                                <span style={{ textDecoration: "line-through" }}>{getTime(scheduled)}</span>
                            ) : (
                                <span>{getTime(estimated)}</span>
                            )}
                            {hasDelay && <span>{getTime(estimated)}</span>}
                            {departure[EStopDeparture.platform] && (
                                <span>
                                    · {t("platform")} <b>{departure[EStopDeparture.platform]}</b>
                                </span>
                            )}
                            {departure[EStopDeparture.track] && (
                                <span>
                                    · {t("track")} <b>{departure[EStopDeparture.track]}</b>
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

            {alert && <SmallAlert type={alert.type} text={alert.text} />}

            {isExpanded && <StopDepartureActions departure={departure} />}
        </ListItemButton>
    );
};
