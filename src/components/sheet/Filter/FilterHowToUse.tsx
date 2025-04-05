import Collapse from "@/ui/Collapse";
import { Help } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default () => {
    const { t } = useTranslation("Filter");

    return (
        <Collapse icon={<Help />} title={t("howToUseTitle")} sx={{ margin: 2 }}>
            <Typography>{t("howToUseContent")}</Typography>
        </Collapse>
    );
};
