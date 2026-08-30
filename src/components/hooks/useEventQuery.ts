import { useState, useEffect, useRef, useCallback } from "react";

type QueryLoadingState = {
    loading?: boolean;
    error?: string;
};

type EventQueryOptions = {
    enabled?: boolean;
    resetDataOnKeyChange?: boolean;
    resetKey?: any;
};

type EventQueryResult<T, I> = {
    data: T | undefined;
    initialData: I | undefined;
    loadingState?: QueryLoadingState;
};

export function useEventQuery<T = any, I = T>(
    city: string | undefined,
    endpoint: string,
    { enabled = true, resetDataOnKeyChange = false, resetKey }: EventQueryOptions = {},
): EventQueryResult<T, I> {
    const [data, setData] = useState<T>();
    const [initialData, setInitialData] = useState<I>();
    const [isLoading, setIsLoading] = useState<boolean>(enabled);
    const [error, setError] = useState<string>();

    const [prevResetKey, setPrevResetKey] = useState(resetKey);
    if (resetKey !== prevResetKey) {
        setPrevResetKey(resetKey);
        setData(undefined);
        setInitialData(undefined);
    }

    // Use ref instead of state to prevent recreational loop of the connect function
    const retryCount = useRef(0);
    const esRef = useRef<EventSource | null>(null);

    const connect = useCallback(() => {
        if (!enabled || !city || document.hidden) {
            if (esRef.current) {
                esRef.current.close();
                esRef.current = null;
            }
            if (!enabled || !city) setIsLoading(false);
            return;
        }

        if (esRef.current) {
            esRef.current.close();
        }

        setIsLoading(true);
        setError(undefined);

        const url = `${Gay.base}/api6/${city}/${endpoint}`;
        const es = new EventSource(url);
        esRef.current = es;

        let terminalError = false;

        const parseErrorData = (raw: string): string => {
            try {
                const parsed = JSON.parse(raw);
                return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
            } catch {
                return raw;
            }
        };

        es.addEventListener("open", () => {
            retryCount.current = 0;
        });

        es.addEventListener("initial", (event: any) => {
            try {
                setInitialData(JSON.parse(event.data) as I);
                setIsLoading(false);
            } catch {
                terminalError = true;
                setError("PARSE_ERROR");
                setIsLoading(false);
                es.close();
            }
        });

        es.addEventListener("message", (event: any) => {
            try {
                setData(JSON.parse(event.data) as T);
                setIsLoading(false);
            } catch {
                terminalError = true;
                setError("PARSE_ERROR");
                setIsLoading(false);
                es.close();
            }
        });

        es.addEventListener("errorCode", (event: any) => {
            terminalError = true;
            setError(parseErrorData(event.data));
            setIsLoading(false);
            es.close();
        });

        es.addEventListener("error", () => {
            if (terminalError) {
                es.close();
                return;
            }

            if (retryCount.current < 5) {
                retryCount.current++;
            } else {
                setError("NETWORK_ERROR");
                setIsLoading(false);
            }
            es.close();

            if (!document.hidden && enabled && retryCount.current < 5) {
                setTimeout(() => {
                    if (!document.hidden && enabled && esRef.current !== es) {
                        connect();
                    }
                }, 2000);
            }
        });
    }, [city, endpoint, enabled]);

    useEffect(() => {
        connect();

        return () => {
            if (esRef.current) {
                esRef.current.close();
                esRef.current = null;
            }
            // Temporarily removed clear data if endpoint/params change to avoid flickering
            if (resetDataOnKeyChange) {
                // Keep this only for specific cases, usually we rely on resetKey
            }
        };
    }, [connect, resetDataOnKeyChange]);

    useEffect(() => {
        let hideTimeout: ReturnType<typeof setTimeout> | null = null;
        const HIDE_GRACE_MS = 45_000;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (hideTimeout) clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    if (document.hidden && esRef.current) {
                        esRef.current.close();
                        esRef.current = null;
                    }
                }, HIDE_GRACE_MS);
            } else {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                if (!esRef.current) connect();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [connect]);

    useEffect(() => {
        if (enabled) return;

        if (resetDataOnKeyChange) {
            setData(undefined);
            setInitialData(undefined);
        }
    }, [city, endpoint, enabled, resetDataOnKeyChange]);

    return {
        data: error ? undefined : data,
        initialData: error ? undefined : initialData,
        loadingState: isLoading || error ? { loading: isLoading || undefined, error } : undefined,
    };
}
