import { getTime } from "@/util/tools";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { EStopUpdate, EStopTime, StopUpdate } from "typings";

type Props = {
    isTrain: boolean;
    update: StopUpdate;
    hasDeparted: boolean;
};

export default ({ isTrain, update, hasDeparted }: Props) => {
    const [departureTime, isSingleTimeButDelayed, delayType, times] = useMemo(() => {
        const arrivalTime = getTime(update[EStopUpdate.arrival][EStopTime.estimated]);
        const departureTime = getTime(update[EStopUpdate.departure][EStopTime.estimated]);
        const isSingleTime = arrivalTime === departureTime;

        return [
            departureTime,
            !isTrain &&
                isSingleTime &&
                Math.abs(update[EStopUpdate.departure][EStopTime.delay] as number) >= 60000,
            (update[EStopUpdate.departure][EStopTime.delay] as number) > 0 ? "delayed" : "early",
            isSingleTime
                ? [update[EStopUpdate.departure]]
                : [update[EStopUpdate.arrival], update[EStopUpdate.departure]],
        ];
    }, [update]);

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
                opacity: hasDeparted ? 0.5 : undefined,
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
                    const estimated = getTime(time[EStopTime.estimated] as number);
                    const delay = time[EStopTime.delay];

                    const isNumber = typeof delay === "number";
                    const delayMinutes = isNumber && Math.floor(Math.abs(delay) / 60000);
                    const delayClass =
                        isNumber && delayMinutes ? (delay > 0 ? "delayed" : "early") : "unknown";

                    return (
                        <Typography
                            key={`${time[EStopTime.estimated]}${i}`}
                            className={`delay delay-${delayClass}`}
                        >
                            {estimated}
                        </Typography>
                    );
                })
            )}
        </Box>
    );
};
