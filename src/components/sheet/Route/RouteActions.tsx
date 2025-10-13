import { share } from "@/util/tools";
import { Event, Share } from "@mui/icons-material";
import { Box, ButtonBase } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default () => {
    const { t } = useTranslation(["Vehicle", "Shared"]);
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.4,
                margin: 1,
                "& .MuiButtonBase-root": {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                    padding: 2,
                    backgroundColor: "background.paper",
                    fontSize: 16,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                },
            }}
        >
            <ButtonBase
                onClick={() => navigate(window.location.pathname + "/brigades")}
                sx={{
                    borderRadius: 0.4,
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    flex: 1,
                }}
            >
                <Event fontSize="small" />
                {t("brigadeSchedule")}
            </ButtonBase>
            <ButtonBase
                onClick={() => share(window.location.href)}
                sx={{
                    borderRadius: 0.4,
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    width: "50%",
                    "@media (max-width: 385px)": {
                        "& span": {
                            display: "none",
                        },
                        width: 56,
                    },
                }}
            >
                <Share fontSize="small" />
                <span>{t("share", { ns: "Shared" })}</span>
            </ButtonBase>
        </Box>
    );
};
