import { Box, ListItemButton, ListItemText } from "@mui/material";
import { EStop } from "typings";
import { useMap } from "@vis.gl/react-maplibre";
import { GRAPH_WIDTH, RouteRow, routeRowPaths } from "./routeRows";

const NODE_RADIUS = 7.5;
const NODE_BORDER = 3;

type Props = {
    row: RouteRow;
    color: string;
};

export default ({ row, color }: Props) => {
    const { current: map } = useMap();

    const graph = (
        <svg
            width={GRAPH_WIDTH}
            height={row.height}
            viewBox={`0 0 ${GRAPH_WIDTH} ${row.height}`}
            style={{ flexShrink: 0, display: "block" }}
        >
            {routeRowPaths(row, color).map((path, i) => (
                <path
                    key={i}
                    d={path.d}
                    stroke={path.color}
                    strokeWidth={path.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            ))}
            {row.kind === "stop" && (
                <circle
                    cx={row.x}
                    cy={row.height / 2}
                    r={NODE_RADIUS}
                    fill="#fff"
                    stroke={row.color}
                    strokeWidth={NODE_BORDER}
                />
            )}
        </svg>
    );

    if (row.kind !== "stop") {
        return (
            <Box sx={{ display: "flex", alignItems: "center", height: row.height }}>
                {graph}
                {row.kind === "label" && (
                    <Box
                        component="span"
                        sx={{
                            color: row.color,
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row.text}
                    </Box>
                )}
            </Box>
        );
    }

    const stop = row.stop;

    return (
        <ListItemButton
            onClick={() =>
                map?.flyTo({
                    center: stop[EStop.location],
                    zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                })
            }
            sx={{ padding: 0, height: row.height }}
        >
            {graph}
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
