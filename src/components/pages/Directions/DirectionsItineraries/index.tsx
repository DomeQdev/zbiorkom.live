import { Box, ButtonBase, Grow, Typography } from "@mui/material";
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

                                if (leg.mode === "TRANSIT")
                                    return <ItineraryTransitLeg key={key} leg={leg} />;
                                return <ItineraryNonTransitLeg key={key} leg={leg} />;
                            })}
                        </Box>

                        {itinerary.duration !== Infinity && itinerary.duration > 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    width: "100%",
                                    textAlign: "right",
                                    color: "text.secondary",
                                    mt: 0.5,
                                }}
                            >
                                {getTime(itinerary.departureTime)} - {getTime(itinerary.arrivalTime)} (
                                {msToTime(itinerary.duration)})
                            </Typography>
                        )}
                    </ButtonBase>
                ))}
            </Box>
        </Grow>
    );
};
