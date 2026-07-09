import { useParams } from "react-router-dom";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import { Box, IconButton } from "@mui/material";
import { AllInclusive, Close, ImportExport } from "@mui/icons-material";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";

export default () => {
    const [direction, setDirection] = useDirectionStore(
        useShallow((state) => [state.direction, state.setDirection]),
    );

    const { city, route } = useParams();
    const { data } = useQueryRouteGraph({
        city: city!,
        route: route!,
    });

    const currentDirection = data?.graph[direction];

    if (!data || !currentDirection) return null;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -1,
            }}
        >
            <VehicleHeadsign route={data.route} headsign={currentDirection.headsign} />

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
                    sx={{
                        transform: `rotate(${direction === 0 ? 0 : 180}deg)`,
                        transition: "transform 0.3s",
                    }}
                    onClick={() => setDirection((direction + 1) % data.graph.length)}
                    disabled={data.graph.length === 1}
                >
                    {data.graph.length === 1 ? <AllInclusive /> : <ImportExport />}
                </IconButton>

                <IconButton size="small" onClick={() => window.history.back()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
