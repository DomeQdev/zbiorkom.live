import { Box, IconButton, Skeleton } from "@mui/material";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import { Close } from "@mui/icons-material";
import useGoBack from "@/hooks/useGoBack";
import { ETrip, EVehicle } from "typings";
import useVehicleStore from "@/hooks/useVehicleStore";
import TripMenu from "./TripMenu";
import { useShallow } from "zustand/react/shallow";

export default () => {
    const [trip, vehicle] = useVehicleStore(useShallow((state) => [state.trip, state.vehicle]));
    const goBack = useGoBack();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -1,
            }}
        >
            {trip || vehicle ? (
                <VehicleHeadsign
                    route={(trip?.[ETrip.route] || vehicle?.[EVehicle.route])!}
                    shortName={trip?.[ETrip.shortName]}
                    headsign={trip?.[ETrip.headsign]}
                />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 8,
                    }}
                >
                    <Skeleton variant="rectangular" width={72} height={26} sx={{ borderRadius: 0.5 }} />
                    <Skeleton variant="text" width={160} height={26} />
                </div>
            )}

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    marginRight: -0.5,
                    "& .MuiIconButton-root:not(#alertsButton)": {
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
                <TripMenu />

                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
