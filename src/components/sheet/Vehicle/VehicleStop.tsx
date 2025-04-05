import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ERoute, ETripStop, EVehicle, EStopUpdate, EStopTime, StopUpdate, TripStop, Vehicle } from "typings";
import { WavingHand } from "@mui/icons-material";
import VehicleDelay from "./VehicleDelay";
import VehicleStopIcon from "./VehicleStopIcon";
import getTime from "@/util/getTime";
import { useMap } from "react-map-gl";
import useTime from "@/hooks/useTime";
import { useTranslation } from "react-i18next";
import TripStopTimes from "../Trip/TripStopTimes";

type Props = {
    vehicle: Vehicle;
    stop: TripStop;
    index: number;
    update: StopUpdate;
    sequence?: number;
};

export default ({ vehicle, stop, index, update, sequence }: Props) => {
    const { current: map } = useMap();
    const { t } = useTranslation("Vehicle");

    const departure = update[EStopUpdate.departure];
    const scheduledDeparture = departure[EStopTime.scheduled];
    const estimatedDeparture = departure[EStopTime.estimated];
    const delay = departure[EStopTime.delay];

    const shouldUseSeconds = index === 0 && scheduledDeparture - Date.now() < 100000;
    const hasDeparted = sequence! > stop[ETripStop.sequence];
    const hasDelay = typeof delay === "number" && !!Math.floor(Math.abs(delay) / 60000);
    const toDeparture = useTime(estimatedDeparture, shouldUseSeconds);

    const isPKP = window.location.search.includes("pkp");
    const platform = update[EStopUpdate.platform];
    const track = update[EStopUpdate.track];

    return (
        <ListItemButton
            onClick={() =>
                map?.flyTo({
                    center: stop[ETripStop.location],
                    zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                })
            }
            sx={{
                paddingY: 0.5,
            }}
        >
            <ListItemIcon
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                {isPKP && <TripStopTimes update={update} hasDeparted={hasDeparted} />}
                <VehicleStopIcon
                    color={vehicle[EVehicle.route][ERoute.color]}
                    index={index}
                    type={vehicle[EVehicle.route][ERoute.type]}
                    percentTraveled={
                        sequence === 0 && index === 1
                            ? 0
                            : sequence === stop[ETripStop.sequence]
                            ? vehicle[EVehicle.percentTraveled]
                            : undefined
                    }
                    lineMargin={isPKP ? 43 : undefined}
                />
            </ListItemIcon>

            <ListItemText
                primary={
                    <>
                        {stop[ETripStop.onDemand] && (
                            <WavingHand
                                sx={{
                                    fontSize: 16,
                                    marginRight: 0.5,
                                }}
                            />
                        )}
                        {stop[ETripStop.name]}
                    </>
                }
                secondary={
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                        component="span"
                    >
                        <VehicleDelay delay={delay} />

                        {!isPKP && (
                            <>
                                ·
                                {hasDelay && (
                                    <span style={{ textDecoration: "line-through" }}>
                                        {getTime(scheduledDeparture)}
                                    </span>
                                )}
                                <span>{getTime(estimatedDeparture)}</span>
                            </>
                        )}

                        {platform && (
                            <span>
                                · {t("platform")} <b>{platform}</b>
                            </span>
                        )}
                        {track && (
                            <span>
                                · {t("track")} <b>{track}</b>
                            </span>
                        )}
                    </Box>
                }
                sx={{
                    marginLeft: isPKP ? "16px" : "-15px",
                    "& .MuiListItemText-primary": {
                        display: "flex",
                        alignItems: "center",
                        fontSize: 15,
                    },
                    "& .MuiListItemText-secondary": {
                        fontSize: 12,
                    },
                    opacity: hasDeparted ? 0.5 : 1,
                }}
            />
            {!hasDeparted && (
                <ListItemText
                    primary={toDeparture > 0 ? toDeparture : "<1"}
                    secondary={t(shouldUseSeconds ? "sec" : "min")}
                    sx={{
                        textAlign: "right",
                        "& .MuiListItemText-primary": {
                            fontSize: "15px",
                        },
                        "& .MuiListItemText-secondary": {
                            fontSize: "12px",
                        },
                    }}
                />
            )}
        </ListItemButton>
    );
};
