import { Box, ButtonBase, Grow } from "@mui/material";
import ItineraryTransitLeg from "./ItineraryTransitLeg";
import ItineraryNonTransitLeg from "./ItineraryNonTransitLeg";
import { getTime, msToTime } from "@/util/tools";
import useTripPlannerStore from "@/hooks/useTripPlannerStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default () => {
    const { city } = useParams();

    const [itineraries, updateDepartures] = useTripPlannerStore(
        useShallow((state) => [
            state.itineraries!.sort((a, b) => a.duration - b.duration),
            state.updateDepartures,
        ])
    );

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.hidden) return;

            updateDepartures(city!);
        }, 45000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Grow in>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    margin: 2,
                    "& > :first-of-type": {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                    "& > :last-of-type": {
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                    },
                }}
            >
                {itineraries.map((itinerary) => (
                    <ButtonBase
                        sx={{
                            width: "100%",
                            paddingX: 1.5,
                            paddingY: 1,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "background.paper",
                            alignItems: "flex-start",
                        }}
                        key={`itinerary-${itinerary.itineraryIndex}`}
                    >
                        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                            {itinerary.legs.map((leg, legIndex) => {
                                const key = `leg-${itinerary.itineraryIndex}-${legIndex}`;

                                if (leg.mode === "TRANSIT") {
                                    return <ItineraryTransitLeg key={key} leg={leg} />;
                                } else {
                                    return <ItineraryNonTransitLeg key={key} leg={leg} />;
                                }
                            })}
                        </Box>

                        {itinerary.duration ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    marginTop: 1,
                                    color: "text.secondary",
                                }}
                            >
                                <span>Leave: {getTime(itinerary.departureTime)}</span>
                                <span>{msToTime(itinerary.duration)}</span>
                                <span>Arrive: {getTime(itinerary.arrivalTime)}</span>
                            </Box>
                        ) : (
                            <>niemożliwe do wykonania w obecnym czasie</>
                        )}
                    </ButtonBase>
                ))}
            </Box>
        </Grow>
    );
};
