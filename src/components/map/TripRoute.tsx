import { Layer, Source } from "@vis.gl/react-maplibre";
import { ExpressionSpecification } from "maplibre-gl";
import { useMemo } from "react";
import { Shape, TripStop, ETripStop } from "typings";
import { fadeColor } from "@/util/tools";

type Props = {
    lines: Shape[];
    stops: TripStop[];
    variantLines?: Shape[]; // drawn under the lines, in the faded variant tone
    variantStops?: TripStop[];
    color: string;
};

const NO_LINES: Shape[] = [];
const NO_STOPS: TripStop[] = [];

export default ({ lines, stops, variantLines = NO_LINES, variantStops = NO_STOPS, color }: Props) => {
    // the dark map is the light one run through a css filter, so variants fade towards white on both
    const colorByVariant: ExpressionSpecification = [
        "case",
        ["get", "variant"],
        fadeColor(color, 0.5),
        color,
    ];

    const shapeGeoJSON = useMemo<GeoJSON.GeoJSON>(
        () => ({
            type: "FeatureCollection",
            features: [
                ...variantLines.map((line) => ({ ...line, properties: { variant: true } })),
                ...lines.map((line) => ({ ...line, properties: { variant: false } })),
            ],
        }),
        [lines, variantLines],
    );

    const stopsGeoJSON = useMemo<GeoJSON.GeoJSON>(() => {
        const feature = (stop: TripStop, variant: boolean): GeoJSON.Feature => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: stop[ETripStop.location],
            },
            properties: {
                id: stop[ETripStop.id],
                name: stop[ETripStop.name],
                variant,
            },
        });

        return {
            type: "FeatureCollection",
            features: [
                ...variantStops.map((stop) => feature(stop, true)),
                ...stops.map((stop) => feature(stop, false)),
            ],
        };
    }, [stops, variantStops]);

    return (
        <>
            <Source type="geojson" data={shapeGeoJSON}>
                <Layer
                    id="route"
                    type="line"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round",
                    }}
                    paint={{
                        "line-color": colorByVariant,
                        "line-width": 4,
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
                        "circle-stroke-color": colorByVariant,
                    }}
                />
                <Layer
                    id="stop-labels"
                    type="symbol"
                    minzoom={13.5}
                    layout={{
                        "text-field": ["get", "name"],
                        "text-size": 12,
                        "text-font": ["Noto Sans Bold"],
                        "text-offset": [0, 1.2],
                        "text-anchor": "top",
                    }}
                    paint={{
                        "text-color": colorByVariant,
                        "text-halo-color": "#fff",
                        "text-halo-width": 1,
                    }}
                />
            </Source>
        </>
    );
};
