import { Layer, Source } from "@vis.gl/react-maplibre";
import { useMemo } from "react";
import { ETripStop, Shape, TripStop } from "typings";

type Props = {
    shape: Shape;
    stops: TripStop[];
    color: string;
};

export default ({ shape, stops, color }: Props) => {
    const stopsGeoJSON = useMemo(
        () => ({
            type: "FeatureCollection",
            features: stops.map((stop) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: stop[ETripStop.location],
                },
                properties: {
                    id: stop[ETripStop.id],
                    color,
                    title: stop[ETripStop.name],
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
                        "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
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
