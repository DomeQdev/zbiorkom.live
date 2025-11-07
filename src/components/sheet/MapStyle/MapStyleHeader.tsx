import useGoBack from "@/hooks/useGoBack";
import { Close, Layers } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation("Layers");
    const goBack = useGoBack();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -1,
            }}
        >
            <Typography
                variant="h6"
                component="div"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: 16,
                    gap: 0.8,
                }}
            >
                <Layers
                    sx={{
                        backgroundColor: "background.paper",
                        color: "primary.contrastText",
                        borderRadius: 0.5,
                        padding: 0.5,
                        width: 30,
                        height: 30,
                    }}
                />
                {t("layers")}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    marginRight: -0.5,
                    "& .MuiIconButton-root": {
                        backgroundColor: "background.paper",
                        color: "hsla(0, 0%, 100%, 0.87)",
                        width: 35,
                        height: 35,
                        "& svg": {
                            width: 22,
                            height: 22,
                        },
                        "& :focus": {
                            backgroundColor: "background.paper",
                        },
                    },
                }}
            >
                <IconButton size="small" onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </Box>
        </Box>
    );
};
