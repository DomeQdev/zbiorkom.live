import { City } from "./typings";

export const DEFAULT_TIMEZONE = "Europe/Warsaw";
export const DEFAULT_LOCATION: City["location"] = [21.0122, 52.2297];

const REQUEST_TIMEOUT = 10_000; // ms
const CONNECTIVITY_TIMEOUT = 5_000; // ms
const CONNECTIVITY_CHECK_URL = "https://www.gstatic.com/generate_204";

export type BackendErrorKind = "network" | "server" | "unknown";

export class BackendError extends Error {
    constructor(public kind: BackendErrorKind) {
        super(kind);
        this.name = "BackendError";
    }
}

const cities: Record<string, City> = {};
export const cityList: City[] = [];

const timedFetch = (url: string, timeout: number, init?: RequestInit) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    return fetch(url, { ...init, signal: controller.signal, cache: "no-store" }).finally(() =>
        clearTimeout(timer),
    );
};

// Tells a dead backend apart from a dead connection — the probe is opaque (no-cors), so it only
// says whether anything at all left the device.
export const isOnline = async (): Promise<boolean> => {
    if (navigator.onLine === false) return false;

    try {
        await timedFetch(CONNECTIVITY_CHECK_URL, CONNECTIVITY_TIMEOUT, { mode: "no-cors" });
        return true;
    } catch {
        return false;
    }
};

export const loadCities = async () => {
    let res: Response;

    try {
        res = await timedFetch(`${Gay.base}/api6`, REQUEST_TIMEOUT);
    } catch {
        throw new BackendError((await isOnline()) ? "server" : "network");
    }

    let data: { cities?: any[]; error?: string };

    try {
        data = await res.json();
    } catch {
        throw new BackendError("server");
    }

    if (data.error || !res.ok || !data.cities?.length) throw new BackendError("server");

    for (const id of Object.keys(cities)) delete cities[id];
    cityList.length = 0;

    for (const c of data.cities) {
        const city: City = {
            id: c.id,
            name: c.name,
            description: c.description,
            location: c.location,
            timezone: c.timezone || DEFAULT_TIMEZONE,
            agencies: c.agencies,
            virtual: c.virtual,
        };

        cities[c.id] = city;
        cityList.push(city);
    }
};

export default cities;
