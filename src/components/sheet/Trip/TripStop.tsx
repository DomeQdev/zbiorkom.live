import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import {
    EStopUpdate,
    EStopTime,
    StopUpdate,
    Trip,
    Vehicle,
    EStop,
    ETrip,
    ERoute,
    EVehicle,
    ItineraryStop,
    EItineraryStop,
    EStopDepartureStatus,
} from "typings";
import { RemoveCircleOutline, WavingHand } from "@mui/icons-material";
import { useMap } from "@vis.gl/react-maplibre";
import useTime from "@/hooks/useTime";
import VehicleStopIcon from "@/sheet/Trip/TripStopIcon";
import VehicleDelay from "@/sheet/Trip/TripDelay";
import { useTranslation } from "react-i18next";
import TripStopTimes from "./TripStopTimes";

type Props = {
    vehicle?: Vehicle;
    trip: Trip;
    stop: ItineraryStop;
    index: number;
    color: [color: string, text: string, background: string];
    update: StopUpdate;
    sequence?: number;
};

export default ({ vehicle, trip, stop, index, color, update, sequence }: Props) => {
    const { current: map } = useMap();
    const { t } = useTranslation("Vehicle");

    const departure = update[EStopUpdate.departure];
    const scheduled = departure[EStopTime.scheduled];
    const delay = departure[EStopTime.delay];
    const estimatedDeparture = scheduled + delay;
    const status = departure[EStopTime.status];

    const shouldUseSeconds = index === 0 && estimatedDeparture - Date.now() < 100000;
    const hasDeparted =
        status === EStopDepartureStatus.Cancelled ||
        (sequence === undefined ? estimatedDeparture < Date.now() : sequence > index);
    const toDeparture = useTime(estimatedDeparture, shouldUseSeconds);

    const platform = stop[EItineraryStop.platform];
    const track = update[EStopUpdate.track];
    const stopData = stop[EItineraryStop.stop];
    const alight = stop[EItineraryStop.alight];

    return (
        <ListItemButton
            onClick={() =>
                map?.flyTo({
                    center: stopData[EStop.location],
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
                <TripStopTimes
                    isTrain={trip[ETrip.route][ERoute.type] === 2}
                    update={update}
                    hasDeparted={hasDeparted}
                />
                <VehicleStopIcon
                    color={color}
                    index={index}
                    type={trip[ETrip.route][ERoute.type]}
                    percentTraveled={
                        sequence === 0 && index === 1
                            ? 0
                            : sequence === index
                              ? vehicle?.[EVehicle.percentTraveled]
                              : undefined
                    }
                    lineMargin={41}
                />
            </ListItemIcon>

            <ListItemText
                primary={
                    <>
                        {alight === 0 && (
                            <RemoveCircleOutline
                                sx={{
                                    fontSize: 18,
                                    marginRight: 0.5,
                                    color: "error.contrastText",
                                }}
                            />
                        )}

                        {alight === 2 && (
                            <WavingHand
                                sx={{
                                    fontSize: 16,
                                    marginRight: 0.5,
                                    color: "warning.main",
                                }}
                            />
                        )}

                        {stopData[EStop.name]}
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
                        <VehicleDelay delay={delay} status={status} />

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
                    marginLeft: "12px",
                    "& .MuiListItemText-primary": {
                        display: "flex",
                        alignItems: "center",
                        fontSize: 15,
                        fontWeight: sequence === index ? 700 : undefined,
                        transition: "font-weight .3s",
                    },
                    "& .MuiListItemText-secondary": {
                        fontSize: 12,
                    },
                    opacity: hasDeparted ? 0.7 : 1,
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
