import { memo, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ERoute, ERouteGraphRow, RouteGraphTrack } from "typings";
import { Virtuoso } from "react-virtuoso";
import RouteStop from "./RouteStop";
import RouteActions from "./RouteActions";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";
import { ROUTE_GRAPH_ROW_HEIGHT, useQueryRouteGraph } from "@/hooks/useQueryRoutes";

const VirtuosoComponents = {
    Header: RouteActions,
};

// mirrors the server-side geometry: padding = rowHeight / 2, trackWidth = round(rowHeight * 0.6)
const PADDING = ROUTE_GRAPH_ROW_HEIGHT / 2;
const TRACK_WIDTH = Math.round(ROUTE_GRAPH_ROW_HEIGHT * 0.6);

// equal breathing room on both sides: left of the first dot, and after the last track before the name
const EDGE_PADDING = 26;

export default memo(() => {
    const direction = useDirectionStore(useShallow((state) => state.direction));
    const { city, route } = useParams();

    const { data } = useQueryRouteGraph({
        city: city!,
        route: route!,
    });

    const stops = data?.graph[direction]?.stops;

    // left edge is shared by all rows (crops the unused bypass column); the right edge
    // is per-row, so names move next to the dot wherever no track runs alongside
    const graphX = useMemo(() => {
        if (!stops?.length) return 0;

        const usesBypass = stops.some((row) =>
            row[ERouteGraphRow.paths].some(([, track]) => track === RouteGraphTrack.bypass),
        );

        const minTrack = usesBypass ? RouteGraphTrack.bypass : RouteGraphTrack.trunk;
        return PADDING + minTrack * TRACK_WIDTH - EDGE_PADDING;
    }, [stops]);

    if (!data || !stops) return null;

    return (
        <Virtuoso
            data={stops}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            fixedItemHeight={ROUTE_GRAPH_ROW_HEIGHT}
            itemContent={(_, row) => (
                <RouteStop
                    row={row}
                    color={data.route[ERoute.color]}
                    box={{
                        x: graphX,
                        width: row[ERouteGraphRow.width] - PADDING + EDGE_PADDING - graphX,
                    }}
                />
            )}
            components={VirtuosoComponents}
        />
    );
});
