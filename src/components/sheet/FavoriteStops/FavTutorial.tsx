import { Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation("Favorites");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(var(--rsbs-overlay-h) - 120px)",
            }}
        >
            <Star
                sx={{
                    color: "primary.contrastText",
                    backgroundColor: "primary.main",
                    padding: 2,
                    margin: 1,
                    borderRadius: 2,
                    width: 64,
                    height: 64,
                }}
            />
            <Typography variant="h6">{t("addStopsHere")}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {t("howToAddStopsHere")}
            </Typography>
        </Box>
    );
};
