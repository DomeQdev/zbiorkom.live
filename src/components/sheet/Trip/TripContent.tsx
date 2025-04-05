import { useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import TripStop from "./TripStop";
import useQueryTrip from "@/hooks/useQueryTrip";
import useQueryTripUpdate from "@/hooks/useQueryTripUpdate";
import Loading from "@/ui/Loading";
import { ETrip, ETripStop } from "typings";
import TripFooter from "./TripFooter";

export default () => {
    const { city, trip } = useParams();

    const cityId = window.location.search.includes("pkp") ? "pkp" : city!;

    const { data: tripData } = useQueryTrip({
        city: cityId,
        trip: trip!,
    });

    const { data: tripUpdate } = useQueryTripUpdate({
        city: cityId,
        trip: trip!,
    });

    if (!tripData?.trip || !tripUpdate) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;

    const sequence = tripUpdate.sequence ?? 0;

    return (
        <>
            <Virtuoso
                data={tripData.trip[ETrip.stops]}
                style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
                itemContent={(index, stop) => (
                    <TripStop
                        key={stop[ETripStop.id]}
                        vehicle={tripUpdate.vehicle}
                        trip={tripData.trip!}
                        stop={stop}
                        index={index}
                        update={tripUpdate?.stops?.[index]!}
                        sequence={sequence}
                    />
                )}
                overscan={100}
                initialTopMostItemIndex={sequence < 1 ? 0 : sequence - 1}
                components={{
                    Footer: () => <TripFooter trip={tripData.trip!} />,
                }}
            />
        </>
    );
};
