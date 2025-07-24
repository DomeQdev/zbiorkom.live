import { DelayType } from "typings";

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

export const getDelay = (delay?: DelayType) => {
    const isNumber = typeof delay === "number";
    const delayTime = msToTime(isNumber ? Math.abs(delay) : 0);

    return [
        isNumber ? (delayTime ? (delay > 0 ? "delayed" : "early") : "none") : "unknown",
        delayTime,
    ] as const;
};

export const msToTime = (ms: number, withSeconds?: boolean) => {
    let formattedTime: string[] = [];

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    if (hours > 0) formattedTime.push(`${hours} h`);
    if (remainingMinutes > 0) formattedTime.push(`${remainingMinutes} min`);
    if (withSeconds) formattedTime.push(`${remainingSeconds} s`);

    return formattedTime.join(" ");
};

export const polylineToGeoJson = (polyline: string) => {
    const factor = Math.pow(10, +polyline[1]);
    polyline = polyline.slice(3);

    let index = 0;
    let lat = 0;
    let lng = 0;

    const geoJson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [],
        },
        properties: {},
    };

    while (index < polyline.length) {
        let b;
        let shift = 0;
        let result = 0;

        do {
            b = polyline.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        lat += (result >> 1) ^ -(result & 1);

        shift = 0;
        result = 0;

        do {
            b = polyline.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        lng += (result >> 1) ^ -(result & 1);

        geoJson.geometry.coordinates.push([lng / factor, lat / factor]);
    }

    return geoJson;
};
