import getTime from "@/util/getTime";
import { Box, Typography } from "@mui/material";
import { EStopUpdate, EStopTime, StopUpdate } from "typings";

export default ({ update, hasDeparted }: { update: StopUpdate; hasDeparted: boolean }) => {
    const arrivalEstimated = update[EStopUpdate.arrival][EStopTime.estimated];
    const departureEstimated = update[EStopUpdate.departure][EStopTime.estimated];

    const times = update.slice(0, arrivalEstimated === departureEstimated ? 1 : 2);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                "& .MuiTypography-root": {
                    fontSize: 12,
                    width: 35,
                    textAlign: "right",
                    fontWeight: hasDeparted ? 400 : 600,
                },
                opacity: hasDeparted ? 0.5 : undefined,
            }}
        >
            {times.map((time, i) => {
                const estimated = getTime(time[EStopTime.estimated] as number);
                const delay = time[EStopTime.delay];

                const isNumber = typeof delay === "number";
                const delayMinutes = isNumber && Math.floor(Math.abs(delay) / 60000);
                const delayClass = isNumber && delayMinutes ? (delay > 0 ? "delayed" : "early") : "unknown";

                return (
                    <Typography key={`${time[EStopTime.estimated]}${i}`} className={`delay-${delayClass}`}>
                        {estimated}
                    </Typography>
                );
            })}
        </Box>
    );
};
