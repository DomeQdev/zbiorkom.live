import { memo, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ERoute } from "typings";
import { Virtuoso } from "react-virtuoso";
import RouteStop from "./RouteStop";
import RouteActions from "./RouteActions";
import { buildRouteRows } from "./routeRows";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";

const VirtuosoComponents = {
    Header: RouteActions,
};

export default memo(() => {
    const direction = useDirectionStore(useShallow((state) => state.direction));
    const { city, route } = useParams();

    const { data } = useQueryRouteGraph({
        city: city!,
        route: route!,
    });

    const graph = data?.graph[direction];
    const color = data?.route[ERoute.color];

    const rows = useMemo(() => (graph && color ? buildRouteRows(graph, color) : []), [graph, color]);

    if (!graph || !color) return null;

    return (
        <Virtuoso
            data={rows}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            itemContent={(_, row) => <RouteStop row={row} color={color} />}
            components={VirtuosoComponents}
        />
    );
});
