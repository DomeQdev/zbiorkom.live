import { useNavigate, useParams } from "react-router-dom";
import { Box, IconButton, Skeleton } from "@mui/material";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import { Close, Report } from "@mui/icons-material";
import useGoBack from "@/hooks/useGoBack";
import { EStopUpdate, ETrip } from "typings";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import TripMenu from "./TripMenu";

export default () => {
    const [trip, stops] = useVehicleStore(useShallow((state) => [state.trip, state.stops]));
    const navigate = useNavigate();
    const params = useParams();
    const goBack = useGoBack();

    if (!trip)
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                }}
            >
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 0.5 }} />
                <Skeleton variant="text" width={160} height={32} />
            </div>
        );

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
                route={trip[ETrip.route]}
                shortName={trip[ETrip.shortName]}
                headsign={trip[ETrip.headsign]}
            />

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
                {stops?.some((stop) => stop[EStopUpdate.alerts]?.length > 0) && (
                    <IconButton
                        id="alertsButton"
                        size="small"
                        sx={{
                            backgroundColor: "error.main",
                            color: "error.contrastText",
                            "&:hover": {
                                backgroundColor: "error.dark",
                            },
                        }}
                        onClick={() => navigate(`/${params.city}/trip/${params.trip}/alerts?pkp`)}
                    >
                        <Report />
                    </IconButton>
                )}

                <TripMenu />

                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
