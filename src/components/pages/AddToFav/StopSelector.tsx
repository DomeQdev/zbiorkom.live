import { Add } from "@mui/icons-material";
import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EStop, Stop } from "typings";
import StopTag from "@/ui/StopTag";

type Props = {
    destinations?: Stop[];
    onAdd: (destination: Stop) => void;
};

export default ({ destinations, onAdd }: Props) => {
    const [value, setValue] = useState<Stop | null>(null);
    const [inputValue, setInputValue] = useState("");
    const { t } = useTranslation("Favorites");

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                "& .MuiAutocomplete-root": {
                    flex: 1,
                },
                "& .MuiTextField-root": {
                    flex: 1,
                },
            }}
        >
            <Autocomplete<Stop, false, false, false>
                value={value}
                onChange={(e, newValue) => setValue(newValue)}
                inputValue={inputValue}
                onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
                options={destinations || []}
                getOptionLabel={(option) =>
                    option ? `${option[EStop.name]} ${option[EStop.code] || ""}`.trim() : ""
                }
                isOptionEqualToValue={(option, value) =>
                    option[EStop.city] === value[EStop.city] && option[EStop.id] === value[EStop.id]
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={t("selectDirection")}
                        size="small"
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 1,
                            },
                        }}
                    />
                )}
                renderOption={(props, option) => {
                    if (!option) return null;

                    return (
                        <li {...props} key={`${option[EStop.city]}:${option[EStop.id]}`}>
                            <StopTag stop={option} fontSize={14} />
                        </li>
                    );
                }}
            />
            <IconButton
                onClick={() => {
                    if (!value) return;

                    onAdd(value);
                    setValue(null);
                    setInputValue("");
                }}
                disabled={!value}
                sx={{
                    backgroundColor: "background.paper",
                    color: "hsla(0, 0%, 100%, 0.87)",
                    transition: "background-color 0.2s, color 0.2s",
                }}
            >
                <Add />
            </IconButton>
        </Box>
    );
};
