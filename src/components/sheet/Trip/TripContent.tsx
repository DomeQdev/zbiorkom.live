import { Virtuoso } from "react-virtuoso";
import TripStop from "./TripStop";
import Loading from "@/ui/Loading";
import { ERoute, ETrip, ETripStop } from "typings";
import TripFooter from "./TripFooter";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import getColors, { hexFromArgb } from "@/util/getColors";

export default () => {
    const [vehicle, trip, sequence, stops] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.trip, state.sequence ?? 0, state.stops])
    );

    const color: [string, string, string] = useMemo(() => {
        if (!trip) return ["#000", "#fff", "#000"];

        const { primary, onPrimary } = getColors(trip[ETrip.route][ERoute.color]);

        const text = hexFromArgb(primary);
        const background = hexFromArgb(onPrimary);

        return [trip[ETrip.route][ERoute.color], text, background];
    }, [trip]);

    if (!trip || !stops) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;

    return (
        <>
            <Virtuoso
                data={trip[ETrip.stops]}
                style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
                itemContent={(index, stop) => (
                    <TripStop
                        key={stop[ETripStop.id]}
                        vehicle={vehicle}
                        trip={trip}
                        stop={stop}
                        index={index}
                        color={color}
                        update={stops[index]}
                        sequence={sequence}
                    />
                )}
                overscan={100}
                initialTopMostItemIndex={sequence < 1 ? 0 : sequence - 1}
                components={{
                    Footer: () => <TripFooter trip={trip} />,
                }}
            />
        </>
    );
};
