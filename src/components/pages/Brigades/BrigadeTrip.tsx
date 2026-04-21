import { ColorRole, generateDarkScheme } from "material-color-lite";
import { ListItemButton } from "@mui/material";
import { ETrip, ERoute, Trip } from "typings";
import { Link, useParams } from "react-router-dom";
import { getTime, msToTime } from "@/util/tools";
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
                <span className="tripTime">{getTime(trip[ETrip.firstStop][1])}</span>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${trip[ETrip.route][ERoute.color]}`,
                    }}
                />
                <span className="tripHeadsign">
                    {showRoute && <RouteTag route={trip[ETrip.route]} />}
                    {trip[ETrip.firstStop][0]}
                </span>
            </span>
            <div className="tripInfo">
                <span>
                    {[
                        t("travelTime", {
                            time: msToTime(trip[ETrip.lastStop][1] - trip[ETrip.firstStop][1]),
                        }),
                        `${trip[ETrip.distance].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} m`,
                    ].join(" · ")}
                </span>
                <span>
                    {(trip as any).vehicle
                        ? t("operatedBy", { vehicle: (trip as any).vehicle.split(":")[1] })
                        : t("clickForTrip")}
                </span>
            </div>
            <span className="tripRow">
                <span className="tripTime">{getTime(trip[ETrip.lastStop][1])}</span>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${trip[ETrip.route][ERoute.color]}`,
                    }}
                />
                <span className="tripHeadsign">{trip[ETrip.lastStop][0]}</span>
            </span>
        </ListItemButton>
    );
};
