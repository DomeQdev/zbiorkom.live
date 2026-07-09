import { Layer, Source } from "@vis.gl/react-maplibre";
import { useMemo } from "react";
import { Shape, TripStop, ETripStop } from "typings";
import { BRANCH_COLOR_RATIO, fadeColor } from "@/util/tools";

type Props = {
    shape: Shape;
    stops: TripStop[];
    color: string;
    branches?: Shape[];
    branchOnlyStops?: string[];
};

export default ({ shape, stops, color, branches, branchOnlyStops }: Props) => {
    const branchColor = useMemo(() => fadeColor(color, BRANCH_COLOR_RATIO), [color]);

    // stops on the active line (shape[0]) are full color; stops served only by branches
    // are faded. same size for all — only the color changes, so nothing looks "random"
    const stopsGeoJSON: GeoJSON.GeoJSON = useMemo(() => {
        const branchOnly = new Set(branchOnlyStops);

        return {
            type: "FeatureCollection",
            features: stops.map((stop) => {
                const isBranch = branchOnly.has(stop[ETripStop.id]);

                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: stop[ETripStop.location],
                    },
                    properties: {
                        id: stop[ETripStop.id],
                        branch: isBranch,
                        color: isBranch ? branchColor : color,
                        title: stop[ETripStop.name],
                    },
                };
            }),
        };
    }, [stops, branchOnlyStops, branchColor]);

    // always mounted (empty collection when there are no branches) — a conditional
    // mount would re-add the layer on top of the stop circles when switching directions
    const branchesGeoJSON: GeoJSON.GeoJSON = useMemo(
        () => ({
            type: "FeatureCollection",
            features: branches ?? [],
        }),
        [branches],
    );

    return (
        <>
            <Source type="geojson" data={shape}>
                <Layer
                    id="route"
                    type="line"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round",
                    }}
                    paint={{
                        "line-color": color,
                        "line-width": 4,
                    }}
                />
            </Source>

            <Source type="geojson" data={branchesGeoJSON}>
                {/* beforeId keeps branches below the main line even when sources reload on direction change */}
                <Layer
                    id="route-branches"
                    type="line"
                    beforeId="route"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round",
                    }}
                    paint={{
                        "line-color": branchColor,
                        "line-width": 3,
                    }}
                />
            </Source>

            <Source type="geojson" data={stopsGeoJSON}>
                <Layer
                    id="stops"
                    type="circle"
                    paint={{
                        "circle-radius": 4.5,
                        "circle-color": "#fff",
                        "circle-stroke-width": 2.5,
                        "circle-stroke-color": ["get", "color"],
                    }}
                    layout={{
                        // active-line stops on top, so junctions read as the active line
                        "circle-sort-key": ["case", ["get", "branch"], 0, 1],
                    }}
                />
                <Layer
                    id="stop-labels"
                    type="symbol"
                    layout={{
                        "text-field": ["get", "title"],
                        "text-size": 12,
                        "text-font": ["Noto Sans Bold"],
                        "text-offset": [0, 1.5],
                        "text-anchor": "top",
                        "text-allow-overlap": false,
                    }}
                    paint={{
                        "text-color": ["get", "color"],
                        "text-halo-color": "#fff",
                        "text-halo-width": 1,
                    }}
                    filter={[">=", ["zoom"], 13.5]}
                />
            </Source>
        </>
    );
};
