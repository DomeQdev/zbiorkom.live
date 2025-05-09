import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DirectionsOutlined, Search, StarOutline } from "@mui/icons-material";
import Markers from "@/map/Markers";
import { Fab } from "@mui/material";
import Helm from "@/util/Helm";

export default () => {
    const navigate = useNavigate();
    const { city } = useParams();

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
                color="primary"
                sx={{ position: "absolute", right: 16, top: 16 * 10, opacity: 0 }}
                size="small"
                onClick={() => navigate(`/${city}/directions`)}
            >
                <DirectionsOutlined />
            </Fab>

            <Markers city={city!} />

            <Outlet />
        </>
    );
};
