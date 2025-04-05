import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import useGoBack from "@/hooks/useGoBack";
import { useTranslation } from "react-i18next";

type Props = {
    value: number; // timestamp
    onChange: (value: number) => void;
};

type TimeFieldProps = {
    type: "hours" | "minutes";
    value: string;
    setValue: (value: string) => void;
    prevValue: string;
    setPrevValue: (value: string) => void;
    save: () => void;
};

const TimeField = ({ type, value, setValue, prevValue, setPrevValue, save }: TimeFieldProps) => {
    const { t } = useTranslation("Time");

    const handleBlur = (val: string) => {
        if (val === "") {
            setValue(prevValue);
        } else {
            const formattedValue = val.padStart(2, "0");
            setValue(formattedValue);
            setPrevValue(formattedValue);
        }
    };

    return (
        <TextField
            id={`field${type}`}
            type="number"
            value={value}
            onChange={(e) => {
                const value = e.target.value;

                if (!value) return setValue("");

                if (type === "hours" && (value.length === 2 || !["0", "1", "2"].includes(value))) {
                    handleBlur(value);
                    document.getElementById("fieldminutes")?.focus();
                } else if (type === "minutes" && !["0", "1", "2", "3", "4", "5"].includes(value)) {
                    handleBlur(value);
                    document.getElementById("fieldminutes")?.blur();
                } else {
                    setValue(value);
                }
            }}
            onKeyDown={(e) => {
                if (e.key === "Backspace" && value === "" && type === "minutes") {
                    document.getElementById("fieldhours")?.focus();
                    setValue("00");
                    setPrevValue("00");
                }
            }}
            onFocus={() => setValue("")}
            onBlur={(e) => handleBlur(e.target.value)}
            onWheel={(e: any) => e.target.blur()}
            autoComplete="off"
            slotProps={{
                htmlInput: {
                    min: 0,
                    max: type === "hours" ? 23 : 59,
                    step: 1,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                },
            }}
            helperText={t(type === "hours" ? "hour" : "minute")}
            sx={{
                width: 72,
                height: 72,
                "& .MuiInputBase-root": {
                    borderRadius: 1,
                    "& input": {
                        padding: 1,
                        textAlign: "center",
                        fontSize: 24,
                    },
                },
                "& .MuiFormHelperText-root": {
                    marginLeft: 0.5,
                },
            }}
        />
    );
};

export default ({ value, onChange }: Props) => {
    const date = new Date(value);

    const [hours, setHours] = useState<string>(String(date.getHours()).padStart(2, "0"));
    const [minutes, setMinutes] = useState<string>(String(date.getMinutes()).padStart(2, "0"));
    const [prevHoursString, setPrevHoursString] = useState<string>(hours);
    const [prevMinutesString, setPrevMinutesString] = useState<string>(minutes);

    const { t } = useTranslation("Time");
    const goBack = useGoBack();

    const parsedHours = parseInt(hours);
    const parsedMinutes = parseInt(minutes);

    const nextHour = parsedHours + 1;
    const previousHour = parsedHours - 1;

    const displaySuggestions = navigator.userAgent.includes("Android");

    const save = () => {
        onChange(new Date(date).setHours(parsedHours, parseInt(minutes) || 0));
        goBack();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                save();
            } else if (e.key.match(/[0-9]/) && !document.activeElement?.id.includes("field")) {
                document.getElementById("fieldhours")?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [hours, minutes]);

    return (
        <Dialog open fullWidth onClose={() => goBack()}>
            <DialogTitle sx={{ paddingLeft: 3, paddingTop: 2 }}>{t("enterTime")}</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    padding: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        "& span": {
                            fontSize: 26,
                            fontWeight: "bold",
                            marginTop: -2.5,
                        },
                    }}
                >
                    <TimeField
                        type="hours"
                        value={hours}
                        setValue={setHours}
                        prevValue={prevHoursString}
                        setPrevValue={setPrevHoursString}
                        save={save}
                    />
                    <span>:</span>
                    <TimeField
                        type="minutes"
                        value={minutes}
                        setValue={setMinutes}
                        prevValue={prevMinutesString}
                        setPrevValue={setPrevMinutesString}
                        save={save}
                    />
                </Box>

                {displaySuggestions && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                            padding: 0.5,
                            whiteSpace: "nowrap",
                            overflow: "auto",
                            maxWidth: "100%",
                            "& .MuiButton-root": {
                                backgroundColor: "background.paper",
                                color: "text.primary",
                                transition: "opacity 0.2s",
                                "&:hover": {
                                    backgroundColor: "background.paper",
                                },
                                "&:disabled": {
                                    backgroundColor: "background.paper",
                                    opacity: 0.7,
                                },
                            },
                        }}
                    >
                        {[
                            {
                                text: "-15 min",
                                onClick: () => {
                                    const newMinutes = parsedMinutes - 15;
                                    
                                    if (newMinutes < 0) {
                                        const newHours = parsedHours - 1;
                                        setHours(String(newHours).padStart(2, "0"));
                                        setPrevHoursString(String(newHours).padStart(2, "0"));
                                        setMinutes(String(60 + newMinutes).padStart(2, "0"));
                                        setPrevMinutesString(String(60 + newMinutes).padStart(2, "0"));
                                    } else {
                                        setMinutes(String(newMinutes).padStart(2, "0"));
                                        setPrevMinutesString(String(newMinutes).padStart(2, "0"));
                                    }
                                },
                                disabled: () => parsedHours === 0 && parsedMinutes <= 15,
                            },
                            {
                                text: "- 1h",
                                onClick: () => {
                                    setHours(String(previousHour).padStart(2, "0"));
                                    setPrevHoursString(String(previousHour).padStart(2, "0"));
                                },
                                disabled: () => previousHour === -1,
                            },
                            {
                                text: "+ 1h",
                                onClick: () => {
                                    setHours(String(nextHour).padStart(2, "0"));
                                    setPrevHoursString(String(nextHour).padStart(2, "0"));
                                },
                                disabled: () => nextHour === 30,
                            },
                            ...["07", "15", "20"].map((hour) => ({
                                text: `${hour}:00`,
                                onClick: () => {
                                    setHours(hour);
                                    setPrevHoursString(hour);
                                    setMinutes("00");
                                    setPrevMinutesString("00");
                                },
                                disabled: () => hours === hour,
                            })),
                            {
                                text: "🌙",
                                onClick: () => {
                                    setHours("24");
                                    setPrevHoursString("24");
                                    setMinutes("00");
                                    setPrevMinutesString("00");
                                },
                                disabled: () => hours === "24" && minutes === "00",
                            },
                        ].map((action) => (
                            <Button
                                key={action.text}
                                variant="contained"
                                onClick={action.onClick}
                                disabled={action.disabled()}
                            >
                                {action.text}
                            </Button>
                        ))}
                    </Box>
                )}
                {parsedHours >= 24 && (
                    <Typography
                        sx={{ color: "text.disabled", fontSize: 12, textAlign: "center", padding: 0 }}
                    >
                        {t("nextDay", {
                            time: `${String(parsedHours % 24).padStart(2, "0")}:${minutes.padStart(2, "0")}`,
                        })}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ paddingRight: 3, paddingBottom: 2 }}>
                <Button onClick={() => goBack()}>{t("cancel")}</Button>
                <Button onClick={save}>{t("save")}</Button>
            </DialogActions>
        </Dialog>
    );
};
