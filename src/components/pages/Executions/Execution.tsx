import { useQueryExecutionTrip } from "@/hooks/useQueryExecutions";
import RouteTag from "@/map/RouteTag";
import Icon from "@/ui/Icon";
import { fadeColor, getTime, parseVehicleId } from "@/util/tools";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import { CSSProperties, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { EExecution, EExecutionStop, ERoute, Execution, Route, VehicleType } from "typings";
import useExecutionScheme, { getDelayInfo } from "./useExecutionScheme";

type Props = {
    execution: Execution;
    route?: Route;
    city: string;
    date: string;
};

export default ({ execution, route, city, date }: Props) => {
    const scheme = useExecutionScheme();
    const { t } = useTranslation("Executions");
    const [expanded, setExpanded] = useState(false);

    // Kurs carries only routeId; resolve the badge from the autocomplete routes map,
    // falling back to a synthetic bus-coloured tuple when the line is unknown.
    const routeTag: Route = route ?? ["", "", execution[EExecution.route], "", "", 3, scheme.inversePrimary];
    const lineColor = route?.[ERoute.color] || scheme.inversePrimary;

    // vehicle is a fleet id that may carry an agency prefix (e.g. "GPA_502"); parse it so
    // we show only the number and can pick the agency icon when one exists.
    const rawVehicle = execution[EExecution.vehicle];
    const vehicle = rawVehicle ? parseVehicleId(`${routeTag[ERoute.type]}:${rawVehicle}`) : null;

    // surfaceVariant alone reads too bright on the dark dialog — sink it toward the
    // background for a subtler, lower-elevation card.
    const cardSurface = fadeColor(scheme.surfaceVariant, 0.45, scheme.background);

    const { data, isLoading } = useQueryExecutionTrip({
        city,
        trip: execution[EExecution.trip],
        date,
        vehicle: rawVehicle || undefined,
        enabled: expanded,
    });

    // The trip endpoint returns every stop; the first/last are the origin/destination we
    // already render as the head/tail rows, so only the ones in between are new.
    const intermediate = data?.stops.slice(1, -1) ?? [];

    return (
        <Box
            className="execCard"
            onClick={() => setExpanded((value) => !value)}
            style={
                {
                    "--exec-surface": cardSurface,
                    "--exec-line": lineColor,
                } as CSSProperties
            }
        >
            <TimelineRow
                rail="first"
                time={execution[EExecution.scheduledStart]}
                delay={execution[EExecution.startDelay]}
                name={execution[EExecution.originName]}
                trailing={
                    vehicle && (
                        <span
                            className="execVehicleChip"
                            style={{
                                backgroundColor: scheme.secondaryContainer,
                                color: scheme.onSecondaryContainer,
                            }}
                        >
                            <svg viewBox="0 0 24 24">
                                <Icon
                                    type={+vehicle.vehicleType as VehicleType}
                                    city={city}
                                    agency={vehicle.agency}
                                />
                            </svg>
                            {vehicle.vehicleNumber}
                        </span>
                    )
                }
            />

            <div className="execRow">
                <span />
                <span className="execRail" />
                <span
                    className={"execStop execExpand" + (expanded ? " open" : "")}
                    style={{ color: scheme.onSurfaceVariant }}
                >
                    {expanded && isLoading ? (
                        <CircularProgress size={15} sx={{ color: scheme.onSurfaceVariant }} />
                    ) : (
                        <KeyboardArrowDown fontSize="small" />
                    )}
                    {expanded ? t("hideStops") : t("expandStops")}
                </span>
            </div>

            <div className={"execCollapse" + (expanded && !isLoading ? " open" : "")}>
                <div className="execStops">
                    {intermediate.map((stop, index) => (
                        <TimelineRow
                            key={`${stop[EExecutionStop.stopId]}-${index}`}
                            rail=""
                            mid
                            time={stop[EExecutionStop.scheduledArrival]}
                            delay={stop[EExecutionStop.delay]}
                            name={stop[EExecutionStop.stopName]}
                        />
                    ))}
                </div>
            </div>

            <TimelineRow
                rail="last"
                time={execution[EExecution.scheduledEnd]}
                delay={execution[EExecution.endDelay]}
                name={execution[EExecution.destName]}
                leading={<RouteTag route={routeTag} brigade={execution[EExecution.brigade] || undefined} />}
            />
        </Box>
    );
};

type RowProps = {
    rail: "first" | "last" | "";
    mid?: boolean;
    time: number;
    delay: number;
    name: string;
    leading?: ReactNode;
    trailing?: ReactNode;
};

const TimelineRow = ({ rail, mid, time, delay, name, leading, trailing }: RowProps) => {
    const { status, minutes, color } = getDelayInfo(delay);

    const label = status === "onTime" ? "0′" : `${status === "delayed" ? "+" : "−"}${minutes}′`;

    return (
        <div className="execRow">
            <div className="execTime">
                <span
                    className="execDelayPill"
                    style={{ backgroundColor: color.replace("hsl(", "hsla(").replace(")", ", 0.2)"), color }}
                >
                    {label}
                </span>
                <span className="execTimeValue">{getTime(time)}</span>
            </div>
            <div className={"execRail " + rail}>
                <span className={"execDot" + (mid ? " mid" : "")} />
            </div>
            <div className="execStop">
                {leading}
                <span className={"execStopName" + (mid ? " mid" : "")}>{name}</span>
                {trailing && (
                    <>
                        <span className="execStopSpacer" />
                        {trailing}
                    </>
                )}
            </div>
        </div>
    );
};
