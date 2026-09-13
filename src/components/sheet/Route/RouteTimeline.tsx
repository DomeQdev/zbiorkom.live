import { ReactNode } from "react";
import type { LineRun } from "@/util/routeLayout";
import { fadeColor } from "@/util/tools";

type Props = {
    color: string;
    height: number;
    lane?: number; // the dot's lane
    main?: boolean; // the dot sits on the main line rather than a variant
    gap?: boolean; // the row stands in for stops folded away: a dashed run instead of a dot
    above: boolean; // the line runs straight into the dot from the row above
    below: boolean; // and straight on out of it to the row below
    runs?: LineRun[]; // every other line through the row
    children?: ReactNode; // laid over the column, e.g. the vehicle beads
};

const NO_RUNS: LineRun[] = [];

export const SHEET_BACKGROUND = "#1a1c19";

export const laneX = (lane: number) => 24 + 20 * lane;

// an s-curve between two lanes that leaves and arrives straight down
const bend = (fromX: number, fromY: number, toX: number, toY: number) => {
    const midY = (fromY + toY) / 2;

    return `M${fromX} ${fromY} C${fromX} ${midY} ${toX} ${midY} ${toX} ${toY}`;
};

export default ({
    color,
    height,
    lane = 0,
    main = true,
    gap = false,
    above,
    below,
    runs = NO_RUNS,
    children,
}: Props) => {
    const variantStroke = fadeColor(color, 0.5, SHEET_BACKGROUND); // variants fade towards the sheet
    const stroke = main ? color : variantStroke;
    const outermost = Math.max(lane, ...runs.flatMap((run) => [run.from, run.to]));
    const width = 48 + 20 * outermost;
    const x = laneX(lane);

    // the drawing runs a pixel past the row at both ends, so neighbouring rows overlap instead
    // of leaving a hairline seam between their lines
    const bottom = height + 2;
    const middle = height / 2 + 1;

    const paint = (run: LineRun, index: number) => {
        const x1 = laneX(run.from);
        const x2 = laneX(run.to);
        const y1 = run.half === "lower" ? middle : 0;
        const y2 = run.half === "upper" ? middle : bottom;
        const runStroke = run.main ? color : variantStroke;

        if (x1 === x2) {
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={runStroke} strokeWidth={6} />;
        }

        return <path key={index} d={bend(x1, y1, x2, y2)} stroke={runStroke} strokeWidth={6} fill="none" />;
    };

    // the main line is painted over every variant, so a branch always reads as merging behind it
    const ownLine = gap ? (
        <line
            x1={x}
            y1={above ? 0 : middle}
            x2={x}
            y2={below ? bottom : middle}
            stroke={stroke}
            strokeWidth={6}
            strokeDasharray="6 5"
        />
    ) : (
        <>
            {above && <line x1={x} y1={0} x2={x} y2={middle} stroke={stroke} strokeWidth={6} />}
            {below && <line x1={x} y1={middle} x2={x} y2={bottom} stroke={stroke} strokeWidth={6} />}
        </>
    );

    return (
        <div style={{ position: "relative", flexShrink: 0, width, height }}>
            <svg width={width} height={bottom} style={{ display: "block", marginTop: -1 }}>
                {runs.filter((run) => !run.main).map(paint)}

                {!main && ownLine}

                {runs.filter((run) => run.main).map(paint)}

                {main && ownLine}

                {!gap && <circle cx={x} cy={middle} r={6.5} fill="#ffffff" stroke={stroke} strokeWidth={3} />}
            </svg>

            {children}
        </div>
    );
};
