import { useParams } from "react-router-dom";
import { memo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import StationDeparture from "./StationDeparture";
import NoDepartures from "@/sheet/Stop/NoDepartures";
import useStopStore from "@/hooks/useStopStore";
import Loading from "@/ui/Loading";
import { EStopDepartures } from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";

export default memo(() => {
    const expandLimit = useStopStore((state) => state.expandLimit);
    const [firstContact] = useState(Date.now());
    const { city, station } = useParams();

    const { data } = useQueryStopDepartures({ city: "pkp", stop: station! });

    if (!data) return <Loading height="calc(var(--rsbs-overlay-h) - 70px)" />;
    if (!data?.[EStopDepartures.departures]?.length) return <NoDepartures />;

    return (
        <Virtuoso
            data={data[EStopDepartures.departures]}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            itemContent={(_, departure) => <StationDeparture departure={departure} city={city!} />}
            overscan={100}
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
