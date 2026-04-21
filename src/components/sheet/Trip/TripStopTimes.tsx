import { getTime } from "@/util/tools";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { EStopUpdate, EStopTime, StopUpdate, EStopDepartureStatus } from "typings";

type Props = {
    isTrain: boolean;
    update: StopUpdate;
    hasDeparted: boolean;
};

export default ({ isTrain, update, hasDeparted }: Props) => {
    const [departureTime, isSingleTimeButDelayed, delayType, times] = useMemo(() => {
        const arrScheduled = update[EStopUpdate.arrival][EStopTime.scheduled];
        const arrDelay = update[EStopUpdate.arrival][EStopTime.delay];
        const depScheduled = update[EStopUpdate.departure][EStopTime.scheduled];
        const depDelay = update[EStopUpdate.departure][EStopTime.delay];

        const arrEstimated = arrScheduled + arrDelay;
        const depEstimated = depScheduled + depDelay;

        const arrivalTimeStr = getTime(arrEstimated);
        const departureTimeStr = getTime(depEstimated);
        const isSingleTime = arrivalTimeStr === departureTimeStr;

        return [
            departureTimeStr,
            !isTrain && isSingleTime && Math.abs(depDelay) >= 60000,
            depDelay > 0 ? "delayed" : "early",
            isSingleTime
                ? [update[EStopUpdate.departure]]
                : [update[EStopUpdate.arrival], update[EStopUpdate.departure]],
        ];
    }, [update, isTrain]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: 33,
                "& .MuiTypography-root": {
                    fontSize: 12,
                    textAlign: "right",
                    fontWeight: "inherit",
                },
                opacity: hasDeparted ? 0.7 : undefined,
            }}
        >
            {isSingleTimeButDelayed ? (
                <>
                    <Typography
                        sx={{
                            textDecoration: "line-through",
                            fontWeight: undefined,
                        }}
                    >
                        {getTime(update[EStopUpdate.departure][EStopTime.scheduled])}
                    </Typography>

                    <Typography className={`delay delay-${delayType}`}>{departureTime}</Typography>
                </>
            ) : (
                times.map((time, i) => {
                    const scheduled = time[EStopTime.scheduled];
                    const delay = time[EStopTime.delay];
                    const estimated = scheduled + delay;

                    const isNumber = typeof delay === "number";
                    const delayMinutes = isNumber && Math.floor(Math.abs(delay) / 60000);
                    const delayClass =
                        isNumber && delayMinutes ? (delay > 0 ? "delayed" : "early") : "unknown";

                    return (
                        <Typography key={`${estimated}${i}`} className={`delay delay-${delayClass}`}>
                            {getTime(estimated)}
                        </Typography>
                    );
                })
            )}
        </Box>
    );
};
