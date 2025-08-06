import { ListItemButton } from "@mui/material";
import { BrigadeTrip, EBrigadeTrip, ERoute } from "typings";
import { Link, useParams } from "react-router-dom";
import { getTime, msToTime } from "@/util/tools";
import { useTranslation } from "react-i18next";
import getColors, { hexFromArgb } from "@/util/getColors";
import RouteTag from "@/map/RouteTag";

type Props = {
    trip: BrigadeTrip;
    isActive: boolean;
    showRoute: boolean;
};

export default ({ trip, isActive, showRoute }: Props) => {
    const { t } = useTranslation("Brigades");
    const { city } = useParams();

    const background = hexFromArgb(getColors(trip[EBrigadeTrip.route][ERoute.color]).secondaryContainer);

    return (
        <ListItemButton
            component={Link}
            to={
                trip[EBrigadeTrip.vehicle]
                    ? `/${city}/vehicle/${encodeURIComponent(trip[EBrigadeTrip.vehicle])}`
                    : `/${city}/trip/${trip[EBrigadeTrip.id]}`
            }
            state={-3}
            sx={{
                display: "block",
                borderRadius: 1.5,
                backgroundColor: isActive || trip[EBrigadeTrip.vehicle] ? background : "background.paper",
                "&:hover": {
                    backgroundColor: isActive || trip[EBrigadeTrip.vehicle] ? background : "background.paper",
                },
            }}
        >
            <span
                className="vehicleStopIconLine tripLine"
                style={{
                    backgroundColor: trip[EBrigadeTrip.route][ERoute.color],
                }}
            />
            <span className="tripRow">
                <span className="tripTime">{getTime(trip[EBrigadeTrip.start])}</span>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${trip[EBrigadeTrip.route][ERoute.color]}`,
                    }}
                />
                <span className="tripHeadsign">
                    {showRoute && <RouteTag route={trip[EBrigadeTrip.route]} />}
                    {trip[EBrigadeTrip.startStop]}
                </span>
            </span>
            <div className="tripInfo">
                <span>
                    {[
                        t("travelTime", {
                            time: msToTime(trip[EBrigadeTrip.end] - trip[EBrigadeTrip.start]),
                        }),
                        `${trip[EBrigadeTrip.distance].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} m`,
                    ].join(" · ")}
                </span>
                <span>
                    {trip[EBrigadeTrip.vehicle]
                        ? t("operatedBy", { vehicle: trip[EBrigadeTrip.vehicle].split("/")[1] })
                        : t("clickForTrip")}
                </span>
            </div>
            <span className="tripRow">
                <span className="tripTime">{getTime(trip[EBrigadeTrip.end])}</span>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${trip[EBrigadeTrip.route][ERoute.color]}`,
                    }}
                />
                <span className="tripHeadsign">{trip[EBrigadeTrip.endStop]}</span>
            </span>
        </ListItemButton>
    );
};
