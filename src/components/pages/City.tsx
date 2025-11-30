import { Outlet, useNavigate, useParams } from "react-router-dom";
import { AcUnit, DirectionsOutlined, LayersOutlined, Search, StarOutline } from "@mui/icons-material";
import Markers from "@/map/Markers";
import { Badge, Fab } from "@mui/material";
import Helm from "@/util/Helm";
import { useQueryChristmasVehicles } from "@/hooks/useChristmasVehicles";

export default () => {
    const navigate = useNavigate();
    const { city } = useParams();

    // Prefetch świątecznych pojazdów przy uruchomieniu miasta
    const { data: christmasVehicles } = useQueryChristmasVehicles(city!);
    const hasChristmasVehicles = christmasVehicles && christmasVehicles.length > 0;

    return (
        <>
            <Helm variable="city" />

            <Fab
                color="primary"
                sx={{ position: "absolute", right: 16, top: 16 }}
                size="small"
                onClick={() => navigate(`/${city}/search`)}
            >
                <Search />
            </Fab>

            <Fab
                color="primary"
                sx={{ position: "absolute", right: 16, top: 16 * 7 }}
                size="small"
                onClick={() => navigate(`/${city}/favoriteStops`)}
            >
                <StarOutline />
            </Fab>

            <Fab
                sx={{ position: "absolute", right: 16, top: 16 * 10 }}
                color="primary"
                size="small"
                onClick={() => navigate(`/${city}/layers`)}
            >
                <LayersOutlined />
            </Fab>

            {/* <Fab
                color="primary"
                sx={{ position: "absolute", right: 16, top: 16 * 13, opacity: 0 }}
                size="small"
                onClick={() => navigate(`/${city}/directions`)}
            >
                <DirectionsOutlined />
            </Fab> */}

            {hasChristmasVehicles && (
                <Badge
                    badgeContent="🎄"
                    sx={{
                        position: "absolute",
                        right: 16,
                        top: 16 * 13,
                        "& .MuiBadge-badge": {
                            fontSize: 10,
                            minWidth: 16,
                            height: 16,
                            padding: 0,
                            top: 4,
                            right: 4,
                        },
                    }}
                >
                    <Fab
                        size="small"
                        onClick={() => navigate(`/${city}/swiateczne`)}
                        sx={{
                            background: "linear-gradient(135deg, #c41e3a 0%, #165b33 100%)",
                            color: "white",
                            "&:hover": {
                                background: "linear-gradient(135deg, #a01830 0%, #0d3320 100%)",
                            },
                        }}
                    >
                        <AcUnit />
                    </Fab>
                </Badge>
            )}

            <Markers city={city!} />

            <Outlet />
        </>
    );
};
