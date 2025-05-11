import { useQuery } from "@tanstack/react-query";
import { NominatimPlace } from "typings";

const timeout = 300;

export const useQueryGeocode = (query: string) => {
    return useQuery({
        queryKey: ["geocode", query],
        queryFn: async ({ signal }) => {
            if (!query) return [];

            await new Promise((resolve) => setTimeout(resolve, timeout));
            if (signal.aborted) return;

            const params = new URLSearchParams();
            params.append("q", query);
            params.append("format", "json");
            params.append("addressdetails", "1");
            params.append("countrycodes", "pl");

            return fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
                headers: {
                    "Accept-Language": "pl",
                },
            })
                .then((res) => res.json() as Promise<NominatimPlace[]>)
                .catch(() => []);
        },
    });
};
