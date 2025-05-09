const styles: Record<string, any> = {
    default: "mapbox://styles/domeq/cm7ayfc91005c01r3f6m77mjx",
    osm: {
        version: 8,
        sources: {
            "raster-tiles": {
                type: "raster",
                tiles: [
                    "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                ],
                tileSize: 256,
            },
        },
        layers: [
            {
                id: "simple-tiles",
                type: "raster",
                source: "raster-tiles",
                minzoom: 0,
                maxzoom: 22,
            },
        ],
    },
};

export const getStyle = () => {
    const style = localStorage.getItem("mapStyle")!;

    if (styles[style]) return styles[style];
    else return styles.default;
};
