export const getTime = (time: number) => {
    return new Date(time).toLocaleTimeString("pl", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getSheetHeight = () => window.innerHeight / 3 + 24;

export const getDelay = (delay?: number) => {
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

export const getDaysSince2020 = (timestamp: number) => {
    const offsetMs = new Date(timestamp).getTimezoneOffset() * 60000;

    return Math.floor((timestamp - offsetMs) / 86400000) - 18262;
};

export const polylineToGeoJson = (polyline: string) => {
    const factor = 1e6;
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

export const parseVehicleId = (id: string) => {
    const colonIdx = id.indexOf(":");
    const underscoreIdx = id.indexOf("_", colonIdx + 1);
    const vehicleType = id.slice(0, colonIdx);

    if (underscoreIdx === -1) {
        return {
            vehicleType,
            agency: "default",
            vehicleNumber: id.slice(colonIdx + 1),
        };
    }

    return {
        vehicleType,
        agency: id.slice(colonIdx + 1, underscoreIdx),
        vehicleNumber: id.slice(underscoreIdx + 1),
    };
};

export const AlightType = {
    Regular: 1 << 0,
    Forbidden: 1 << 1,
    OnDemand: 1 << 2,
    IsLastStop: 1 << 3,
} as const;

export const share = (url: string) => {
    if (navigator.share !== undefined) {
        navigator.share({
            url: url,
        });
    } else {
        navigator.clipboard.writeText(url);
    }
};
