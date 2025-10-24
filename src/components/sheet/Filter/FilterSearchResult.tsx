import { ERoute, Route } from "typings";
import { Checkbox, ListItemButton, ListItemText } from "@mui/material";
import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";

export default ({ result }: { result: string | Route }) => {
    const [tempModels, tempRoutes, addModel, removeModel, addRoute, removeRoute] = useFilterStore(
        useShallow((state) => [
            state.tempModels,
            state.tempRoutes,
            state.addModel,
            state.removeModel,
            state.addRoute,
            state.removeRoute,
        ]),
    );

    const onClick = () => {
        if (typeof result === "string") {
            if (tempModels.includes(result)) {
                removeModel(result);
            } else {
                addModel(result);
            }
        } else {
            if (tempRoutes.some((route) => route[ERoute.id] === result[ERoute.id])) {
                removeRoute(result);
            } else {
                addRoute(result);
            }
        }
    };

    return (
        <ListItemButton onClick={onClick}>
            <ListItemText
                primary={
                    typeof result === "string" ? (
                        result
                    ) : (
                        <VehicleHeadsign route={result} headsign={result[ERoute.longName]} />
                    )
                }
            />
            <Checkbox
                edge="end"
                onClick={onClick}
                checked={
                    typeof result === "string"
                        ? tempModels.includes(result)
                        : tempRoutes.some((route) => route[ERoute.id] === result[ERoute.id])
                }
            />
        </ListItemButton>
    );
};
