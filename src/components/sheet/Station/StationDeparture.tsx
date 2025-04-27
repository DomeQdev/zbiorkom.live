import { EStopDeparture, EStopTime, StopDeparture } from "typings";
import { Box, ListItemButton, ListItemText } from "@mui/material";
import VehicleDelay from "@/sheet/Vehicle/VehicleDelay";
import getTime from "@/util/getTime";
import VehicleHeadsign from "@/sheet/Vehicle/VehicleHeadsign";
import useTime from "@/hooks/useTime";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SmallAlert from "@/ui/SmallAlert";

export default ({ departure, city }: { departure: StopDeparture; city: string }) => {
    const { t } = useTranslation("Vehicle");

    const scheduled = departure[EStopDeparture.departure][EStopTime.scheduled];
    const estimated = departure[EStopDeparture.departure][EStopTime.estimated];
    const delay = departure[EStopDeparture.departure][EStopTime.delay];
    const alert = departure[EStopDeparture.alert];

    const hasDelay = typeof delay === "number" && !!Math.floor(Math.abs(delay) / 60000);
    const minutesToDeparture = useTime(estimated);

    const isCancelled = delay === "cancelled";
    const showCountdown = !isCancelled && estimated > Date.now() - 30000;

    return (
        <ListItemButton
            component={Link}
            to={
                departure[EStopDeparture.vehicleId]
                    ? `/${city}/vehicle/${encodeURIComponent(departure[EStopDeparture.vehicleId])}?pkp`
                    : `/${city}/trip/${encodeURIComponent(departure[EStopDeparture.id])}?pkp`
            }
            state={-2}
            sx={{
                display: "flex",
                flexDirection: "column",
                opacity: isCancelled ? 0.5 : undefined,
                "& > *": {
                    width: "100%",
                },
            }}
        >
            <ListItemText
                primary={
                    <>
                        <VehicleHeadsign
                            route={departure[EStopDeparture.route]}
                            shortName={departure[EStopDeparture.shortName]}
                            brigade={departure[EStopDeparture.brigade]}
                            headsign={departure[EStopDeparture.headsign]}
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
                                showGPS={departure[EStopDeparture.vehicleId] ? true : undefined}
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
        </ListItemButton>
    );
};
