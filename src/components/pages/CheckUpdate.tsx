import { Update } from "@mui/icons-material";
import { Box, LinearProgress, ListItemText, Slide, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default () => {
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
    const { t } = useTranslation("Updates");

    useEffect(() => {
        if (window.location.hostname !== "localhost" && "serviceWorker" in navigator) {
            let refreshing = false;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });

            navigator.serviceWorker.register("/service-worker.js").then((registration) => {
                const isUpdate = Boolean(registration.active);

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (!installingWorker) return;

                    if (isUpdate) {
                        setLoadingUpdate(true);
                    }

                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === "installed") {
                            if (isUpdate) {
                                registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                            }
                        }
                    };
                };
            });
        }
    }, []);

    return (
        <Slide direction="down" in={loadingUpdate} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999999,
                    margin: "24px auto",
                    borderRadius: 1,
                    backgroundColor: "background.paper",
                    color: "hsla(0, 0%, 100%, 0.9)",
                    width: "max-content",
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                    padding: 1.5,
                }}
            >
                <Update
                    sx={{
                        backgroundColor: "primary.contrastText",
                        color: "primary.main",
                        fontSize: 40,
                        borderRadius: 1,
                        padding: 0.5,
                    }}
                />
                <ListItemText
                    primary={t("downloadingUpdate")}
                    secondary={<LinearProgress sx={{ width: "100%", mt: 0.5 }} />}
                />
            </Box>
        </Slide>
    );
};
