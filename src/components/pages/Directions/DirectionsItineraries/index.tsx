import { useQueryPlannerItineraries } from "@/hooks/useQueryTripPlanner";
import usePlacesStore from "@/hooks/usePlacesStore";
import { useParams } from "react-router-dom";
import Itinerary from "./Itinerary";
import { Box } from "@mui/material";

const now = Date.now();

export default () => {
    const { from, to } = usePlacesStore((state) => state.places);
    const { city } = useParams();

    const { data: itineraries, isLoading } = useQueryPlannerItineraries(city!, from, to, now, false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {isLoading && <>ładuje</>}

            {itineraries?.journeys.map((itinerary) => (
                <Itinerary itinerary={itinerary} />
            ))}
        </Box>
    );
};
