import { useParams } from "react-router-dom";
import { memo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import Departure from "./StopDeparture";
import NoDepartures from "./NoDepartures";
import useStopStore from "@/hooks/useStopStore";
import Loading from "@/ui/Loading";
import { EStopDepartures } from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";

export default memo(() => {
    const { city, stop } = useParams();
    const [firstContact] = useState(Date.now());

    const expandLimit = useStopStore((state) => state.expandLimit);
    const { data } = useQueryStopDepartures({ city: city!, stop: stop! });

    if (!data) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;

    const departures = data[EStopDepartures.departures];
    if (!departures.length) return <NoDepartures />;

    return (
        <Virtuoso
            totalCount={departures.length}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            itemContent={(index) => {
                // if (index === 0) return <StopFilter stop={data.stop} />;

                return <Departure departure={departures[index]} />;
            }}
            endReached={() => {
                if (!data[EStopDepartures.hasMore] || Date.now() - firstContact < 150) return;

                expandLimit(20);
            }}
            components={{
                Footer: () => {
                    if (!data[EStopDepartures.hasMore]) return null;

                    return <Loading height={60} />;
                },
            }}
        />
    );
});
