import Itinerary from "./Itinerary";
import { Box } from "@mui/material";
import { PlannerItinerary } from "typings";

export default ({ itineraries }: { itineraries: PlannerItinerary[] }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {itineraries.map((itinerary) => (
                <Itinerary itinerary={itinerary} />
            ))}
        </Box>
    );
};
