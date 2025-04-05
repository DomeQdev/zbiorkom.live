import useQueryStation from "@/hooks/useQueryStation";
import useQueryStop from "@/hooks/useQueryStop";
import useQueryStopDirections from "@/hooks/useQueryStopDirections";
import { EStopDepartures } from "typings";

export default (city: string, id: string, isStation?: boolean) => {
    const { data: stopData } = isStation
        ? useQueryStation({ station: id })
        : useQueryStop({ city, stop: id });

    const { data: directionsData } = useQueryStopDirections({ city: isStation ? "pkp" : city, stop: id });

    if (!stopData) return null;

    return {
        info: stopData[EStopDepartures.stop],
        directions: directionsData,
    };
};
