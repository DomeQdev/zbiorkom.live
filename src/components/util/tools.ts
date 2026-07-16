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

// Public transport data is keyed by the agency's local calendar day (Poland).
export const AGENCY_TIMEZONE = "Europe/Warsaw";

// Days since 2020-01-01, matching the backend `date` encoding for brigades
// (routeBrigades). The backend counts days in the agency timezone, so we derive
// the day index from the Warsaw calendar day — this makes the value independent
// of the device's own timezone and correct across DST.
export const getDaysSince2020 = (timestamp: number) => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: AGENCY_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(timestamp);

    const get = (type: string) => +parts.find((part) => part.type === type)!.value;

    return Math.floor(Date.UTC(get("year"), get("month") - 1, get("day")) / 86400000) - 18262;
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

// how much of the route color branch (variant) lines/stops keep — shared by the map and the sheet
export const BRANCH_COLOR_RATIO = 0.55;

export const fadeColor = (hex: string, ratio: number, background = "#ffffff") => {
    const color = parseInt(hex.slice(1), 16);
    const bg = parseInt(background.slice(1), 16);

    const mix = (shift: number) => {
        const channel = (value: number) => (value >> shift) & 0xff;
        return Math.round(channel(color) * ratio + channel(bg) * (1 - ratio));
    };

    return `rgb(${mix(16)}, ${mix(8)}, ${mix(0)})`;
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

export const getCityFromUrl = (routeCity?: string): string => {
    const fromQuery = new URLSearchParams(window.location.search).get("city");
    return fromQuery || routeCity || "";
};

export const buildCitySuffix = (entityCity: string | undefined, routeCity: string | undefined): string => {
    if (!entityCity || entityCity === routeCity) return "";
    return `?city=${encodeURIComponent(entityCity)}`;
};

export const share = (url: string) => {
    if (navigator.share !== undefined) {
        navigator.share({
            url: url,
        });
    } else {
        navigator.clipboard.writeText(url);
    }
};
