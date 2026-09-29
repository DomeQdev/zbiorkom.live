import { RouteGraphDirection, RouteGraphStop } from "typings";

export type LineRun = {
    from: number; // lane at the top end
    to: number; // lane at the bottom end
    half?: "upper" | "lower"; // down to the row's middle, or on from it; the whole row when unset
    main: boolean;
};

type RowLanes = {
    key: string;
    lane: number; // the dot's lane
    main: boolean; // the dot sits on the main line
    above: boolean; // the line runs straight into the row's middle from the row above
    below: boolean; // and straight on out of it to the row below
    runs: LineRun[]; // every other line through the row
};

type RowStop =
    | { kind: "stop"; stop: RouteGraphStop }
    | { kind: "hidden"; branch: number; stops: RouteGraphStop[] }; // stops folded away

export type RouteRow = RowStop & RowLanes;

type LaneShift = { from: number; to: number };

// lanes as laid out, 0 being the main line; they turn into painted lanes once the main line
// has been swapped over wherever variants skip its stops
type DraftLanes = {
    key: string;
    lane: number;
    above: boolean;
    below: boolean;
    through: number[]; // lanes crossing the row without a stop
    forks: number[]; // lanes the line out of the middle bends into
    joins: number[]; // lanes the line into the middle bends in from
    shifts: LaneShift[]; // lanes crossing the row while moving over to another one
};

type DraftRow = RowStop & DraftLanes;

