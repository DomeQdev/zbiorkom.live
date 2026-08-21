import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import TripStop from "./TripStop";
import Loading from "@/ui/Loading";
import { ERoute, ETrip, EItinerary, EItineraryStop, EStop, EVehicle } from "typings";
import TripFooter from "./TripFooter";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useRef, useEffect } from "react";
import Alert from "@/ui/Alert";
import { useTranslation } from "react-i18next";
import { Report, Warning } from "@mui/icons-material";
import { ColorRole, generateDarkScheme } from "material-color-lite";
import { useFollowStore } from "@/hooks/useFollowStore";
import { isHidden } from "@/util/hiddenAreas";

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

    // Stops inside blanked out areas are dropped from the list as well, but the API keeps
    // counting them: the vehicle can sit between two stops that are now a single row apart,
    // so its position in the list and its progress along that merged segment are redone here.
    const list = useMemo(() => {
        const itineraryStops = itinerary?.[EItinerary.stops] || [];
        const visible = itineraryStops
            .map((stop, index) => [stop, index] as const)
            .filter(([stop]) => !isHidden(stop[EItineraryStop.stop][EStop.location]));

        // cumulative meters from the first stop, falling back to plain stop counting
        const hasDistances = itineraryStops.some((stop) => stop[EItineraryStop.distance] > 0);
        const travelled = (index: number) =>
            hasDistances ? itineraryStops[index][EItineraryStop.distance] : index;

        if (sequence === undefined) return { stops: visible, sequence, markerIndex: -1, percent: 0 };

        const next = visible.findIndex(([, index]) => index >= sequence);
        const listSequence = next === -1 ? visible.length : next;
        const percentTraveled = vehicle?.[EVehicle.percentTraveled];

        // still at the first stop — the icon rides the top of the first line, as before
        if (listSequence === 0) {
            return {
                stops: visible,
                sequence: listSequence,
                markerIndex: visible.length > 1 ? 1 : -1,
                percent: 0,
            };
        }

        if (listSequence === visible.length || percentTraveled === undefined) {
            return { stops: visible, sequence: listSequence, markerIndex: -1, percent: 0 };
        }

        const from = travelled(sequence - 1);
        const to = travelled(sequence);
        const position = from + ((to - from) * percentTraveled) / 100;

        const rowFrom = travelled(visible[listSequence - 1][1]);
        const rowTo = travelled(visible[listSequence][1]);

        return {
            stops: visible,
            sequence: listSequence,
            markerIndex: listSequence,
            percent:
                rowTo > rowFrom
                    ? Math.min(100, Math.max(0, ((position - rowFrom) / (rowTo - rowFrom)) * 100))
                    : 0,
        };
    }, [itinerary, sequence, vehicle]);

    const stopsLength = list.stops.length;

    const stopScrollIndex =
        list.sequence === undefined || list.sequence < 1 || !stopsLength
            ? 0
            : list.sequence - (list.sequence + 1 === stopsLength ? 0 : 1);

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
                data={list.stops}
                style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
                itemContent={(index, [itineraryStop, itineraryIndex]) => (
                    <TripStop
                        key={itineraryStop[EItineraryStop.stop][EStop.id]}
                        trip={trip}
                        stop={itineraryStop}
                        index={index}
                        color={color}
                        update={stops[itineraryIndex]}
                        sequence={list.sequence}
                        percentTraveled={index === list.markerIndex ? list.percent : undefined}
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
