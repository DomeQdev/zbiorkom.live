import { Box } from "@mui/material";
import { StopDeparture, EStopTime, EStopDeparture } from "typings";
import VehicleHeadsign from "../Vehicle/VehicleHeadsign";
import useTime from "@/hooks/useTime";
import { getDelay } from "../Vehicle/VehicleDelay";
import getTime from "@/util/getTime";

export default ({ departure }: { departure: StopDeparture }) => {
    const minutesToDeparture = useTime(departure[EStopDeparture.departure][EStopTime.estimated]);

    const [departureClass] = getDelay(departure[EStopDeparture.departure][EStopTime.delay]);
    const [destinationClass] = getDelay(departure[EStopDeparture.destination]?.[EStopTime.delay]);

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
            <VehicleHeadsign
                route={departure[EStopDeparture.route]}
                headsign={departure[EStopDeparture.headsign]}
            />

            <div className="times">
                <div className={`delay delay-${departureClass}`}>
                    {minutesToDeparture > 0 ? minutesToDeparture : "<1"} min
                </div>

                {departure[EStopDeparture.destination] && (
                    <>
                        <span>➜</span>
                        <div className={`delay delay-${destinationClass}`}>
                            {getTime(departure[EStopDeparture.destination][EStopTime.estimated])}
                        </div>
                    </>
                )}
            </div>
        </Box>
    );
};
