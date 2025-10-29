import useThemeStore from "@/hooks/useThemeStore";
import RouteTag from "@/map/RouteTag";
import { getTime } from "@/util/tools";
import { Box } from "@mui/material";
import { ColorRole, generateDarkScheme } from "material-color-lite";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EExecution, Execution, VehicleType } from "typings";

export default ({ execution }: { execution: Execution }) => {
    const type = +execution[EExecution.vehicleId].split("/")[0] as VehicleType;
    const color = useThemeStore((state) => state.color);
    const { t } = useTranslation("Executions");

    const inversePrimary = useMemo(
        () => generateDarkScheme(color, [ColorRole.InversePrimary]).inversePrimary,
        [color],
    );

    return (
        <Box
            key={execution[EExecution.gtfsTripId]}
            sx={{
                gap: 1,
                padding: 1,
                margin: 1,
                borderRadius: 1,
                backgroundColor: "background.paper",
                position: "relative",
            }}
        >
            <span
                className="vehicleStopIconLine executionLine"
                style={{
                    backgroundColor: inversePrimary,
                }}
            />
            <span className="tripRow">
                <TripTime
                    scheduled={execution[EExecution.scheduledStartTime]}
                    delay={execution[EExecution.startDelay]}
                />
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${inversePrimary}`,
                    }}
                />
                <span className="tripHeadsign">
                    <RouteTag
                        route={["", "", execution[EExecution.route], "", type, inversePrimary]}
                        brigade={execution[EExecution.brigade] ?? undefined}
                    />
                    {execution[EExecution.startStopName]}
                </span>
            </span>

            <div className="executionTripInfo">
                <span>
                    {t("vehicle")}: #{execution[EExecution.vehicleId].split("/")[1]}
                </span>
                <span>
                    {t("trip")}: {execution[EExecution.gtfsTripId]}
                </span>
            </div>

            <span className="tripRow">
                <TripTime
                    scheduled={execution[EExecution.scheduledEndTime]}
                    delay={execution[EExecution.endDelay] ?? undefined}
                />
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${inversePrimary}`,
                    }}
                />
                <span className="tripHeadsign">{execution[EExecution.endStopName]}</span>
            </span>
        </Box>
    );
};

const TripTime = ({ scheduled, delay = -1 }: { scheduled: number; delay?: number }) => {
    const delayExists = delay !== -1;
    const delayMinutes = delayExists ? Math.floor(Math.abs(delay) / 60000) : null;

    return (
        <span className="tripTime">
            {getTime(scheduled)} (
            <span
                className={
                    "delay-" +
                    (delayExists ? (delayMinutes ? (delay > 0 ? "delayed" : "early") : "none") : "unknown")
                }
                style={{
                    fontWeight: delayExists ? "bold" : "normal",
                    marginLeft: delayExists ? 0 : 0.5,
                }}
            >
                {getTime(scheduled + delay)}
            </span>
            )
        </span>
    );
};
