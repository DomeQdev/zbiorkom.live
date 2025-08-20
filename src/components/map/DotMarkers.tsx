import { Layer, LayerProps, Source } from "@vis.gl/react-maplibre";
import { useMemo } from "react";
import { DotVehicle, EDotVehicle } from "typings";

export default ({ vehicles }: { vehicles: DotVehicle[] }) => {
    const geojsonData = useMemo(
        () => ({
            type: "FeatureCollection",
            features: vehicles.map((vehicle) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: vehicle[EDotVehicle.location],
                },
                properties: {
                    color: vehicle[EDotVehicle.routeColor],
                },
            })),
        }),
        [vehicles]
    );

    const layerStyle: LayerProps = {
        id: "dots",
        type: "circle",
        paint: {
            "circle-radius": 4,
            "circle-color": ["get", "color"],
        },
    };

    return (
        <Source type="geojson" data={geojsonData}>
            <Layer {...layerStyle} />
        </Source>
    );
};
