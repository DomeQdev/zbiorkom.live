import { Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
import { CloudOff, ErrorOutline, Refresh, WifiOff } from "@mui/icons-material";
import { BackendErrorKind } from "cities";
import { useTranslation } from "react-i18next";
import useBackendStore from "@/hooks/useBackendStore";

const errorIcons = {
    network: WifiOff,
    server: CloudOff,
    unknown: ErrorOutline,
} satisfies Record<BackendErrorKind, typeof WifiOff>;

export default () => {
    const { t } = useTranslation("Backend");
    const status = useBackendStore((state) => state.status);
    const errorKind = useBackendStore((state) => state.errorKind);
    const load = useBackendStore((state) => state.load);

    // a failed load leaves the store on "error"; a retry flips it to "loading" and keeps the dialog up
    if (status === "ready") return null;

    const Icon = errorIcons[errorKind];
    const loading = status === "loading";

    return (
        <Dialog
            open
            maxWidth="xs"
            fullWidth
            disableEscapeKeyDown
            sx={{
                zIndex: 5002,
                "& .MuiDialog-paper": {
                    margin: 2,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 1,
                    padding: 3,
                }}
            >
                <Icon
                    sx={{
                        color: "primary.contrastText",
                        backgroundColor: "primary.main",
                        padding: 2,
                        marginBottom: 1,
                        borderRadius: 2,
                        width: 64,
                        height: 64,
                    }}
                />

                <Typography variant="h6">{t(`error.${errorKind}.title`)}</Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {t(`error.${errorKind}.message`)}
                </Typography>

                <Button
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
                    onClick={() => load()}
                    sx={{
                        marginTop: 2,
                        color: "primary.main",
                        backgroundColor: "primary.contrastText",
                        "&:hover": {
                            backgroundColor: "primary.contrastText",
                        },
                    }}
                >
                    {t("error.retry")}
                </Button>
            </Box>
        </Dialog>
    );
};
