import { Box, ButtonBase, Grow, Typography } from "@mui/material";
import { NonTransitLeg, PlannerItinerary, TransitLeg } from "typings";
import ItineraryTransitLeg from "./ItineraryTransitLeg";
import ItineraryNonTransitLeg from "./ItineraryNonTransitLeg";

export default ({ itineraries }: { itineraries: PlannerItinerary[] }) => {
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
                {itineraries.map((itinerary, index) => (
                    <ButtonBase
                        sx={{
                            width: "100%",
                            paddingX: 1.5,
                            paddingY: 1,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "background.paper",
                        }}
                        key={`itinerary-${index}`}
                    >
                        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                            {itinerary.legs.map((leg, index) =>
                                leg.mode === "TRANSIT" ? (
                                    <ItineraryTransitLeg key={index} leg={leg as TransitLeg} />
                                ) : (
                                    <ItineraryNonTransitLeg key={index} leg={leg as NonTransitLeg} />
                                )
                            )}
                        </Box>
                        <Typography variant="caption">xyz</Typography>
                    </ButtonBase>
                ))}
            </Box>
        </Grow>
    );
};
