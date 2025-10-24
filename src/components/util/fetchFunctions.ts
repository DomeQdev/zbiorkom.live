export const version = import.meta.env.VITE_APP_VERSION.split(".").slice(0, 2).join(".");

export const getFromAPI = async <T>(
    city: string,
    endpoint: string,
    query: Record<string, any>,
    signal?: AbortSignal,
): Promise<T> => {
    const url = new URL(`${Gay.base}/${version}/${city}/${endpoint}`);
    Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value));
    });

    return fetch(url.toString(), { signal, credentials: "include" }).then((res) => res.json());
};

export const getFromCloudAPI = async <T>(
    endpoint: string,
    query: Record<string, any>,
    signal?: AbortSignal,
): Promise<T> => {
    const url = new URL(`${Gay.cloudBase}/${endpoint}`);
    Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value));
    });

    return fetch(url.toString(), { signal }).then((res) => res.json());
};
