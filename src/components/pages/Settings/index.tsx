import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { memo } from "react";
import { Menu } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import MarkerSettings from "./MarkerSettings";
import LanguageSettings from "./LanguageSettings";
import CitySettings from "./CitySettings";
import ThemeSettings from "./ThemeSettings";
import Helm from "@/util/Helm";
import BehaviorSettings from "./BehaviorSettings";
import SettingsBackup from "./SettingsBackup";
import SearchGroupsOrdering from "./SearchGroupsOrdering";

export default memo(() => {
    const { t } = useTranslation("Settings");
    const navigate = useNavigate();

    return (
        <>
            <Helm variable="settings" />

            <Dialog open fullScreen>
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <IconButton onClick={() => navigate(window.location.pathname, { state: "menu" })}>
                        <Menu />
                    </IconButton>
                    {t("settings")}
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                    }}
                >
                    <MarkerSettings />
                    <BehaviorSettings />
                    <LanguageSettings />
                    {JSON.parse(localStorage.getItem("jebaćdominika") || "false") &&
                        <>
                            <SearchGroupsOrdering />
                            <SettingsBackup />
                        </>
                    }
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            gap: 0.5,
                        }}
                    >
                        <CitySettings />
                        <ThemeSettings />
                    </Box>
                </DialogContent>
            </Dialog>

            <Outlet />
        </>
    );
});
