import { ColorRole, generateDarkScheme } from "material-color-lite";
import { ListItemButton } from "@mui/material";
import { ETrip, ERoute, Trip } from "typings";
import { Link, useParams } from "react-router-dom";
import { getTime, msToTime, parseVehicleId } from "@/util/tools";
import { useTranslation } from "react-i18next";
import RouteTag from "@/map/RouteTag";
import { useMemo } from "react";

type Props = {
    trip: Trip;
    isActive: boolean;
    showRoute: boolean;
};

export default ({ trip, isActive, showRoute }: Props) => {
    const { t } = useTranslation("Brigades");
    const { city } = useParams();

    const firstStop = trip[ETrip.firstStop];
    const lastStop = trip[ETrip.lastStop];
    const distance = trip[ETrip.distance];

    const background = useMemo(
        () => generateDarkScheme(trip[ETrip.route][ERoute.color], [ColorRole.SecondaryContainer]),
        [trip],
    ).secondaryContainer;

    return (
        <ListItemButton
            component={Link}
            to={
                (trip as any).vehicle
                    ? `/${city}/vehicle/${encodeURIComponent((trip as any).vehicle)}`
                    : `/${city}/trip/${trip[ETrip.id]}`
            }
            state={-3}
            sx={{
                display: "block",
                borderRadius: 1.5,
                backgroundColor: isActive || (trip as any).vehicle ? background : "background.paper",
                "&:hover": {
                    backgroundColor: isActive || (trip as any).vehicle ? background : "background.paper",
                },
            }}
        >
            <span
                className="vehicleStopIconLine tripLine"
                style={{
                    backgroundColor: trip[ETrip.route][ERoute.color],
                }}
            />
            <span className="tripRow">
                <span className="tripTime">{firstStop && getTime(firstStop[1])}</span>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${trip[ETrip.route][ERoute.color]}`,
                    }}
                />
                <span className="tripHeadsign">
                    {showRoute && <RouteTag route={trip[ETrip.route]} />}
                    {firstStop?.[0]}
                </span>
            </span>
            <div className="tripInfo">
                <span>
                    {[
                        firstStop &&
                            lastStop &&
                            t("travelTime", {
                                time: msToTime(lastStop[1] - firstStop[1]),
                            }),
                        distance !== undefined &&
                            `${distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} m`,
                    ]
                        .filter(Boolean)
                        .join(" · ")}
                </span>
                <span>
                    {(() => {
                        const tripVehicle = (trip as any).vehicle as string | undefined;
                        if (!tripVehicle) return t("clickForTrip");
                        const { vehicleNumber } = parseVehicleId(tripVehicle);
                        if (vehicleNumber.startsWith("_")) return t("clickForTrip");
                        return t("operatedBy", { vehicle: vehicleNumber });
                    })()}
                </span>
            </div>
            <span className="tripRow">
                <span className="tripTime">{lastStop && getTime(lastStop[1])}</span>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${trip[ETrip.route][ERoute.color]}`,
                    }}
                />
                <span className="tripHeadsign">{lastStop?.[0]}</span>
            </span>
        </ListItemButton>
    );
};
