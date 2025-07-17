import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { ArrowBack, DarkModeOutlined, Menu as IMenu, Sunny } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import cities from "cities";
import useGoBack from "@/hooks/useGoBack";
import Menu from "./Menu";
import WelcomeAlert from "./WelcomeAlert";

export default () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("dark") === "true");
    const [socket, setSocket] = useState<Socket>();
    const { pathname, state } = useLocation();
    const navigate = useNavigate();
    const { city } = useParams();
    const goBack = useGoBack();

    const showBackButton = !!pathname.split("/")[3];

    useEffect(() => {
        if (!city || !cities[city]) {
            navigate("/cities");
            return;
        }

        const socket = io(Gay.ws, {
            query: {
                city,
            },
            transports: ["websocket"],
            upgrade: false,
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
            setSocket(undefined);
        };
    }, [city]);

    return (
        <>
            <Fab
                sx={{ position: "absolute", left: 16, top: 16 }}
                color="primary"
                size="small"
                onClick={() => {
                    if (showBackButton) {
                        goBack({ ignoreState: true });
                    } else {
                        navigate(window.location.pathname, { state: "menu" });
                    }
                }}
            >
                {showBackButton ? <ArrowBack /> : <IMenu />}
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

            <Menu
                open={state === "menu"}
                setOpen={() => navigate(window.location.pathname, { state: "menu" })}
                setClose={() => goBack({ ignoreState: true })}
            />

            <WelcomeAlert />

            <Outlet context={socket} />
        </>
    );
};
