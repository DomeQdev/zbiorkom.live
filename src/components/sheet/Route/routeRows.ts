import { EStop, RouteGraphBranch, RouteGraphDirection, RouteGraphStop } from "typings";
import { ROUTE_GRAPH_ROW_HEIGHT } from "@/hooks/useQueryRoutes";
import { variantColor } from "@/util/tools";

export const LABEL_ROW_HEIGHT = 30;
export const REJOIN_ROW_HEIGHT = 22;
export const TRUNK_X = 22;
export const VARIANT_X = 48;
export const GRAPH_WIDTH = 66;

const TRUNK_LINE_WIDTH = 6;
const VARIANT_LINE_WIDTH = 3.5;

export type RouteRow =
    | {
          kind: "stop";
          height: number;
          stop: RouteGraphStop;
          x: number;
          color: string;
          lineAbove: boolean;
          lineBelow: boolean;
          trunkThrough: boolean;
      }
    | { kind: "label"; height: number; text: string; color: string; curveIn: boolean; trunkThrough: boolean }
    | { kind: "rejoin"; height: number; color: string; trunkThrough: boolean };

export type Translate = (key: string, options?: Record<string, unknown>) => string;

const variantLabel = (branch: RouteGraphBranch, t: Translate) => {
    if (branch.from >= 0 && branch.to >= 0) return t("variantDetour");
    if (branch.from >= 0) return t("variantTo", { stop: branch.stops[branch.stops.length - 1][EStop.name] });
    if (branch.to >= 0) return t("variantFrom", { stop: branch.stops[0][EStop.name] });
    return t("variantDetached");
};

// A variant hangs off the trunk stop it leaves after (one joining the trunk sits above the stop it
// joins), painted in variantColor(index) — the colour the map gives its polyline and stops.
export const buildRouteRows = (direction: RouteGraphDirection, color: string, t: Translate): RouteRow[] => {
    const { trunk, branches } = direction;
    const blocks = new Map<number, number[]>();
    branches.forEach((branch, b) => {
        const slot = branch.from >= 0 ? branch.from : branch.to >= 0 ? branch.to - 1 : trunk.length - 1;
        let list = blocks.get(slot);
        if (!list) {
            list = [];
            blocks.set(slot, list);
        }
        list.push(b);
    });

    const rows: RouteRow[] = [];
    const pushBlocks = (slot: number) => {
        const trunkThrough = slot >= 0 && slot + 1 < trunk.length;
        for (const b of blocks.get(slot) ?? []) {
            const branch = branches[b];
            const branchColor = variantColor(color, b);
            rows.push({
                kind: "label",
                height: LABEL_ROW_HEIGHT,
                text: variantLabel(branch, t),
                color: branchColor,
                curveIn: branch.from >= 0,
                trunkThrough,
            });
            branch.stops.forEach((stop, i) => {
                rows.push({
                    kind: "stop",
                    height: ROUTE_GRAPH_ROW_HEIGHT,
                    stop,
                    x: VARIANT_X,
                    color: branchColor,
                    lineAbove: i > 0 || branch.from >= 0,
                    lineBelow: i < branch.stops.length - 1 || branch.to >= 0,
                    trunkThrough,
                });
            });
            if (branch.to >= 0) {
                rows.push({ kind: "rejoin", height: REJOIN_ROW_HEIGHT, color: branchColor, trunkThrough });
            }
        }
    };

    pushBlocks(-1);
    trunk.forEach((stop, i) => {
        const leaves = (blocks.get(i) ?? []).some((b) => branches[b].from === i);
        rows.push({
            kind: "stop",
            height: ROUTE_GRAPH_ROW_HEIGHT,
            stop,
            x: TRUNK_X,
            color,
            lineAbove: i > 0,
            lineBelow: i < trunk.length - 1 || leaves,
            trunkThrough: false,
        });
        pushBlocks(i);
    });
    return rows;
};

// trunk segments last, so the route colour stays on top at junctions
export const routeRowPaths = (row: RouteRow, color: string) => {
    const paths: Array<{ d: string; color: string; width: number }> = [];
    const height = row.height;

    if (row.kind === "stop") {
        const top = row.lineAbove ? 0 : height / 2;
        const bottom = row.lineBelow ? height : height / 2;
        if (top !== bottom) {
            paths.push({
                d: `M${row.x} ${top}V${bottom}`,
                color: row.color,
                width: row.x === TRUNK_X ? TRUNK_LINE_WIDTH : VARIANT_LINE_WIDTH,
            });
        }
    } else if (row.kind === "label") {
        if (row.curveIn) {
            paths.push({
                d: `M${TRUNK_X} 0C${TRUNK_X} ${height * 0.6} ${VARIANT_X} ${height * 0.4} ${VARIANT_X} ${height}`,
                color: row.color,
                width: VARIANT_LINE_WIDTH,
            });
        }
    } else {
        paths.push({
            d: `M${VARIANT_X} 0C${VARIANT_X} ${height * 0.6} ${TRUNK_X} ${height * 0.4} ${TRUNK_X} ${height}`,
            color: row.color,
            width: VARIANT_LINE_WIDTH,
        });
    }

    if (row.trunkThrough) paths.push({ d: `M${TRUNK_X} 0V${height}`, color, width: TRUNK_LINE_WIDTH });
    return paths;
};
