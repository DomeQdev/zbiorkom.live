import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import {
    EStopUpdate,
    EStopTime,
    StopUpdate,
    Trip,
    TripStop,
    Vehicle,
    ETripStop,
    ETrip,
    ERoute,
    EVehicle,
} from "typings";
import { WavingHand } from "@mui/icons-material";
import { useMap } from "react-map-gl";
import useTime from "@/hooks/useTime";
import VehicleStopIcon from "@/sheet/Vehicle/VehicleStopIcon";
import VehicleDelay from "@/sheet/Vehicle/VehicleDelay";
import { useTranslation } from "react-i18next";
import TripStopTimes from "./TripStopTimes";

type Props = {
    vehicle?: Vehicle;
    trip: Trip;
    stop: TripStop;
    index: number;
    update: StopUpdate;
    sequence?: number;
};

export default ({ vehicle, trip, stop, index, update, sequence }: Props) => {
    const { current: map } = useMap();
    const { t } = useTranslation("Vehicle");

    const isServingStop = sequence === stop[ETripStop.sequence];
    const departure = update[EStopUpdate.departure];
    const estimatedDeparture = departure[EStopTime.estimated];
    const delay = departure[EStopTime.delay];

    const shouldUseSeconds = isServingStop && estimatedDeparture - Date.now() < 100000;
    const hasDeparted = estimatedDeparture < Date.now() || delay === "cancelled";
    const toDeparture = useTime(estimatedDeparture, shouldUseSeconds);

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
                <TripStopTimes update={update} hasDeparted={hasDeparted} />
                <VehicleStopIcon
                    color={trip[ETrip.route][ERoute.color]}
                    index={index}
                    type={trip[ETrip.route][ERoute.type]}
                    percentTraveled={
                        sequence === 0 && index === 1
                            ? 0
                            : isServingStop
                            ? vehicle?.[EVehicle.percentTraveled]
                            : undefined
                    }
                    lineMargin={43}
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
                    marginLeft: "16px",
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
