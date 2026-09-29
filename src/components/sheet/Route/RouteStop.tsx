import { ButtonBase } from "@mui/material";
import { UnfoldMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useMap } from "@vis.gl/react-maplibre";
import { ERoute, EStop, Route } from "typings";
import type { RouteRow } from "@/util/routeLayout";
import RouteTimeline from "./RouteTimeline";
import RouteBead, { Bead } from "./RouteBead";

export const ROW_HEIGHT = 56;

type Props = {
    row: RouteRow;
    route: Route;
    beads?: Bead[];
    onExpand: (branch: number) => void;
};

export default ({ row, route, beads, onExpand }: Props) => {
    const { current: map } = useMap();
    const { t } = useTranslation("Vehicle");

    return (
        <div style={{ display: "flex", height: ROW_HEIGHT, paddingRight: 12 }}>
            <RouteTimeline
                color={route[ERoute.color]}
                height={ROW_HEIGHT}
                lane={row.lane}
                main={row.main}
                gap={row.kind === "hidden"}
                above={row.above}
                below={row.below}
                runs={row.runs}
            >
                {beads?.map((bead) => (
                    <RouteBead key={bead.key} bead={bead} route={route} />
                ))}
            </RouteTimeline>

            {row.kind === "stop" && (
                <ButtonBase
                    onClick={() =>
                        map?.flyTo({
                            center: row.stop[EStop.location],
                            zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                        })
                    }
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        justifyContent: "flex-start",
                        marginY: "2px",
                        paddingX: "12px",
                        borderRadius: "4px",
                    }}
                >
                    <span
                        style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        {row.stop[EStop.code]
                            ? `${row.stop[EStop.name]} ${row.stop[EStop.code]}`
                            : row.stop[EStop.name]}
                    </span>
                </ButtonBase>
            )}

            {row.kind === "hidden" && (
                <ButtonBase
                    onClick={() => onExpand(row.branch)}
                    sx={{
                        flex: 1,
                        justifyContent: "flex-start",
                        gap: 1,
                        marginY: "2px",
                        paddingX: "12px",
                        borderRadius: "4px",
                        color: "text.secondary",
                        fontSize: 14,
                        fontWeight: 500,
                    }}
                >
                    <UnfoldMore sx={{ fontSize: 20 }} />
                    {t("showStops", { count: row.stops.length })}
                </ButtonBase>
            )}
        </div>
    );
};
