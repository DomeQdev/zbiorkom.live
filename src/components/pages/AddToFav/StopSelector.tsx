import { Add } from "@mui/icons-material";
import { Autocomplete, Box, IconButton, ListItemText, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StopDirection } from "typings";

type Props = {
    directions?: StopDirection[];
    onAdd: (direction: StopDirection) => void;
};

export default ({ directions, onAdd }: Props) => {
    const [value, setValue] = useState<StopDirection | null>(null);
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
            <Autocomplete
                value={value}
                onChange={(e, newValue) => setValue(newValue)}
                inputValue={inputValue}
                onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
                options={directions || []}
                getOptionLabel={(option) => (option ? `${option[1]} ${option[2] || ""}`.trim() : "")}
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
                        <li {...props} key={option[0]}>
                            <ListItemText
                                primary={
                                    <>
                                        {option[1]} {!!option[2] && <b>{option[2]}</b>}
                                    </>
                                }
                                secondary={
                                    (option[3] === null ? t("terminus") : "") +
                                    (option[3] ? `» ${option[3]}` : "") +
                                    (option[4] ? `, ${option[4]}` : "")
                                }
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            />
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
