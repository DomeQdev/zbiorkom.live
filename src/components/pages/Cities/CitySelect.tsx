import {
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { NavigateNext, Search, Star, StarOutline } from "@mui/icons-material";
import { City } from "typings";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type Props = {
    cities: City[];
    onCityClick: (city: City) => void;
};

export default ({ cities, onCityClick }: Props) => {
    const { t } = useTranslation("Settings");

    const [starredCities, setStarredCities] = useState<string[]>(
        JSON.parse(localStorage.getItem("starredCities") || "[]")
    );
    const [filteredCities, setCities] = useState<City[]>(cities);
    const [search, setSearch] = useState("");

    return (
        <>
            <TextField
                size="small"
                placeholder={t("searchCities")}
                fullWidth
                value={search}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);

                    const query = value.toLowerCase().trim();
                    if (!query) return setCities(cities);

                    const newFilteredCities = cities.filter(
                        (city) =>
                            city.name.toLowerCase().includes(query) ||
                            city.description?.toLowerCase().includes(query) ||
                            city.id.includes(query)
                    );

                    setCities(newFilteredCities);
                }}
                sx={{
                    px: 1,
                    "& .MuiInputBase-root": {
                        backgroundColor: "#333",
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        autoComplete: "off",
                    },
                }}
            />

            {starredCities.length > 0 && !search && (
                <CityList
                    cities={cities.filter((city) => starredCities.includes(city.id))}
                    onCityClick={onCityClick}
                    starredCities={starredCities}
                    setStarredCities={setStarredCities}
                />
            )}

            <CityList
                cities={filteredCities}
                onCityClick={onCityClick}
                starredCities={starredCities}
                setStarredCities={setStarredCities}
            />
        </>
    );
};

type CityListProps = {
    cities: Props["cities"];
    onCityClick: Props["onCityClick"];
    starredCities: string[];
    setStarredCities: (cities: string[]) => void;
};

const CityList = ({ cities, onCityClick, starredCities, setStarredCities }: CityListProps) => {
    return (
        <List
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                "& .MuiListItemButton-root": {
                    backgroundColor: "#333",
                    marginX: 1,
                    borderRadius: 0,
                    "&:hover": {
                        backgroundColor: "#444",
                        "& .MuiTypography-body1": {
                            fontWeight: 600,
                        },
                        "& .MuiListItemIcon-root": {
                            marginRight: -0.5,
                        },
                    },
                },
                "& .MuiListItemButton-root:first-of-type": {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                },
                "& .MuiListItemButton-root:last-of-type": {
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                },
                "& .MuiTypography-body1": {
                    transition: "font-weight 0.1s ease",
                },
                "& .MuiListItemIcon-root": {
                    minWidth: 0,
                    marginRight: 1,
                    transition: "margin-right 0.15s ease",
                },
            }}
        >
            {cities.map((city) => {
                const isStarred = starredCities.includes(city.id);

                return (
                    <ListItemButton key={city.id} onClick={() => onCityClick(city)}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                const newStarredCities = isStarred
                                    ? starredCities.filter((id) => id !== city.id)
                                    : [...starredCities, city.id];

                                setStarredCities(newStarredCities);
                                localStorage.setItem("starredCities", JSON.stringify(newStarredCities));

                                e.stopPropagation();
                            }}
                            sx={{
                                marginLeft: -1,
                                marginRight: 1,
                                backgroundColor: isStarred ? "#534600" : "transparent",
                                color: isStarred ? "#f8e287" : "inherit",
                                transition: "background-color 0.15s ease, color 0.15s ease",
                                "&:hover": {
                                    backgroundColor: isStarred ? "#534600" : "#444",
                                    color: isStarred ? "#f8e287" : "inherit",
                                },
                            }}
                        >
                            {isStarred ? <Star /> : <StarOutline />}
                        </IconButton>

                        <ListItemText
                            primary={
                                <>
                                    {city.name}
                                    {city.showNewTag && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                backgroundColor: "#8fd88a",
                                                color: "#00390a",
                                                borderRadius: 0.5,
                                                fontWeight: "bolder",
                                                fontSize: 12,
                                                marginLeft: 1,
                                                paddingX: 1,
                                                paddingY: 0.25,
                                            }}
                                        >
                                            NEW
                                        </Typography>
                                    )}
                                </>
                            }
                            secondary={city.description}
                        />

                        <ListItemIcon>
                            <NavigateNext />
                        </ListItemIcon>
                    </ListItemButton>
                );
            })}
        </List>
    );
};
