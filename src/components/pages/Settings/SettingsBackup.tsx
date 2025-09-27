import { Save, FileOpen, Restore } from "@mui/icons-material";
import { Box, ButtonBase } from "@mui/material";
import { useTranslation } from "react-i18next";


export default () => {
    const { t } = useTranslation(["Settings", "Languages"]);

    const exportSettings = () => {
        const settings: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            settings[key] = localStorage.getItem(key)!;
        }

        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "zbiorkom.live.json";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const importSettings = (): void => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = async (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data: Record<string, string> = JSON.parse(text);
                localStorage.clear();
                for (const [key, value] of Object.entries(data)) {
                    localStorage.setItem(key, value);
                }
                location.reload();
            } catch (err) {
                console.error("Failed to import settings:", err);
            }
        };
        input.click();
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderTopLeftRadiusRadius: 0.4,
                    borderTopRightRadiusRadius: 0.4,
                    backgroundColor: "background.paper",
                    padding: 2,
                }}
            >
                <h2>{t("settingsBackup")}</h2>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    gap: 0.5,
                }}
            >
                <ButtonBase
                    onClick={() => importSettings()}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        // borderBottomLeftRadius: 16,
                        padding: 2,
                        backgroundColor: "background.paper",
                        width: "50%",
                        fontSize: 18,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        "@media (max-width: 380px)": {
                            "& svg": {
                                display: "none",
                            },
                        },
                    }}
                >
                    <FileOpen />
                    {t("importSettingsBackup")}
                </ButtonBase>
                <ButtonBase
                    onClick={() => exportSettings()}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        padding: 2,
                        backgroundColor: "background.paper",
                        width: "50%",
                        fontSize: 18,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        "@media (max-width: 380px)": {
                            "& svg": {
                                display: "none",
                            },
                        },
                    }}
                >
                    <Save />
                    {t("exportSettingsBackup")}
                </ButtonBase>
                <ButtonBase
                    onClick={() => {localStorage.clear(); location.reload()}}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        // borderBottomRightRadius: 16,
                        padding: 2,
                        backgroundColor: "background.paper",
                        width: "50%",
                        fontSize: 18,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        "@media (max-width: 380px)": {
                            "& svg": {
                                display: "none",
                            },
                        },
                    }}
                >
                    <Restore />
                    {t("clearSettings")}
                </ButtonBase>
            </Box>
        </Box>
    );
};
