import { Box, Divider, List, ListItemButton, ListItemText, Popover, TextField } from "@mui/material";
import { Place, SportsScore } from "@mui/icons-material";
import { useQuerySearchPlaces } from "@/hooks/useQueryTripPlanner";
import { useParams } from "react-router-dom";
import usePlacesStore from "@/hooks/usePlacesStore";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { ESearchPlace } from "typings";

export default ({ type }: { type: "from" | "to" }) => {
    const [place, setPlace] = usePlacesStore(useShallow((state) => [state.places[type], state.setPlace]));
    const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
    const { city } = useParams();

    const { data: searchPlaces, isLoading } = useQuerySearchPlaces(city!, place.text);

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

            <TextField
                size="small"
                fullWidth
                variant="outlined"
                placeholder={type === "from" ? "Start" : "End"}
                onFocus={({ currentTarget }) => {
                    currentTarget.select();
                    setAnchorEl(currentTarget as HTMLInputElement);
                }}
                onBlur={() => setAnchorEl(null)}
                value={place.text}
                onChange={(e) => setPlace(type, { text: e.target.value })}
                slotProps={{
                    input: {
                        autoCapitalize: "none",
                        autoComplete: "off",
                        autoCorrect: "off",
                    },
                }}
                sx={{
                    "& .MuiInputBase-root": {
                        backgroundColor: "primary.dark",
                        borderRadius: 1,
                    },
                }}
            />

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                disableAutoFocus
                disableEnforceFocus
                slotProps={{
                    paper: { onMouseDown: (e) => e.preventDefault() },
                }}
            >
                <List
                    sx={{
                        padding: 0,
                        "& .MuiListItemButton-root": { borderRadius: 1 },
                        maxHeight: 300,
                    }}
                >
                    <ListItemButton>
                        <ListItemText primary="Twoja lokalizacja" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemText primary="Wybierz na mapie" />
                    </ListItemButton>
                    <Divider />
                    {searchPlaces?.map((searchPlace) => (
                        <ListItemButton
                            key={searchPlace[ESearchPlace.id]}
                            onClick={() => {
                                setPlace(type, {
                                    place: searchPlace,
                                    text: searchPlace[ESearchPlace.name],
                                });
                                // POPRAWKA 2: Zamknij Popover ręcznie po wyborze
                                setAnchorEl(null);
                            }}
                        >
                            <ListItemText
                                primary={searchPlace[ESearchPlace.name]}
                                secondary={searchPlace[ESearchPlace.address]}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Popover>
        </Box>
    );
};
