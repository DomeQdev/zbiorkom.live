import { Box } from "@mui/material";
import { StopDeparture, EStopTime, EStopDeparture, EStopDepartureStatus, ETrip } from "typings";
import VehicleHeadsign from "../Trip/TripHeadsign";
import useTime from "@/hooks/useTime";
import { getDelay } from "@/util/tools";

export default ({ departure }: { departure: StopDeparture }) => {
    const departureTime = departure[EStopDeparture.departure];

    const departureEstimated = departureTime[EStopTime.scheduled] + departureTime[EStopTime.delay];

    const minutesToDeparture = useTime(departureEstimated);

    const isLive = (status: EStopDepartureStatus) =>
        status !== EStopDepartureStatus.Cancelled &&
        status !== EStopDepartureStatus.OnPreviousTrip &&
        status !== EStopDepartureStatus.Scheduled;

    const [rawDepartureClass] = getDelay(departureTime[EStopTime.delay]);

    const departureClass = isLive(departureTime[EStopTime.status]) ? rawDepartureClass : "unknown";

    const trip = departure[EStopDeparture.trip];

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                "& .times": {
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                },
            }}
        >
            <VehicleHeadsign route={trip[ETrip.route]} headsign={trip[ETrip.headsign]} />

            <div className="times">
                <div className={`delay delay-${departureClass}`}>
                    {minutesToDeparture > 0 ? minutesToDeparture : "<1"} min
                </div>
            </div>
        </Box>
    );
};