// a variant sits right after the main-line stop it leaves, or right before the one it joins, and
// peels off the main line just above its first stop and merges back right under its last one; it
// only holds a lane further when it skips main-line stops, or when the main line is not there
export const layoutDirection = (
    { trunk, branches }: RouteGraphDirection,
    expanded: ReadonlySet<number>, // branches listing every stop despite their collapse range
): RouteRow[] => {
    const leaving: number[][] = trunk.map(() => []);
    const arriving: number[][] = trunk.map(() => []);
    const islands: number[] = [];

    for (let i = 0; i < branches.length; i++) {
        const { from, to } = branches[i];

        if (from >= 0) leaving[from].push(i);
        else if (to >= 0) arriving[to].push(i);
        else islands.push(i);
    }

    const rows: DraftRow[] = [];
    const trunkRows: number[] = [];
    const firstRows: number[] = [];
    const lastRows: number[] = [];

    const lanes = (key: string): DraftLanes => ({
        key,
        lane: 0,
        above: false,
        below: false,
        through: [],
        forks: [],
        joins: [],
        shifts: [],
    });

    const pushBranch = (index: number) => {
        const { stops, collapse } = branches[index];
        const [foldStart, foldEnd] = collapse ?? [stops.length, stops.length];
        const unfolded = expanded.has(index);
        firstRows[index] = rows.length;

        for (let j = 0; j < stops.length; j++) {
            const folded = j >= foldStart && j <= foldEnd;

            if (folded && !unfolded) {
                if (j === foldStart) {
                    rows.push({
                        kind: "hidden",
                        branch: index,
                        stops: stops.slice(foldStart, foldEnd + 1),
                        ...lanes(`hidden:${index}`),
                    });
                }

                continue;
            }

            rows.push({ kind: "stop", stop: stops[j], ...lanes(`branch:${index}:${j}`) });
        }

        lastRows[index] = rows.length - 1;
    };

    for (let i = 0; i < trunk.length; i++) {
        for (const index of arriving[i]) {
            pushBranch(index);
        }

        trunkRows.push(rows.length);
        rows.push({ kind: "stop", stop: trunk[i], ...lanes(`trunk:${i}`) });

        for (const index of leaving[i]) {
            pushBranch(index);
        }
    }

    for (const index of islands) {
        pushBranch(index);
    }

    for (let i = 0; i < trunk.length; i++) {
        rows[trunkRows[i]].above = i > 0;
        rows[trunkRows[i]].below = i < trunk.length - 1;
    }

    // the main line runs on below every stop but the last, so a variant leaving the last one has
    // to fork straight out of its dot; rejoining ahead of the first stop, or past skipped ones,
    // likewise has to come into the dot rather than merge under the variant's last stop
    const forksAtStop = branches.map((branch) => branch.from >= 0 && branch.from === trunk.length - 1);
    const skipsStops = branches.map((branch) => branch.from >= 0 && branch.to > branch.from + 1);
    const joinsAtStop = branches.map((branch, index) => branch.to === 0 || skipsStops[index]);

    const spans = branches.map((branch, index) => ({
        index,
        start: forksAtStop[index] ? trunkRows[branch.from] : firstRows[index],
        end: joinsAtStop[index] ? trunkRows[branch.to] : lastRows[index],
    }));
    spans.sort((a, b) => a.start - b.start || a.end - b.end);

    const branchLanes: number[] = [];
    const laneEnds: number[] = []; // per variant lane, the last row its current occupant takes
    for (const { index, start, end } of spans) {
        let lane = 0;
        while (lane < laneEnds.length && laneEnds[lane] > start) {
            lane++;
        }
        laneEnds[lane] = end;
        lane++;
        branchLanes[index] = lane;

        const { from, to } = branches[index];
        const first = firstRows[index];
        const last = lastRows[index];

        for (let r = first; r <= last; r++) {
            rows[r].lane = lane;
            rows[r].above = r > first || forksAtStop[index];
            rows[r].below = r < last || joinsAtStop[index];
        }

        for (let r = start + 1; r < first; r++) {
            rows[r].through.push(lane);
        }

        for (let r = last + 1; r < end; r++) {
            rows[r].through.push(lane);
        }

        if (forksAtStop[index]) rows[start].forks.push(lane);
        else if (from >= 0) rows[first].joins.push(0);

        if (joinsAtStop[index]) rows[end].joins.push(lane);
        else if (to >= 0) rows[last].forks.push(0);
    }

    const dropThrough = (row: number, lane: number) => {
        rows[row].through = rows[row].through.filter((candidate) => candidate !== lane);
    };

    // variants coming into one stop fan in a row apart, innermost first, so their curves never
    // pile onto a single dot
    for (let i = 1; i < trunk.length; i++) {
        const joining = branches.flatMap((branch, index) =>
            branch.to === i && joinsAtStop[index] ? [index] : [],
        );
        joining.sort((a, b) => branchLanes[a] - branchLanes[b]);

        for (let j = 0; j < joining.length - 1; j++) {
            const index = joining[j];
            const lane = branchLanes[index];
            const row = Math.max(trunkRows[i] - (joining.length - 1 - j), firstRows[index]);

            if (row <= lastRows[index]) {
                rows[row].below = false;
                rows[row].forks.push(0);
            } else {
                dropThrough(row, lane);
                rows[row].shifts.push({ from: lane, to: 0 });
            }

            for (let r = row + 1; r < trunkRows[i]; r++) {
                dropThrough(r, lane);
            }

            rows[trunkRows[i]].joins = rows[trunkRows[i]].joins.filter((candidate) => candidate !== lane);
        }
    }

    const trunkStart = trunkRows[0] ?? -1;
    const trunkEnd = trunkRows[trunkRows.length - 1] ?? -1;

    for (let r = trunkStart + 1; r < trunkEnd; r++) {
        if (rows[r].lane > 0) rows[r].through.push(0);
    }

    // where a variant skips main-line stops, the main line crosses over into the variant's lane
    // right under its last stop, keeping the skipped stops' dots beside their cards, and the
    // variant runs on in lane 0 until the main line bends back onto it under the last skipped
    // stop, so the stop it rejoins sits on lane 0 with the two already merged
    const mainLanes: number[] = rows.map(() => 0); // per row, the lane the main line holds down to the middle
    for (let index = 0; index < branches.length; index++) {
        if (!skipsStops[index]) continue;

        for (let r = lastRows[index] + 1; r < trunkRows[branches[index].to]; r++) {
            mainLanes[r] = Math.max(mainLanes[r], branchLanes[index]);
        }
    }

    const swapped = (lane: number, mainLane: number) => {
        if (lane === 0) return mainLane;
        if (lane === mainLane) return 0;
        return lane;
    };

    return rows.map(({ lane, above, below, through, forks, joins, shifts, ...row }, r): RouteRow => {
        const top = mainLanes[r];
        const bottom = mainLanes[r + 1] ?? 0;
        const x = swapped(lane, top);
        const exit = swapped(lane, bottom);
        const runs: LineRun[] = [];

        for (const crossing of through) {
            const from = swapped(crossing, top);
            const to = crossing === top && bottom === 0 ? from : swapped(crossing, bottom);
            const main = crossing === 0;

            if (from === to) {
                runs.push({ from, to, main });
            } else {
                runs.push({ from, to: from, half: "upper", main });
                runs.push({ from, to, half: "lower", main });
            }
        }

        for (const into of forks) {
            runs.push({ from: x, to: swapped(into, bottom), half: "lower", main: false });
        }

        for (const from of joins) {
            if (from > 0 && from === mainLanes[r - 1] && top === 0) continue; // merged under the main line already

            runs.push({ from: swapped(from, top), to: x, half: "upper", main: false });
        }

        for (const shift of shifts) {
            runs.push({ from: swapped(shift.from, top), to: swapped(shift.to, bottom), main: false });
        }

        if (below && exit !== x) {
            runs.push({ from: x, to: exit, half: "lower", main: lane === 0 });
        }

        return { ...row, lane: x, main: lane === 0, above, below: below && exit === x, runs };
    });
};

export const placementRowKey = (
    branch: number,
    position: number,
    { branches }: RouteGraphDirection,
    expanded: ReadonlySet<number>,
): string => {
    if (branch === -1) return `trunk:${position}`;

    const collapse = branches[branch]?.collapse;
    if (collapse && !expanded.has(branch) && position >= collapse[0] && position <= collapse[1]) {
        return `hidden:${branch}`;
    }

    return `branch:${branch}:${position}`;
};
