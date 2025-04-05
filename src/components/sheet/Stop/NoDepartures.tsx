import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation("Schedules");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
                height: "calc(var(--rsbs-overlay-h) - 66px)",
            }}
        >
            <b>{t("noDepartures")}</b>
        </Box>
    );
};
