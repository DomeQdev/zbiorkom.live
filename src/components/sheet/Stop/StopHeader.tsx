import { Box, IconButton, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { AccessTime, Close, Star, StarOutline } from "@mui/icons-material";
import useGoBack from "@/hooks/useGoBack";
import StopTag from "@/ui/StopTag";
import { EStop, EStopDepartures } from "typings";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";
import { getCityFromUrl } from "@/util/tools";
import useFavStore from "@/hooks/useFavStore";
import { useShallow } from "zustand/react/shallow";

export default () => {
    const { city, stop } = useParams();
    const navigate = useNavigate();
    const goBack = useGoBack();

    const { data } = useQueryStopDepartures({
        city: getCityFromUrl(city),
        stop: stop!,
    });

    const [isFavorite, toggleFavoriteStop] = useFavStore(
        useShallow((state) => [state.favorites.some((fav) => fav.id === stop), state.toggleFavoriteStop]),
    );

    if (!data?.[EStopDepartures.stop])
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
            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}>
                <StopTag stop={data[EStopDepartures.stop]} />
            </Box>

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
                <IconButton
                    size="small"
                    onClick={() => {
                        const stopInfo = data[EStopDepartures.stop];
                        toggleFavoriteStop(
                            stopInfo[EStop.id],
                            stopInfo[EStop.location],
                            stopInfo[EStop.city] === "pkp",
                        );
                    }}
                >
                    {isFavorite ? <Star sx={{ color: "#FFD700" }} /> : <StarOutline />}
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => navigate(window.location.pathname + "/time" + window.location.search)}
                >
                    <AccessTime />
                </IconButton>

                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
