import { useQueryStopDepartures, useQueryStopDirections } from "@/hooks/useQueryStops";
import { EStopDepartures } from "typings";

export default (city: string, stop: string, isStation?: boolean) => {
    const { data: stopData } = useQueryStopDepartures({ city: isStation ? "pkp" : city, stop });
    const { data: directions } = useQueryStopDirections({ city: isStation ? "pkp" : city, stop });

    if (!stopData) return null;

    return {
        info: stopData[EStopDepartures.stop],
        directions,
    };
};
