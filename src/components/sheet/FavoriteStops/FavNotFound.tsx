import useFavStore from "@/hooks/useFavStore";
import { Delete } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FavoriteStop } from "typings";

export default ({ index, stop }: { index: number; stop: FavoriteStop }) => {
    const removeFavoriteStop = useFavStore((state) => state.removeFavoriteStop);
    const { t } = useTranslation("Schedules");

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingX: 2,
                paddingY: 1,
                borderTop: index !== 0 ? "1px solid var(--mui-palette-divider)" : undefined,
            }}
        >
            <IconButton size="small" onClick={() => removeFavoriteStop(stop.id)}>
                <Delete />
            </IconButton>

            <span>{t("stopNotServed", { stop: stop.id })}</span>
        </Box>
    );
};
