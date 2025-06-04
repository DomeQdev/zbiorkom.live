import { ETrip } from "typings";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import VehicleStop from "./VehicleStop";
import { Virtuoso } from "react-virtuoso";
import { Report, Warning } from "@mui/icons-material";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import TripFooter from "../Trip/TripFooter";
import Alert from "@/ui/Alert";

export default () => {
    const [vehicle, trip, stops, sequence, fresh] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.trip, state.stops, state.sequence, state.fresh])
    );
    const { t } = useTranslation("Vehicle");

    if (!vehicle) return fresh ? null : <Alert Icon={Report} title={t("vehicleNotFound")} color="error" />;

    if (!trip || !stops)
        return (
            <Typography
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "warning.main",
                    fontWeight: "bold",
                }}
            >
                <Warning color="warning" fontSize="large" />
                {t("tripNotFound")}
            </Typography>
        );

    return (
        <Virtuoso
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            data={trip[ETrip.stops]}
            itemContent={(index, stop) => (
                <VehicleStop
                    vehicle={vehicle}
                    stop={stop}
                    index={index}
                    update={stops[index]}
                    sequence={sequence}
                />
            )}
            overscan={100}
            initialTopMostItemIndex={sequence ? sequence - 1 : 0}
            components={{
                Footer: () => <TripFooter trip={trip} />,
            }}
        />
    );
};
