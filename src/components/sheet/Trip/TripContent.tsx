import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import TripStop from "./TripStop";
import Loading from "@/ui/Loading";
import { ERoute, ETrip, EItinerary, EItineraryStop, EStop } from "typings";
import TripFooter from "./TripFooter";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useRef, useEffect } from "react";
import Alert from "@/ui/Alert";
import { useTranslation } from "react-i18next";
import { Report, Warning } from "@mui/icons-material";
import { ColorRole, generateDarkScheme } from "material-color-lite";
import { useFollowStore } from "@/hooks/useFollowStore";

const VirtuosoComponents = {
    Footer: ({ context: { trip } }: any) => (trip ? <TripFooter trip={trip} /> : null),
};

export default () => {
    const { t } = useTranslation("Vehicle");
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [vehicle, trip, sequence, stops, itinerary, fresh, streamError, streamLoading] = useVehicleStore(
        useShallow((state) => [
            state.vehicle,
            state.trip,
            state.sequence,
            state.stops,
            state.itinerary,
            state.fresh,
            state.streamError,
            state.streamLoading,
        ]),
    );
    const { isFollowing, setIsFollowing } = useFollowStore();

    const color: [string, string, string] = useMemo(() => {
        if (!trip) return ["#000", "#fff", "#000"];

        const { primary, onPrimary } = generateDarkScheme(trip[ETrip.route][ERoute.color], [
            ColorRole.Primary,
            ColorRole.OnPrimary,
        ]);

        return [trip[ETrip.route][ERoute.color], primary, onPrimary];
    }, [trip]);

    const stopsLength = itinerary?.[EItinerary.stops].length;

    const stopScrollIndex =
        sequence === undefined || sequence < 1 || !stopsLength
            ? 0
            : sequence - (sequence + 1 === stopsLength ? 0 : 1);

    useEffect(() => {
        if (!isFollowing) return;

        virtuosoRef.current?.scrollToIndex({
            index: stopScrollIndex,
            align: stopScrollIndex + 1 === stopsLength ? "end" : "start",
            behavior: "smooth",
        });
    }, [sequence, isFollowing]);

    const disableFollowing = () => {
        if (isFollowing) setIsFollowing(false);
    };

    const virtuosoContext = useMemo(() => ({ trip }), [trip]);

    if (!trip && !itinerary) {
        if (streamError)
            return (
                <Alert
                    Icon={Report}
                    title={t("loadError", { ns: "Shared" })}
                    description={String(streamError)}
                    color="error"
                />
            );
        if (streamLoading || fresh) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;
        return <Alert Icon={Report} title={t("vehicleNotFound")} color="error" />;
    }

    if (!trip || !itinerary) return <Alert Icon={Warning} title={t("tripNotFound")} color="warning" />;

    if (!stops) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;

    return (
        <div onWheel={disableFollowing} onTouchMove={disableFollowing}>
            <Virtuoso
                ref={virtuosoRef}
                data={itinerary[EItinerary.stops]}
                style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
                itemContent={(index, itineraryStop) => (
                    <TripStop
                        key={itineraryStop[EItineraryStop.stop][EStop.id]}
                        vehicle={vehicle}
                        trip={trip}
                        stop={itineraryStop}
                        index={index}
                        color={color}
                        update={stops[index]}
                        sequence={sequence}
                    />
                )}
                overscan={100}
                initialTopMostItemIndex={stopScrollIndex}
                components={VirtuosoComponents}
                context={virtuosoContext}
            />
        </div>
    );
};
