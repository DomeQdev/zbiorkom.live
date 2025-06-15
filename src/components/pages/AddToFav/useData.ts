import { useQueryStopDepartures, useQueryStopDirections } from "@/hooks/useQueryStops";
import { EStopDepartures } from "typings";

export default (city: string, stop: string) => {
    const { data: stopData } = useQueryStopDepartures({ city, stop });
    const { data: directions } = useQueryStopDirections({ city, stop });

    if (!stopData) return null;

    return {
        info: stopData[EStopDepartures.stop],
        directions,
    };
};
