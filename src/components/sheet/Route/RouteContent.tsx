import { memo, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { Virtuoso } from "react-virtuoso";
import { EGraphPlacement, EVehiclePlacement, Route, RouteGraphDirection, VehiclePlacement } from "typings";
import RouteStop, { ROW_HEIGHT } from "./RouteStop";
import RouteActions from "./RouteActions";
import { Bead } from "./RouteBead";
import useDirectionStore from "@/hooks/useDirectionStore";
import useRoutePlacementsStore from "@/hooks/useRoutePlacementsStore";
import { useShallow } from "zustand/react/shallow";
import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";
import { layoutDirection, placementRowKey, RouteRow } from "@/util/routeLayout";
import { getCityFromUrl } from "@/util/tools";

const VirtuosoComponents = {
    Header: RouteActions,
};

// a placement spans the rows of its two graph stops, however many rows lie between them, and the
// bead switches to the lane of the stop it heads for halfway over
const layoutBeads = (
    placements: VehiclePlacement[],
    rows: RouteRow[],
    direction: RouteGraphDirection,
    expanded: ReadonlySet<number>,
): Map<number, Bead[]> => {
    const rowIndices = new Map(rows.map((row, index) => [row.key, index]));
    const beads: Omit<Bead, "depth">[] = [];

    for (const entry of placements) {
        const placement = entry[EVehiclePlacement.placement];
        const fromKey = placementRowKey(
            placement[EGraphPlacement.fromBranch],
            placement[EGraphPlacement.fromPosition],
            direction,
            expanded,
        );
        const toKey = placementRowKey(
            placement[EGraphPlacement.toBranch],
            placement[EGraphPlacement.toPosition],
            direction,
            expanded,
        );
        const from = rowIndices.get(fromKey);
        const to = rowIndices.get(toKey);
        if (from === undefined || to === undefined) continue;

        const percent = placement[EGraphPlacement.percent];
        const progress = from + ((to - from) * percent) / 100;

        beads.push({
            key: `${entry[EVehiclePlacement.city]}:${entry[EVehiclePlacement.vehicleId]}`,
            row: Math.ceil(progress),
            progress,
            lane: rows[percent < 50 ? from : to].lane,
        });
    }

    beads.sort((a, b) => a.lane - b.lane || b.progress - a.progress);

    // beads within a bead's height and a step of the one ahead pile onto it: the one right behind
    // peeks out over it, and the fully visible front one stands in for any more with a count
    const shown: Bead[] = [];
    let front = 0;
    for (let i = 1; i <= beads.length; i++) {
        const piled =
            i < beads.length &&
            beads[i].lane === beads[front].lane &&
            beads[front].progress - beads[i].progress < 0.6;
        if (piled) continue;

        const size = i - front;
        const { row, progress } = beads[front];
        shown.push({ ...beads[front], depth: 0, count: size > 2 ? size - 1 : undefined });
        if (size > 1) {
            shown.push({ ...beads[front + 1], row, progress, depth: 1 });
        }
        front = i;
    }

    // the lower bead draws over the one above it, so a pile's front vehicle stays on top
    shown.sort((a, b) => a.progress - b.progress || b.depth - a.depth);

    const byRow = new Map<number, Bead[]>();
    for (const bead of shown) {
        byRow.set(bead.row, [...(byRow.get(bead.row) ?? []), bead]);
    }

    return byRow;
};

export default memo(() => {
    const direction = useDirectionStore(useShallow((state) => state.direction));
    const { city, route } = useParams();
    const { t } = useTranslation("Vehicle");

    const { data } = useQueryRouteGraph({
        city: getCityFromUrl(city),
        route: route!,
    });

    if (!data) return null;

    const graph = data.graph[direction];

    if (!graph) {
        return (
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", paddingY: 4 }}>
                {t("routeEmpty")}
            </Typography>
        );
    }

    return <RouteStops key={direction} route={data.route} direction={graph} />;
});

type RouteStopsProps = {
    route: Route;
    direction: RouteGraphDirection;
};

const RouteStops = ({ route, direction }: RouteStopsProps) => {
    const placements = useRoutePlacementsStore((state) => state.placements);
    const [expanded, setExpanded] = useState<ReadonlySet<number>>(() => new Set());

    const rows = useMemo(() => layoutDirection(direction, expanded), [direction, expanded]);
    const beadsByRow = useMemo(
        () => layoutBeads(placements, rows, direction, expanded),
        [placements, rows, direction, expanded],
    );

    return (
        <Virtuoso
            data={rows}
            fixedItemHeight={ROW_HEIGHT}
            computeItemKey={(_, row) => row.key}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            itemContent={(index, row) => (
                <RouteStop
                    row={row}
                    route={route}
                    beads={beadsByRow.get(index)}
                    onExpand={(branch) => setExpanded((current) => new Set(current).add(branch))}
                />
            )}
            components={VirtuosoComponents}
        />
    );
};
