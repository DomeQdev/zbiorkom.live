import { useNavigate, useParams } from "react-router-dom";
import { Box, IconButton, Skeleton } from "@mui/material";
import useQueryTrip from "@/hooks/useQueryTrip";
import VehicleHeadsign from "@/sheet/Vehicle/VehicleHeadsign";
import { Close, PriorityHigh, Report } from "@mui/icons-material";
import useGoBack from "@/hooks/useGoBack";
import useQueryTripUpdate from "@/hooks/useQueryTripUpdate";
import { EStopUpdate, ETrip } from "typings";

export default () => {
    const { city, trip } = useParams();
    const navigate = useNavigate();
    const goBack = useGoBack();

    const cityId = window.location.search.includes("pkp") ? "pkp" : city!;

    const { data: tripData } = useQueryTrip({
        city: cityId,
        trip: trip!,
    });

    const { data: tripUpdate } = useQueryTripUpdate({
        city: cityId,
        trip: trip!,
    });

    if (!tripData?.trip)
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
                route={tripData.trip[ETrip.route]}
                shortName={tripData.trip[ETrip.shortName]}
                headsign={tripData.trip[ETrip.headsign]}
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
                {tripUpdate?.stops?.some((stop) => stop[EStopUpdate.alerts]?.length > 0) && (
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
                        onClick={() => navigate(`/${city}/trip/${trip}/alerts?pkp`)}
                    >
                        <Report />
                    </IconButton>
                )}

                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
