import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useState } from "react";

export default memo(() => {
    const { t } = useTranslation("Settings");

    const [moveToLastLocation, setMove] = useState<boolean>(
        JSON.parse(localStorage.getItem("moveToLastLocation") || "false")
    );
    const [useLocationSorting, setSorting] = useState<boolean>(
        JSON.parse(localStorage.getItem("useLocationSorting") || "false")
    );
    const [useStopCodeAsIcon, setStopCodeAsIcon] = useState<boolean>(
        JSON.parse(localStorage.getItem("useStopCodeAsIcon") || "false")
    );
    const [showScheduledTimes, setShowScheduledTimes] = useState<boolean>(
        JSON.parse(localStorage.getItem("showScheduledTimes") || "true")
    );
    const [mergeArrivalDeparture, setMergeArrivalDeparture] = useState<boolean>(
        JSON.parse(localStorage.getItem("mergeArrivalDeparture") || "true")
    );
    const [showSeconds, setShowSeconds] = useState<boolean>(
        JSON.parse(localStorage.getItem("showSeconds") || "false")
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
            key: "showScheduledTimes",
            value: showScheduledTimes,
            setValue: setShowScheduledTimes,
        },
        {
            key: "mergeArrivalDeparture",
            value: mergeArrivalDeparture,
            setValue: setMergeArrivalDeparture,
        },
        {
            key: "showSeconds",
            value: showSeconds,
            setValue: setShowSeconds,
        },
    ] as const;

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
