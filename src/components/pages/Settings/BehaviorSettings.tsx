import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useState } from "react";

export default memo(() => {
    const { t } = useTranslation("Settings");

    const [moveToLastLocation, setMove] = useState<boolean>(
        JSON.parse(localStorage.getItem("moveToLastLocation") || "false"),
    );
    const [useLocationSorting, setSorting] = useState<boolean>(
        JSON.parse(localStorage.getItem("useLocationSorting") || "false"),
    );
    const [useStopCodeAsIcon, setStopCodeAsIcon] = useState<boolean>(
        JSON.parse(localStorage.getItem("useStopCodeAsIcon") || "false"),
    );
    const [disableLiquidGlass, setDisableLiquidGlass] = useState<boolean>(
        JSON.parse(localStorage.getItem("disableLiquidGlass") || "false"),
    );

    const settings = [
        {
            key: "moveToLastLocation",
            value: moveToLastLocation,
            setValue: setMove,
        },
        {
            key: "useLocationSorting",
            value: useLocationSorting,
            setValue: setSorting,
        },
        {
            key: "useStopCodeAsIcon",
            value: useStopCodeAsIcon,
            setValue: setStopCodeAsIcon,
        },
        {
            key: "disableLiquidGlass",
            value: disableLiquidGlass,
            setValue: setDisableLiquidGlass,
            action: (value: boolean) => {
                document.body.classList.toggle("disable-liquid-glass", value);
            },
        },
    ] as {
        key: string;
        value: boolean;
        setValue: (value: boolean) => void;
        action?: (value: boolean) => void;
    }[];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 0.4,
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
                {t("behavior")}
            </h2>

            {settings.map(({ key, value, setValue, action }) => (
                <FormControlLabel
                    key={key}
                    control={
                        <Checkbox
                            checked={value}
                            onChange={() => {
                                setValue(!value);
                                localStorage.setItem(key, JSON.stringify(!value));
                                action?.(!value);
                            }}
                        />
                    }
                    label={t(key)}
                />
            ))}
        </Box>
    );
});
