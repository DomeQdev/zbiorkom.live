import { Box, CircularProgress, Fade, IconButton, InputAdornment, TextField } from "@mui/material";
import { HighlightOff, RestartAlt, Search } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";
import { useMap } from "react-map-gl";
import { useQuerySearchRoutesOrModels } from "@/hooks/useQuerySearch";

export default () => {
    const [search, tempRoutes, tempModels, initialPosition, setSearch, reset] = useFilterStore(
        useShallow((state) => [
            state.search,
            state.tempRoutes,
            state.tempModels,
            state.initialPosition,
            state.setSearch,
            state.reset,
        ])
    );
    const searchInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslation("Filter");
    const { current: map } = useMap();
    const { city } = useParams();

    const { isFetching } = useQuerySearchRoutesOrModels({ city: city! });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
            }}
        >
            <TextField
                size="small"
                placeholder={t("searchRoutesOrModels")}
                fullWidth
                inputRef={searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                    input: {
                        autoComplete: "off",
                        autoCapitalize: "off",
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <Fade in={!!search}>
                                <InputAdornment position="end">
                                    {isFetching ? (
                                        <CircularProgress
                                            sx={{
                                                color: "text.secondary",
                                            }}
                                            size={20}
                                        />
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                setSearch("");
                                                searchInput.current?.focus();
                                            }}
                                            edge="end"
                                        >
                                            <HighlightOff />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            </Fade>
                        ),
                    },
                }}
            />
            <Box
                sx={{
                    "& .MuiIconButton-root": {
                        backgroundColor: "background.paper",
                        transition: "opacity 0.3s",
                        "&.Mui-disabled": {
                            color: "text.main",
                            opacity: 0.5,
                        },
                    },
                }}
            >
                <IconButton
                    disabled={!tempRoutes.length && !tempModels.length}
                    onClick={() => {
                        reset();

                        if (initialPosition && map) {
                            map.easeTo({
                                zoom: initialPosition[0],
                                center: initialPosition[1],
                            });
                        }
                    }}
                >
                    <RestartAlt />
                </IconButton>
            </Box>
        </Box>
    );
};
