import { useParams } from "react-router-dom";
import { DirectionsPlace } from "..";
import { useQueryPlannerItineraries } from "@/hooks/useQueryTripPlanner";
import Itinerary from "./Itinerary";
import { Box } from "@mui/material";

type Props = {
    from: DirectionsPlace;
    to: DirectionsPlace;
};

const now = Date.now();

export default ({ from, to }: Props) => {
    const { city } = useParams();

    const { data: itineraries, isLoading } = useQueryPlannerItineraries(
        city!,
        from.location!,
        to.location!,
        now,
        false
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {isLoading && <>ładuje</>}

            {itineraries?.map((itinerary) => (
                <Itinerary itinerary={itinerary} />
            ))}
        </Box>
    );
};
