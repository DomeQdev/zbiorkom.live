import { SvgIcon } from "@mui/material";
import { ERoute, Route } from "typings";
import Icon from "@/ui/Icon";
import { laneX, SHEET_BACKGROUND } from "./RouteTimeline";

export type Bead = {
    key: string;
    row: number; // the row drawing it: the first one at or below its progress
    progress: number; // fractional row index
    lane: number;
    depth: number; // beads of its pile ahead of it
    count?: number; // vehicles the front bead of a pile stands in for
};

type Props = {
    bead: Bead;
    route: Route;
};

// sits between the middle of the row above and the middle of its own, and glides there on every tick
export default ({ bead, route }: Props) => {
    const top = Math.min(50, Math.max(-50, (bead.progress - bead.row) * 100 + 50)); // %

    return (
        <div
            style={{
                position: "absolute",
                top: `${top}%`,
                left: laneX(bead.lane) - 15,
                marginTop: -15 - 12 * bead.depth,
                padding: 3,
                borderRadius: 15,
                backgroundColor: SHEET_BACKGROUND,
                zIndex: 10,
                transition: "top 0.6s",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: route[ERoute.color],
                }}
            >
                {bead.count === undefined && (
                    <SvgIcon sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.8)" }}>
                        <Icon type={route[ERoute.type]} />
                    </SvgIcon>
                )}

                {bead.count !== undefined && (
                    <span
                        style={{
                            fontSize: 11,
                            lineHeight: "14px",
                            fontWeight: "bold",
                            color: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        {`+${bead.count}`}
                    </span>
                )}
            </div>
        </div>
    );
};
