import { Alert } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default () => {
    const [showAlert, setShowAlert] = useState<boolean>(!localStorage.getItem("hideMultilineAlert"));
    const { t } = useTranslation("Brigades");

    if (!showAlert) return null;

    return (
        <Alert
            severity="warning"
            onClose={() => {
                localStorage.setItem("hideMultilineAlert", "true");
                setShowAlert(false);
            }}
            sx={{
                marginBottom: 1.5,
            }}
        >
            {t("multilineAlert")}
        </Alert>
    );
};
