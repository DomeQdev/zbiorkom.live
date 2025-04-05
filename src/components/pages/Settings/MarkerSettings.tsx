import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useState } from "react";

export default memo(() => {
    const [brigade, setBrigade] = useState<boolean>(JSON.parse(localStorage.getItem("brigade") || "false"));
    const [fleet, setFleet] = useState<boolean>(JSON.parse(localStorage.getItem("fleet") || "false"));
    const { t } = useTranslation("Settings");

    const settings = [
        {
            key: "brigade",
            value: brigade,
            setValue: setBrigade,
        },
        {
            key: "fleet",
            value: fleet,
            setValue: setFleet,
        },
    ] as const;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 0.4,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: "background.paper",
                padding: 2,
            }}
        >
            <h2
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {t("vehicleMarker")}
            </h2>

            {settings.map(({ key, value, setValue }) => (
                <FormControlLabel
                    key={key}
                    control={
                        <Checkbox
                            checked={value}
                            onChange={() => {
                                setValue(!value);
                                localStorage.setItem(key, JSON.stringify(!value));
                            }}
                        />
                    }
                    label={t(key)}
                />
            ))}
        </Box>
    );
});
