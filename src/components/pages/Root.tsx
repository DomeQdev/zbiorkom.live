import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBack, Menu as IMenu } from "@mui/icons-material";
import { Fab } from "@mui/material";
import cities from "cities";
import useBackendStore from "@/hooks/useBackendStore";
import useGoBack from "@/hooks/useGoBack";
import Menu from "./Menu";
import WelcomeAlert from "./WelcomeAlert";
import { useEffect } from "react";

export default () => {
    const { pathname, state } = useLocation();
    const navigate = useNavigate();
    const { city } = useParams();
    const goBack = useGoBack();
    const ready = useBackendStore((state) => state.status === "ready");

    const showBackButton = !!pathname.split("/")[3];

    useEffect(() => {
        if (!ready) return;

        if (!city || !cities[city]) {
            navigate("/cities");
            return;
        }
    }, [city, ready]);

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

            <Menu
                open={state === "menu"}
                setOpen={() => navigate(window.location.pathname, { state: "menu" })}
                setClose={() => goBack({ ignoreState: true })}
            />

            <WelcomeAlert />

            <Outlet />
        </>
    );
};
