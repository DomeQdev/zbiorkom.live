import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DarkModeOutlined, DirectionsOutlined, Search, StarOutline, Sunny } from "@mui/icons-material";
import Markers from "@/map/Markers";
import { Fab } from "@mui/material";
import Helm from "@/util/Helm";
import { useState } from "react";

export default () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("dark") === "true");
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
                sx={{ position: "absolute", right: 16, top: 16 * 13, opacity: 0 }}
                size="small"
                onClick={() => navigate(`/${city}/directions`)}
            >
                <DirectionsOutlined />
            </Fab>

            <Fab
                sx={{ position: "absolute", right: 16, top: 16 * 10 }}
                color="primary"
                size="small"
                onClick={() => {
                    localStorage.setItem("dark", (!darkMode).toString());
                    document.body.classList.toggle("dark", !darkMode);
                    setDarkMode(!darkMode);
                }}
            >
                {darkMode ? <DarkModeOutlined /> : <Sunny />}
            </Fab>

            <Markers city={city!} />

            <Outlet />
        </>
    );
};
