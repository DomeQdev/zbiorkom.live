import { Box, ButtonBase, FormControlLabel, Switch, Typography } from "@mui/material";
import { MapStyleId, useMapStyleStore } from "@/hooks/useMapStyleStore";
import { mapStyles, MapStyleDefinition } from "@/map/mapStyle";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";

const mapStyleEntries = Object.entries(mapStyles) as [MapStyleId, MapStyleDefinition][];

export default () => {
    const { t } = useTranslation("Layers");
    const [selectedStyle, selectStyle, basicAppearance, setBasicAppearance] = useMapStyleStore(
        useShallow((state) => [
            state.selectedStyle,
            state.selectStyle,
            state.basicAppearance,
            state.setBasicAppearance,
        ]),
    );

    const selectedDefinition = mapStyles[selectedStyle] as MapStyleDefinition;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: 1,
                height: "calc(var(--rsbs-overlay-h) - 55px)",
                overflowY: "auto",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 1,
                    "& button": {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 1,
                        padding: 1,
                        gap: 1,
                        transition: "background-color 0.2s, color 0.2s, font-weight 0.2s",
                        "&:hover": { backgroundColor: "action.hover" },
                        "&[data-selected='true']": {
                            fontWeight: "bold",
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                        },
                    },
                    "& img": {
                        borderRadius: 1,
                        userSelect: "none",
                        pointerEvents: "none",
                    },
                }}
            >
                {mapStyleEntries.map(([id, definition]) => {
                    const isSelected = id === selectedStyle;

                    return (
                        <ButtonBase
                            data-selected={isSelected}
                            onClick={() => {
                                selectStyle(id);
                                if (!definition.supportsDark) {
                                    setBasicAppearance("light");
                                }
                            }}
                        >
                            <img
                                src={`/maps/${id}.webp`}
                                alt={definition.name}
                                style={{ width: 100, height: 100 }}
                            />
                            <span>{definition.name}</span>
                        </ButtonBase>
                    );
                })}
            </Box>

            {selectedDefinition.supportsDark && (
                <FormControlLabel
                    control={
                        <Switch
                            checked={basicAppearance === "dark"}
                            onChange={(e) => setBasicAppearance(e.target.checked ? "dark" : "light")}
                        />
                    }
                    label={t("darkMode")}
                />
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 0.5,
                    justifyContent: "center",
                    marginTop: 2,
                    "& a": {
                        textDecoration: "underline",
                        color: "text.secondary",
                    },
                }}
            >
                {selectedDefinition.attribution.map((__html, index) => (
                    <Typography
                        key={index}
                        variant="caption"
                        color="text.secondary"
                        component="div"
                        dangerouslySetInnerHTML={{ __html }}
                    />
                ))}
            </Box>
        </Box>
    );
};
