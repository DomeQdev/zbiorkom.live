import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Search, StarOutline } from "@mui/icons-material";
import { Socket } from "socket.io-client";
import Markers from "@/map/Markers";
import { Fab } from "@mui/material";
import Helm from "@/util/Helm";

export default () => {
    const socket = useOutletContext<Socket>();
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

            <Markers city={city!} />

            <Outlet />
        </>
    );
};
