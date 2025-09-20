import { LocationCity } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ButtonBase } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default () => {
    const { t } = useTranslation("Settings");
    const navigate = useNavigate();

    return (
        <ButtonBase
            onClick={() => navigate("/cities")}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                borderRadius: 0.4,
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
            <LocationCity />
            {t("changeCity")}
        </ButtonBase>
    );
};
