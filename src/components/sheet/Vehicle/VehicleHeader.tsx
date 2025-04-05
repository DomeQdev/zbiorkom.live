import { Box, IconButton } from "@mui/material";
import VehicleHeadsign from "./VehicleHeadsign";
import { Close } from "@mui/icons-material";
import VehicleMenu from "./VehicleMenu";
import useGoBack from "@/hooks/useGoBack";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { useMap } from "react-map-gl";
import { ETrip, EVehicle } from "typings";

export default () => {
    const [vehicle, trip] = useVehicleStore(useShallow((state) => [state.vehicle, state.trip]));
    const { current: map } = useMap();
    const goBack = useGoBack();

    if (!vehicle) return null;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -1,
            }}
        >
            <VehicleHeadsign
                route={vehicle[EVehicle.route]}
                shortName={trip?.[ETrip.shortName]}
                headsign={trip?.[ETrip.headsign]}
                onClick={() => {
                    map?.flyTo({
                        center: vehicle[EVehicle.location],
                        zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                    });
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    marginRight: -0.5,
                    "& .MuiIconButton-root": {
                        backgroundColor: "background.paper",
                        color: "hsla(0, 0%, 100%, 0.87)",
                        width: 35,
                        height: 35,
                        "& svg": {
                            width: 22,
                            height: 22,
                        },
                        "& :focus": {
                            backgroundColor: "background.paper",
                        },
                    },
                }}
            >
                <VehicleMenu />

                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
