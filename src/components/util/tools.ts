export const getTime = (time: number) => {
    return new Date(time).toLocaleTimeString("pl", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getSheetHeight = () => window.innerHeight / 3 + 24;

const mapStyles: Record<string, any> = {
    default: "mapbox://styles/domeq2alt/cmc8v1vbc01p001sddiys24cv",
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

export const getMapStyle = () => {
    const style = localStorage.getItem("mapStyle")!;

    if (mapStyles[style]) return mapStyles[style];
    else return mapStyles.default;
};
