import { ListItemButton, ListItemText } from "@mui/material";
import { ERouteGraphRow, EStop, RouteGraphRow, RouteGraphTrack } from "typings";
import { useMap } from "@vis.gl/react-maplibre";
import { ROUTE_GRAPH_ROW_HEIGHT } from "@/hooks/useQueryRoutes";
import { BRANCH_COLOR_RATIO, fadeColor } from "@/util/tools";
import { useMemo } from "react";

const TRUNK_LINE_WIDTH = 6;
const BRANCH_LINE_WIDTH = 3.5;
const NODE_RADIUS = 7.5;
const NODE_BORDER = 3;

type Props = {
    row: RouteGraphRow;
    color: string;
    box: { x: number; width: number };
};

export default ({ row, color, box }: Props) => {
    const { current: map } = useMap();
    const stop = row[ERouteGraphRow.stop];

    // same faded route color as the branch lines/stops on the map
    const branchColor = useMemo(() => fadeColor(color, BRANCH_COLOR_RATIO), [color]);

    const isTrunk = (track: number) => track === RouteGraphTrack.trunk;
    const trackColor = (track: number) => (isTrunk(track) ? color : branchColor);

    // trunk segments last, so the route color stays on top at junctions
    const paths = [...row[ERouteGraphRow.paths]].sort(
        ([, trackA], [, trackB]) => +isTrunk(trackA) - +isTrunk(trackB),
    );

    return (
        <ListItemButton
            onClick={() =>
                map?.flyTo({
                    center: stop[EStop.location],
                    zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                })
            }
            sx={{ padding: 0, height: ROUTE_GRAPH_ROW_HEIGHT }}
        >
            <svg
                width={box.width}
                height={ROUTE_GRAPH_ROW_HEIGHT}
                viewBox={`${box.x} 0 ${box.width} ${ROUTE_GRAPH_ROW_HEIGHT}`}
                style={{ flexShrink: 0, display: "block" }}
            >
                {paths.map(([d, track], i) => (
                    <path
                        key={i}
                        d={d}
                        stroke={trackColor(track)}
                        strokeWidth={isTrunk(track) ? TRUNK_LINE_WIDTH : BRANCH_LINE_WIDTH}
                        strokeLinejoin="round"
                        fill="none"
                    />
                ))}
                {row[ERouteGraphRow.nodes].map(([x, track], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={ROUTE_GRAPH_ROW_HEIGHT / 2}
                        r={NODE_RADIUS}
                        fill="#fff"
                        stroke={trackColor(track)}
                        strokeWidth={NODE_BORDER}
                    />
                ))}
            </svg>
            <ListItemText
                primary={`${stop[EStop.name]} ${stop[EStop.code] || ""}`}
                sx={{
                    "& .MuiListItemText-primary": {
                        display: "flex",
                        alignItems: "center",
                        fontSize: "15px",
                    },
                }}
            />
        </ListItemButton>
    );
};
