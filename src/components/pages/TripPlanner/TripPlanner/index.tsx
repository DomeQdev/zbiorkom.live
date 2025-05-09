import { ArrowBack } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default () => {
    const { t } = useTranslation("TripPlanner");
    const navigate = useNavigate();
    const { city } = useParams();

    return (
        <>
            <Dialog
                open
                onClose={() => navigate(`/${city}`)}
                fullWidth={window.innerWidth > 600}
                fullScreen={window.innerWidth <= 600}
                sx={(theme) => ({
                    "& .MuiDialog-paper": {
                        [theme.breakpoints.up("sm")]: {
                            height: "70%",
                        },
                    },
                })}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <IconButton onClick={() => navigate(`/${city}`)}>
                        <ArrowBack />
                    </IconButton>
                    {/* {t("executions")} */}
                    *nadal tu pracujemy*
                </DialogTitle>
            </Dialog>
        </>
    );
};
