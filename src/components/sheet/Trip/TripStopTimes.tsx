import { getTime } from "@/util/tools";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { EStopUpdate, EStopTime, StopUpdate, DelayType } from "typings";

type Props = {
    update: StopUpdate;
    hasDeparted: boolean;
};

export default ({ update, hasDeparted }: Props) => {
    const showSeconds = (JSON.parse(localStorage.getItem("showSeconds") || "false"));
    const mergeArrivalDeparture = (JSON.parse(localStorage.getItem("mergeArrivalDeparture") || "true"))
    const showScheduledTimes = (JSON.parse(localStorage.getItem("showScheduledTimes") || "true"))

    const getDelayType = (delay?: DelayType) => {
        if (!(typeof delay === "number")) {
            return delay;
        }
        if (delay > 0) {
            return Math.floor(Math.abs(delay) / 60000) ? "delayed" : "unknown";

        } else if (delay < 0) {
            return "early";
        }
    };

    const [arrivalTime, departureTime] = useMemo(() => {
        return [
            [
                getTime(update[EStopUpdate.arrival][EStopTime.scheduled]),
                getTime(update[EStopUpdate.arrival][EStopTime.estimated]),
                getDelayType(update[EStopUpdate.arrival][EStopTime.delay])
            ],
            [
                getTime(update[EStopUpdate.departure][EStopTime.scheduled]),
                getTime(update[EStopUpdate.departure][EStopTime.estimated]),
                getDelayType(update[EStopUpdate.departure][EStopTime.delay])
            ],
        ];
    }, [update]);


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: showSeconds ? 49.5: 33,
                "& .MuiTypography-root": {
                    fontSize: 12,
                    textAlign: "right",
                    fontWeight: "inherit",
                },
                opacity: hasDeparted ? 0.5 : undefined,
            }}
        >
            {mergeArrivalDeparture && arrivalTime[1] === departureTime[1] ? (
                <>
                    {departureTime[0] !== departureTime[1] && showScheduledTimes && (
                        <Typography sx={{ textDecoration: 'line-through' }}>
                            {departureTime[0]}
                        </Typography>
                    )}
                    <Typography
                        className={`delay delay-${departureTime[2]}`}
                    >
                        {departureTime[1]}
                    </Typography>
                </>
            ) : (
                <>
                    {arrivalTime[0] !== arrivalTime[1] && showScheduledTimes && (
                        <Typography sx={{ textDecoration: 'line-through' }}>
                            {arrivalTime[0]}
                        </Typography>
                    )}
                    <Typography
                        className={`delay delay-${arrivalTime[2]}`}
                    >
                        {arrivalTime[1]}
                    </Typography>
                    {departureTime[0] !== departureTime[1] && showScheduledTimes && (
                        <Typography sx={{ textDecoration: 'line-through' }}>
                            {departureTime[0]}
                        </Typography>
                    )}
                    <Typography
                        className={`delay delay-${departureTime[2]}`}
                    >
                        {departureTime[1]}
                    </Typography>
                </>
            )}
        </Box>
    );
};
