import { Autocomplete, Box, TextField } from "@mui/material";
import { DirectionsPlace } from "..";
import { Place, SportsScore } from "@mui/icons-material";
import { useQueryGeocode } from "@/hooks/useQueryTripPlanner";
import { useState } from "react";

type Props = {
    type: "start" | "end";
    place: [DirectionsPlace, (setPlace: DirectionsPlace) => void];
};

export default ({ type, place: [place, setPlace] }: Props) => {
    const { data: places, isLoading } = useQueryGeocode(place.text);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                margin: 1,
            }}
        >
            {type === "start" ? <Place /> : <SportsScore />}

            <Autocomplete
                size="small"
                fullWidth
                options={places || []}
                getOptionLabel={(option) => option.name}
                inputValue={place.text}
                onInputChange={(_, text) => setPlace({ ...place, text })}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                loading={isLoading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={type === "start" ? "Start" : "End"}
                        slotProps={{
                            input: {
                                autoCapitalize: "none",
                                autoComplete: "off",
                                autoCorrect: "off",
                                spellCheck: "false",
                                ...params.InputProps,
                            },
                        }}
                        sx={{
                            "& .MuiInputBase-root": {
                                backgroundColor: "primary.dark",
                                borderRadius: 1,
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};
