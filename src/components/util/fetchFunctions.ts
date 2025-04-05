import { Stop } from "typings";

export const fetchStopGroup = (city: string, name: string) =>
    fetchWithAuth<Stop[]>(`${Gay.base}/${city}/stops/getGroupStops?name=${encodeURIComponent(name)}`);

export async function fetchWithAuth<T>(url: string, signal?: AbortSignal, options?: RequestInit): Promise<T> {
    return fetch(url, {
        ...options,
        signal,
        credentials: "include",
    }).then((r) => (r.ok ? r.json() : Promise.reject()));
}
