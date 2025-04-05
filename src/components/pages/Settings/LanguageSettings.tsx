import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

export default () => {
    const { t, i18n } = useTranslation(["Settings", "Languages"]);

    const languages = i18n.options.resources ? Object.keys(i18n.options.resources) : [];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 0.4,
                padding: 2,
                backgroundColor: "background.paper",
            }}
            id="languageSettings"
        >
            <h2>{t("language")}</h2>

            <RadioGroup
                value={i18n.language}
                onChange={(event) => {
                    i18n.changeLanguage(event.target.value);
                    localStorage.setItem("language", event.target.value);
                }}
            >
                {languages.map((language) => (
                    <FormControlLabel
                        key={language}
                        value={language}
                        control={<Radio />}
                        label={t(language, { ns: "Languages" })}
                    />
                ))}
            </RadioGroup>
        </Box>
    );
};
