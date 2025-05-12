import { useParams } from "react-router-dom";
import { DirectionsPlace } from "..";
import { useQueryPlannerItineraries } from "@/hooks/useQueryTripPlanner";
import Itinerary from "./Itinerary";

type Props = {
    from: DirectionsPlace;
    to: DirectionsPlace;
};

export default ({ from, to }: Props) => {
    const { city } = useParams();

    const { data: itineraries, isLoading } = useQueryPlannerItineraries(
        city!,
        from.location!,
        to.location!,
        1747054220717,
        false
    );

    return (
        <>
            {isLoading && <>ładuje</>}

            {itineraries?.map((itinerary) => (
                <Itinerary itinerary={itinerary} />
            ))}
        </>
    );
};
