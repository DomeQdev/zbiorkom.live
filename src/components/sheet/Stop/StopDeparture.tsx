import { Box, ListItemButton, ListItemText } from "@mui/material";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import VehicleDelay from "@/sheet/Trip/TripDelay";
import { StopDeparture, EStopDeparture, ETrip, ERoute, EStopDepartureStatus, EStopTime } from "typings";
import useTime from "@/hooks/useTime";
import { getTime } from "@/util/tools";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildCitySuffix, getCityFromUrl } from "@/util/tools";

export default ({ departure }: { departure: StopDeparture }) => {
    const { t } = useTranslation("Vehicle");

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

    const onClick = () =>
        navigate(
            `/${city}/trip/${encodeURIComponent(trip[ETrip.id])}` +
                buildCitySuffix(getCityFromUrl(city), city),
            {
                state: -2,
            },
        );

    return (
        <ListItemButton
            onClick={onClick}
            sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: 70,
                "& > *": {
                    width: "100%",
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
                                showGPS={!!vehicle && route[ERoute.type] === 2}
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
        </ListItemButton>
    );
};
