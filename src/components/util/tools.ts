import cities, { DEFAULT_TIMEZONE } from "cities";

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

// Public transport data is keyed by the agency's local calendar day, which is not
// necessarily the device's one. The backend sends each city's timezone with /api6.
export const getCityTimezone = (city?: string) => cities[city!]?.timezone || DEFAULT_TIMEZONE;

// YYYY-MM-DD of the given instant in the city's timezone — en-CA formats as ISO.
export const getCityDate = (timestamp: number, timezone: string) =>
    new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(timestamp);

// Days since 2020-01-01, matching the backend `date` encoding for brigades
// (routeBrigades). The backend counts days in the city's timezone, so we derive the
// day index from that calendar day — this makes the value independent of the device's
// own timezone and correct across DST.
export const getDaysSince2020 = (timestamp: number, timezone: string) => {
    const [year, month, day] = getCityDate(timestamp, timezone).split("-").map(Number);

    return Math.floor(Date.UTC(year, month - 1, day) / 86400000) - 18262;
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

export const fadeColor = (hex: string, ratio: number, background = "#ffffff") => {
    const color = parseInt(hex.slice(1), 16);
    const bg = parseInt(background.slice(1), 16);

    const mix = (shift: number) => {
        const channel = (value: number) => (value >> shift) & 0xff;
        return Math.round(channel(color) * ratio + channel(bg) * (1 - ratio));
    };

    return `rgb(${mix(16)}, ${mix(8)}, ${mix(0)})`;
};

// the colour a css invert(1) hue-rotate(180deg) contrast(90%) brightness(90%) filter turns a hex into
export const darkFilterColor = (color: string): string => {
    let r = parseInt(color.slice(1, 3), 16) / 255;
    let g = parseInt(color.slice(3, 5), 16) / 255;
    let b = parseInt(color.slice(5, 7), 16) / 255;

    r = 1 - r;
    g = 1 - g;
    b = 1 - b;

    const hr = r;
    const hg = g;
    const hb = b;
    r = -0.574 * hr + 1.43 * hg + 0.144 * hb;
    g = 0.426 * hr + 0.43 * hg + 0.144 * hb;
    b = 0.426 * hr + 1.43 * hg - 0.856 * hb;

    r = ((r - 0.5) * 0.9 + 0.5) * 0.9;
    g = ((g - 0.5) * 0.9 + 0.5) * 0.9;
    b = ((b - 0.5) * 0.9 + 0.5) * 0.9;

    const channel = (value: number) =>
        Math.round(Math.min(1, Math.max(0, value)) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${channel(r)}${channel(g)}${channel(b)}`;
};

export const parseVehicleId = (id: string) => {
    const colonIdx = id.indexOf(":");
    const underscoreIdx = id.indexOf("_", colonIdx + 1);
    const vehicleType = id.slice(0, colonIdx);

    if (underscoreIdx === -1 || underscoreIdx === colonIdx + 1) {
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
