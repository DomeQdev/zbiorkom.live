import { Virtuoso } from "react-virtuoso";
import TripStop from "./TripStop";
import Loading from "@/ui/Loading";
import { ERoute, ETrip, ETripStop } from "typings";
import TripFooter from "./TripFooter";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import Alert from "@/ui/Alert";
import { useTranslation } from "react-i18next";
import { Report, Warning } from "@mui/icons-material";
import { ColorRole, generateDarkScheme } from "material-color-lite";

export default () => {
    const { t } = useTranslation("Vehicle");
    const [vehicle, trip, sequence, stops, fresh] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.trip, state.sequence, state.stops, state.fresh]),
    );

    const color: [string, string, string] = useMemo(() => {
        if (!trip) return ["#000", "#fff", "#000"];

        const { primary, onPrimary } = generateDarkScheme(trip[ETrip.route][ERoute.color], [
            ColorRole.Primary,
            ColorRole.OnPrimary,
        ]);

        return [trip[ETrip.route][ERoute.color], primary, onPrimary];
    }, [trip]);

    if (!vehicle && !trip && fresh) return <Loading height="calc(var(--rsbs-overlay-h) - 60px)" />;
    if (!vehicle && !trip) return <Alert Icon={Report} title={t("vehicleNotFound")} color="error" />;
    if (!trip || !stops) return <Alert Icon={Warning} title={t("tripNotFound")} color="warning" />;

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
                initialTopMostItemIndex={sequence === undefined || sequence < 1 ? 0 : sequence - 1}
                components={{
                    Footer: () => <TripFooter trip={trip} />,
                }}
            />
        </>
    );
};
