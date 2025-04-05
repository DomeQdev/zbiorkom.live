import { Box, IconButton, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Close, StarOutline } from "@mui/icons-material";
import useGoBack from "@/hooks/useGoBack";
import useQueryStop from "@/hooks/useQueryStop";
import StopTag from "@/ui/StopTag";
import { EStopDepartures } from "typings";

export default () => {
    const { city, stop } = useParams();
    const navigate = useNavigate();
    const goBack = useGoBack();

    const { data } = useQueryStop({ city: city!, stop: stop! });

    if (!data)
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
                <IconButton size="small" onClick={() => navigate(window.location.pathname + "/addToFav")}>
                    <StarOutline />
                </IconButton>

                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
