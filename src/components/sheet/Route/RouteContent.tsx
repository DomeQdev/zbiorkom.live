import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { useParams } from "react-router-dom";
import { ERoute, ERouteDirection, ERouteInfo, RouteInfo } from "typings";
import { Virtuoso } from "react-virtuoso";
import RouteStop from "./RouteStop";
import RouteActions from "./RouteActions";
import useDirectionStore from "@/hooks/useDirectionStore";
import { useShallow } from "zustand/react/shallow";

export default memo(() => {
    const direction = useDirectionStore(useShallow((state) => state.direction));
    const { city, route } = useParams();

    const { data } = useQuery<RouteInfo>({
        queryKey: ["route", city, route],
    });

    if (!data || !data[ERouteInfo.directions].length) return null;

    return (
        <Virtuoso
            data={data[ERouteInfo.directions][direction][ERouteDirection.stops]}
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            itemContent={(index, stop) => (
                <RouteStop stop={stop} color={data[ERouteInfo.route][ERoute.color]} index={index} />
            )}
            components={{
                Header: RouteActions,
            }}
        />
    );
});
