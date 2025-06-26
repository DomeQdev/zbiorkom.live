import { Layer, Source } from "react-map-gl";
import { Platforms } from "typings";

export default ({ platforms, color }: { platforms: Platforms; color: string }) => {
    return (
        <Source type="geojson" data={platforms}>
            <Layer
                id="platforms"
                type="fill"
                paint={{
                    "fill-color": color,
                    "fill-opacity": 0.5,
                    "fill-outline-color": color,
                }}
                filter={[">=", ["zoom"], 13]}
            />

            <Layer
                id="platform-labels"
                type="symbol"
                layout={{
                    "text-field": ["concat", "peron ", ["get", "name"]],
                    "text-size": 12,
                    "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                    "text-anchor": "center",
                    "text-justify": "center",
                    "text-offset": [0, 0.5],
                    "text-allow-overlap": false,
                }}
                paint={{
                    "text-color": "#fff",
                    "text-halo-color": color,
                    "text-halo-width": 1,
                }}
                filter={[">=", ["zoom"], 16]}
            />
        </Source>
    );
};
