import { Box } from "@mui/material";
import { StopDeparture, EStopTime, EStopDeparture, ETrip } from "typings";
import VehicleHeadsign from "../Trip/TripHeadsign";
import useTime from "@/hooks/useTime";
import { getDelay, getTime } from "@/util/tools";

export default ({ departure }: { departure: StopDeparture }) => {
    const departureTime = departure[EStopDeparture.departure];
    const destination = departure[EStopDeparture.destination];

    const departureEstimated = departureTime[EStopTime.scheduled] + departureTime[EStopTime.delay];
    const destinationEstimated = destination
        ? destination[EStopTime.scheduled] + destination[EStopTime.delay]
        : undefined;

    const minutesToDeparture = useTime(departureEstimated);

    const [departureClass] = getDelay(departureTime[EStopTime.delay]);
    const [destinationClass] = getDelay(destination?.[EStopTime.delay]);

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

                {destinationEstimated !== undefined && (
                    <>
                        <span>➜</span>
                        <div className={`delay delay-${destinationClass}`}>
                            {getTime(destinationEstimated)}
                        </div>
                    </>
                )}
            </div>
        </Box>
    );
};
