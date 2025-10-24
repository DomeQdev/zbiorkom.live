import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { EStop, SearchItem } from "typings";
import { Link } from "react-router-dom";
import { KeyboardArrowDown } from "@mui/icons-material";
import StopMarker from "@/map/StopMarker";
import { useTranslation } from "react-i18next";
import { useQueryStopGroup } from "@/hooks/useQueryStops";

type Props = {
    stop: NonNullable<SearchItem["stop"]>;
    borderTop?: boolean;
    borderBottom?: boolean;
    isExpanded: boolean;
    setExpandedStop: (stop?: string) => void;
};

export default ({ stop, borderTop, borderBottom, isExpanded, setExpandedStop }: Props) => {
    const { t } = useTranslation("Vehicle");

    const { data: stops } = useQueryStopGroup({
        city: stop[EStop.city],
        stop: stop[EStop.id],
        enabled: isExpanded,
    });

    return (
        <>
            <ListItemButton
                onClick={() => setExpandedStop(isExpanded ? undefined : stop[EStop.id])}
                sx={{
                    mx: 1,
                    borderRadius: 0.4,
                    backgroundColor: "background.paper",
                    borderTopLeftRadius: borderTop ? 16 : undefined,
                    borderTopRightRadius: borderTop ? 16 : undefined,
                    borderBottomLeftRadius: borderBottom && !isExpanded ? 16 : undefined,
                    borderBottomRightRadius: borderBottom && !isExpanded ? 16 : undefined,
                    transition: "border-radius 0.15s ease-in-out",
                    "&:hover": {
                        backgroundColor: "background.paper",
                    },
                }}
            >
                <ListItemText primary={stop[EStop.name]} />
                <KeyboardArrowDown
                    sx={{
                        transform: isExpanded ? "rotate(180deg)" : undefined,
                        transition: "transform 0.2s ease-in-out",
                    }}
                />
            </ListItemButton>

            <Box
                sx={{
                    mx: 1,
                    mt: isExpanded ? 0.3 : 0,
                    mb: isExpanded ? 0.5 : 0,
                    borderRadius: 0.4,
                    height: isExpanded ? (stops?.length || 2) * 56 : 0,
                    visibility: isExpanded ? "visible" : "hidden",
                    backgroundColor: "background.paper",
                    transition: "height 0.2s ease-in-out",
                    borderBottomLeftRadius: borderBottom ? 16 : undefined,
                    borderBottomRightRadius: borderBottom ? 16 : undefined,
                    zIndex: 1e6,
                }}
            >
                {stops?.map((expandedStop, i) => {
                    const hasBottomBorder = borderBottom && i === (stops!.length || 0) - 1;

                    return (
                        <ListItemButton
                            key={expandedStop[EStop.id]}
                            component={Link}
                            to={`../stop/${expandedStop[EStop.id]}`}
                            state={-2}
                            sx={{
                                borderRadius: 0.4,
                                borderBottomLeftRadius: hasBottomBorder ? 16 : undefined,
                                borderBottomRightRadius: hasBottomBorder ? 16 : undefined,
                                height: 56,
                                py: 0,
                            }}
                        >
                            <ListItemIcon>
                                <StopMarker stop={expandedStop} />
                            </ListItemIcon>
                            <ListItemText
                                primary={expandedStop[EStop.name]}
                                secondary={
                                    expandedStop[EStop.direction] || expandedStop[EStop.station]
                                        ? (expandedStop[EStop.direction]
                                              ? `» ${expandedStop[EStop.direction]}, `
                                              : "") + expandedStop[EStop.routes].join(", ")
                                        : t("terminus")
                                }
                                secondaryTypographyProps={{
                                    sx: {
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    },
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </Box>
        </>
    );
};
