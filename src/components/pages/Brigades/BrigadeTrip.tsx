import { ListItemButton } from "@mui/material";
import { BrigadeTrip, EBrigadeTrip, ERoute, ETrip, Route } from "typings";
import { Link, useParams } from "react-router-dom";
import getTime from "@/util/getTime";
import { useTranslation } from "react-i18next";
import getColors, { hexFromArgb } from "@/util/getColors";
import RouteChip from "@/ui/RouteChip";
import RouteTag from "@/map/RouteTag";

type Props = {
    trip: BrigadeTrip;
    showRoute?: boolean;
};

export default ({ trip, showRoute }: Props) => {
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
                borderRadius: 1.5,
                backgroundColor: trip[EBrigadeTrip.vehicle] ? background : "background.paper",
                "&:hover": {
                    backgroundColor: trip[EBrigadeTrip.vehicle] ? background : "background.paper",
                },
            }}
        >
            <div>
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
                                time: `${Math.floor(
                                    (trip[EBrigadeTrip.end] - trip[EBrigadeTrip.start]) / 60000
                                )} min`,
                            }),
                            `${trip[EBrigadeTrip.distance]
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} m`,
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
            </div>
        </ListItemButton>
    );
};
