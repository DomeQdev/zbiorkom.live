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
    const delayTime = milisecondsToTime(isNumber ? Math.abs(delay) : 0);

    return [
        isNumber ? (delayTime ? (delay > 0 ? "delayed" : "early") : "none") : "unknown",
        delayTime,
    ] as const;
};

export const milisecondsToTime = (ms: number) => {
    let formattedTime: string[] = [];

    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;

    if (hours > 0) formattedTime.push(`${hours} h`);
    if (remainingMinutes > 0) formattedTime.push(`${remainingMinutes} min`);

    return formattedTime.join(" ");
};
