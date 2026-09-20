import {
    Box,
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
import { normalizeSearch } from "@/util/tools";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

const DISPLAY_AGENCY_LIMIT = 3;

const agencyNames = (city: City) => Object.entries(city.agencies || {});

export const filterCities = (cities: City[], needle: string): City[] => {
    const selectable = [...cities].sort((a, b) => a.name.localeCompare(b.name));

    if (!needle) return selectable;
    return selectable.filter(
        (city) =>
            normalizeSearch(city.name).includes(needle) ||
            agencyNames(city).some(
                ([, agency]) => agency.name && normalizeSearch(agency.name).includes(needle),
            ),
    );
};

type Props = {
    cities: City[];
    onCityClick: (city: City) => void;
};

export default ({ cities, onCityClick }: Props) => {
    const { t } = useTranslation("Settings");

    const [starredCities, setStarredCities] = useState<string[]>(
        JSON.parse(localStorage.getItem("starredCities") || "[]"),
    );
    const [search, setSearch] = useState("");

    const needle = normalizeSearch(search.trim());
    const filteredCities = useMemo(() => filterCities(cities, needle), [cities, needle]);

    return (
        <>
            <TextField
                size="small"
                placeholder={t("searchCities")}
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    cities={filteredCities.filter((city) => starredCities.includes(city.id))}
                    needle={needle}
                    onCityClick={onCityClick}
                    starredCities={starredCities}
                    setStarredCities={setStarredCities}
                />
            )}

            <CityList
                cities={filteredCities}
                needle={needle}
                onCityClick={onCityClick}
                starredCities={starredCities}
                setStarredCities={setStarredCities}
            />
        </>
    );
};

type CityListProps = {
    cities: Props["cities"];
    needle: string;
    onCityClick: Props["onCityClick"];
    starredCities: string[];
    setStarredCities: (cities: string[]) => void;
};

const CityList = ({ cities, needle, onCityClick, starredCities, setStarredCities }: CityListProps) => {
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
                            secondary={
                                agencyNames(city).length ? <Agencies city={city} needle={needle} /> : null
                            }
                            slotProps={{ secondary: { component: "div" } }}
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

const Agencies = ({ city, needle }: { city: City; needle: string }) => {
    const { t } = useTranslation("Settings");

    const entries = agencyNames(city);
    const matchedSide = needle
        ? entries.filter(
              ([key, agency]) =>
                  key !== "default" && agency.name && normalizeSearch(agency.name).includes(needle),
          )
        : [];

    let prefix: string | null = null;
    let nameChips: string[];
    let extra: number;

    if (matchedSide.length > 0) {
        prefix = t("containsAgencies");
        nameChips = [matchedSide[0][1].name];
        extra = matchedSide.length - 1;
    } else {
        const carriers = entries.map(([, agency]) => agency.name).filter(Boolean);
        nameChips = carriers.slice(0, DISPLAY_AGENCY_LIMIT);
        extra = carriers.length - nameChips.length;
    }

    if (!prefix && !nameChips.length) return null;

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 0.75,
                marginTop: 0.75,
                "& .MuiTypography-root": {
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: "#c4c7c5",
                },
            }}
        >
            {prefix && <Typography variant="caption">{prefix}</Typography>}

            {nameChips.map((name) => (
                <Typography
                    key={name}
                    variant="caption"
                    sx={{
                        backgroundColor: "#292a2d",
                        borderRadius: 1,
                        paddingX: 1,
                        paddingY: 0.25,
                    }}
                >
                    {name}
                </Typography>
            ))}

            {extra > 0 && (
                <Typography
                    variant="caption"
                    sx={{
                        backgroundColor: "#444",
                        borderRadius: 1,
                        paddingX: 1,
                        paddingY: 0.25,
                    }}
                >
                    +{extra}
                </Typography>
            )}
        </Box>
    );
};
