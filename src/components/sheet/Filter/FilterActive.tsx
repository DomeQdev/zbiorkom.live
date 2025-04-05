import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ERoute, Route } from "typings";
import RouteChip from "@/ui/RouteChip";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";
import Collapse from "@/ui/Collapse";
import { AddCircle } from "@mui/icons-material";

export default ({ routes, models }: { routes: Route[]; models: string[] }) => {
    const { t } = useTranslation("Filter");
    const [removeRoute, removeModel] = useFilterStore(
        useShallow((state) => [state.removeRoute, state.removeModel])
    );

    return (
        <Collapse icon={<AddCircle />} title={t("activeFilters")} open sx={{ margin: 2 }}>
            <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {routes.map((route) => (
                    <RouteChip
                        key={route[ERoute.id]}
                        route={route}
                        onClick={() => removeRoute(route)}
                        style={{
                            color: "hsla(0, 0%, 100%, 0.8)",
                            backgroundColor: route[ERoute.color],
                        }}
                    />
                ))}

                {models.map((model) => (
                    <div
                        key={model}
                        className="routeChip"
                        style={{
                            color: "hsla(0, 0%, 100%, 0.8)",
                            backgroundColor: "#79501f",
                            width: "max-content",
                            paddingLeft: 8,
                            paddingRight: 8,
                        }}
                        onClick={() => removeModel(model)}
                    >
                        {model}
                    </div>
                ))}
            </Box>
        </Collapse>
    );
};
