import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { Place, SportsScore } from "@mui/icons-material";
import { useQuerySearchPlaces } from "@/hooks/useQueryTripPlanner";
import { useParams } from "react-router-dom";
import { ESearchPlace, SearchPlace } from "typings";
import usePlacesStore from "@/hooks/usePlacesStore";
import { useShallow } from "zustand/react/shallow";

export default ({ type }: { type: "from" | "to" }) => {
    const [place, setPlace] = usePlacesStore(useShallow((state) => [state.places[type], state.setPlace]));
    const { city } = useParams();

    const { data: places, isLoading } = useQuerySearchPlaces(city!, place.text);

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
            {type === "from" ? <Place /> : <SportsScore />}

            <Autocomplete
                size="small"
                fullWidth
                options={places || []}
                onInputChange={(_, newValue, reason) =>
                    reason === "input" && setPlace(type, { ...place, text: newValue })
                }
                getOptionLabel={(option) => option[ESearchPlace.name]}
                isOptionEqualToValue={(place, value) => place[ESearchPlace.id] === value[ESearchPlace.id]}
                loading={isLoading}
                value={place.place}
                onChange={(_, newValue) => setPlace(type, { ...place, place: newValue || undefined })}
                filterOptions={(options) => options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={type === "from" ? "Start" : "End"}
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
                renderOption={(props, option) => (
                    <Box {...props} component="li" key={option[ESearchPlace.id]}>
                        <ListItemText
                            primary={option[ESearchPlace.name]}
                            secondary={option[ESearchPlace.address]}
                        />
                    </Box>
                )}
            />
        </Box>
    );
};
