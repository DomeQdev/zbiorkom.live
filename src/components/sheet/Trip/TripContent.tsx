import { Virtuoso } from "react-virtuoso";
import TripStop from "./TripStop";
import Loading from "@/ui/Loading";
import { ERoute, ETrip, ETripStop } from "typings";
import TripFooter from "./TripFooter";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import getColors, { hexFromArgb } from "@/util/getColors";
import Alert from "@/ui/Alert";
import { useTranslation } from "react-i18next";
import { Report, Warning } from "@mui/icons-material";
import { Box } from "@mui/material";

export default () => {
    const { t } = useTranslation("Vehicle");
    const [vehicle, trip, sequence, stops, fresh] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.trip, state.sequence, state.stops, state.fresh])
    );

    const color: [string, string, string] = useMemo(() => {
        if (!trip) return ["#000", "#fff", "#000"];

        const { primary, onPrimary } = getColors(trip[ETrip.route][ERoute.color]);

        const text = hexFromArgb(primary);
        const background = hexFromArgb(onPrimary);

        return [trip[ETrip.route][ERoute.color], text, background];
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
                    Header: () => (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "max-width",
                                marginTop: 1.5,
                                marginX: 1.5,
                                paddingX: 2,
                                paddingY: 1,
                                borderRadius: 2,
                                backgroundColor: color,
                                color: "hsla(0, 0%, 100%, 0.7)",
                            }}
                        >
                            <b>Czekam na Ciebie...</b>
                            <span style={{ fontSize: "0.9rem" }}>
                                Ten autobus jest skomunikowany z pociągiem <b>R3 16312/3</b>.
                            </span>
                        </Box>
                    ),
                    Footer: () => <TripFooter trip={trip} />,
                }}
            />
        </>
    );
};
