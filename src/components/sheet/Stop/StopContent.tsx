import { useParams } from "react-router-dom";
import { memo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import Departure from "./StopDeparture";
import useStopStore from "@/hooks/useStopStore";
import Loading from "@/ui/Loading";
import { EStopDepartures } from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";
import { useTranslation } from "react-i18next";
import Alert from "@/ui/Alert";
import { Bedtime } from "@mui/icons-material";

export default memo(() => {
    const { city, stop } = useParams();
    const { t } = useTranslation("Schedules");
    const [firstContact] = useState(Date.now());
    const isStation = window.location.pathname.includes("/station");

    const expandLimit = useStopStore((state) => state.expandLimit);
    const { data } = useQueryStopDepartures({
        city: isStation ? "pkp" : city!,
        stop: stop!,
    });

    if (!data) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;

    const departures = data?.[EStopDepartures.departures];
    if (!departures?.length) return <Alert title={t("noDepartures")} Icon={Bedtime} color="error" />;

    return (
        <Virtuoso
            totalCount={departures.length}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            itemContent={(index) => <Departure departure={departures[index]} isStation={isStation} />}
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
