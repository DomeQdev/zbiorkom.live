import { Layer, Source } from "@vis.gl/react-maplibre";
import { useMemo } from "react";
import { Shape, ItineraryStop, EItineraryStop, EStop } from "typings";

type Props = {
    shape: Shape;
    stops: ItineraryStop[];
    color: string;
};

export default ({ shape, stops, color }: Props) => {
    const stopsGeoJSON: GeoJSON.GeoJSON = useMemo(
        () => ({
            type: "FeatureCollection",
            features: stops.map((stop) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: stop[EItineraryStop.stop][EStop.location],
                },
                properties: {
                    id: stop[EItineraryStop.stop][EStop.id],
                    color,
                    title: stop[EItineraryStop.stop][EStop.name],
                },
            })),
        }),
        [stops],
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

            <Source type="geojson" data={stopsGeoJSON}>
                <Layer
                    id="stops"
                    type="circle"
                    paint={{
                        "circle-radius": 4.5,
                        "circle-color": "#fff",
                        "circle-stroke-width": 2.5,
                        "circle-stroke-color": color,
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
                        "text-color": color,
                        "text-halo-color": "#fff",
                        "text-halo-width": 1,
                    }}
                    filter={[">=", ["zoom"], 13.5]}
                />
            </Source>
        </>
    );
};
