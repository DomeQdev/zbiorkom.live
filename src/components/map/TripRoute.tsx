import { Layer, Source } from "@vis.gl/react-maplibre";
import { useMemo } from "react";
import { Shape, TripStop, ETripStop } from "typings";

export type TripRouteVariant = { shape: Shape; stops: TripStop[]; color: string };

type Props = {
    shape: Shape;
    stops: TripStop[];
    color: string;
    variants?: TripRouteVariant[];
};

export default ({ shape, stops, color, variants }: Props) => {
    // every stop carries the colour of the line it sits on — the route colour on the trunk, the variant's
    // own colour on a variant — which is exactly what the sheet paints, so the two views read alike
    const stopsGeoJSON: GeoJSON.GeoJSON = useMemo(() => {
        const feature = (stop: TripStop, stopColor: string, variant: boolean): GeoJSON.Feature => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: stop[ETripStop.location],
            },
            properties: {
                id: stop[ETripStop.id],
                branch: variant,
                color: stopColor,
                title: stop[ETripStop.name],
            },
        });

        return {
            type: "FeatureCollection",
            features: [
                ...(variants ?? []).flatMap((variant) =>
                    variant.stops.map((stop) => feature(stop, variant.color, true)),
                ),
                ...stops.map((stop) => feature(stop, color, false)),
            ],
        };
    }, [stops, variants, color]);

    // always mounted (empty collection when there are no variants) — a conditional
    // mount would re-add the layer on top of the stop circles when switching directions
    const variantsGeoJSON: GeoJSON.GeoJSON = useMemo(
        () => ({
            type: "FeatureCollection",
            features: (variants ?? []).map((variant) => ({
                ...variant.shape,
                properties: { ...variant.shape.properties, color: variant.color },
            })),
        }),
        [variants],
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

            <Source type="geojson" data={variantsGeoJSON}>
                {/* beforeId keeps variants below the main line even when sources reload on direction change */}
                <Layer
                    id="route-branches"
                    type="line"
                    beforeId="route"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round",
                    }}
                    paint={{
                        "line-color": ["get", "color"],
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
