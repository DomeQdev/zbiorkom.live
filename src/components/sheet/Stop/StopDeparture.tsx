import { Box, ListItemButton, ListItemText } from "@mui/material";
import VehicleHeadsign from "@/sheet/Vehicle/VehicleHeadsign";
import VehicleDelay from "@/sheet/Vehicle/VehicleDelay";
import { StopDeparture, EStopTime, EStopDeparture, EVehicle } from "typings";
import useTime from "@/hooks/useTime";
import getTime from "@/util/getTime";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMap } from "react-map-gl";
import StopDepartureActions from "./StopDepartureActions";
import SmallAlert from "@/ui/SmallAlert";

export default ({ departure }: { departure: StopDeparture }) => {
    const [isExpanded, setExpanded] = useState(false);

    const { current: map } = useMap();
    const navigate = useNavigate();
    const { city } = useParams();

    const scheduled = departure[EStopDeparture.departure][EStopTime.scheduled];
    const estimated = departure[EStopDeparture.departure][EStopTime.estimated];
    const delay = departure[EStopDeparture.departure][EStopTime.delay];
    const alert = departure[EStopDeparture.alert];

    const hasDelay = typeof delay === "number" && !!Math.floor(Math.abs(delay) / 60000);
    const minutesToDeparture = useTime(estimated);

    const isCancelled = delay === "cancelled";
    const showCountdown = !isCancelled;

    return (
        <ListItemButton
            onClick={() => {
                if (departure[EStopDeparture.vehicle]) {
                    map?.flyTo({
                        center: departure[EStopDeparture.vehicle][EVehicle.location],
                        zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                    });
                } else {
                    setExpanded(!isExpanded);
                }
            }}
            onDoubleClick={() => {
                const vehicle = departure[EStopDeparture.vehicle];

                navigate(
                    `/${city}/${vehicle ? "vehicle" : "trip"}/${
                        vehicle ? encodeURIComponent(vehicle[EVehicle.id]) : departure[EStopDeparture.id]
                    }`,
                    {
                        state: -2,
                    }
                );
            }}
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
                opacity: isCancelled ? 0.5 : undefined,
            }}
        >
            <ListItemText
                primary={
                    <>
                        <VehicleHeadsign
                            route={departure[EStopDeparture.route]}
                            headsign={departure[EStopDeparture.headsign]}
                            brigade={departure[EStopDeparture.brigade]}
                        />

                        {showCountdown && (
                            <span>
                                {false ? (
                                    <>
                                        <b>~{minutesToDeparture > 0 ? minutesToDeparture : "0"}</b> min
                                    </>
                                ) : minutesToDeparture > 0 ? (
                                    minutesToDeparture
                                ) : (
                                    "<1"
                                )}
                            </span>
                        )}
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
                            <VehicleDelay delay={delay} showGPS={!!departure[EStopDeparture.vehicleId]} />·
                            {hasDelay || isCancelled ? (
                                <span style={{ textDecoration: "line-through" }}>{getTime(scheduled)}</span>
                            ) : (
                                <span>{getTime(estimated)}</span>
                            )}
                            {hasDelay && <span>{getTime(estimated)}</span>}
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
