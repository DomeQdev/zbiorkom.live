import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ERoute, Route } from "typings";
import RouteChip from "@/ui/RouteChip";
import { MyLocation } from "@mui/icons-material";
import Collapse from "@/ui/Collapse";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";

type Props = {
    routesNearby: Route[];
    filteredRoutes: Route[];
};

export default ({ routesNearby, filteredRoutes }: Props) => {
    const [addRoute, removeRoute] = useFilterStore(
        useShallow((state) => [state.addRoute, state.removeRoute]),
    );
    const { t } = useTranslation("Filter");

    return (
        <Collapse icon={<MyLocation />} title={t("routesNearby")} open sx={{ margin: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 0.5,
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {routesNearby.map((route) => {
                    const selected = filteredRoutes.some((r) => r[ERoute.id] === route[ERoute.id]);

                    return (
                        <RouteChip
                            key={route[ERoute.id]}
                            route={route}
                            onClick={() => {
                                if (selected) {
                                    removeRoute(route);
                                } else {
                                    addRoute(route);
                                }
                            }}
                            style={{
                                color: selected ? "hsla(0, 0%, 100%, 0.8)" : route[ERoute.color],
                                backgroundColor: selected ? route[ERoute.color] : "transparent",
                                border: selected ? "none" : `1px solid ${route[ERoute.color]}`,
                            }}
                        />
                    );
                })}
            </Box>
        </Collapse>
    );
};
