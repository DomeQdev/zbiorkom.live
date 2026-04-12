import { useState, useEffect, useRef, useCallback } from "react";

type QueryLoadingState = {
    loading?: boolean;
    error?: string;
};

type EventQueryOptions = {
    enabled?: boolean;
    resetDataOnKeyChange?: boolean;
};

type EventQueryResult<T, I> = {
    data: T | undefined;
    initialData: I | undefined;
    loadingState?: QueryLoadingState;
};

export function useEventQuery<T = any, I = T>(
    city: string | undefined,
    endpoint: string,
    { enabled = true, resetDataOnKeyChange = false }: EventQueryOptions = {},
): EventQueryResult<T, I> {
    const [data, setData] = useState<T>();
    const [initialData, setInitialData] = useState<I>();
    const [isLoading, setIsLoading] = useState<boolean>(enabled);
    const [error, setError] = useState<string>();
    const [retryCount, setRetryCount] = useState(0);

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

        es.addEventListener("open", () => {
            setRetryCount(0); // Reset retry count after successful connection
        });

        es.addEventListener("initial", (event) => {
            setInitialData(JSON.parse(event.data) as I);
        });

        es.addEventListener("message", (event) => {
            setData(JSON.parse(event.data) as T);
            setIsLoading(false);
        });

        es.addEventListener("errorCode", (event) => {
            setError(JSON.parse(event.data));
            setIsLoading(false);
            es.close();
        });

        es.addEventListener("error", () => {
            if (retryCount < 5) {
                setRetryCount((prev) => prev + 1);
            } else {
                setError("NETWORK_ERROR");
                setIsLoading(false);
            }
            es.close();

            // Allow retry if not hidden and enabled, using retry count for backoff if you want later
            if (!document.hidden && enabled) {
                setTimeout(() => {
                    if (!document.hidden && enabled && esRef.current !== es) {
                        // Simple guard
                        connect();
                    }
                }, 2000);
            }
        });
    }, [city, endpoint, enabled, retryCount]);

    useEffect(() => {
        connect();

        return () => {
            if (esRef.current) {
                esRef.current.close();
                esRef.current = null;
            }
        };
    }, [connect]);

    // Handle visibility changes to suspend connection when app is backgrounded
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (esRef.current) {
                    esRef.current.close();
                    esRef.current = null;
                }
            } else {
                connect();
            }
        };

        const handleFocus = () => {
            if (!esRef.current) connect();
        };

        const handleBlur = () => {
            if (esRef.current) {
                esRef.current.close();
                esRef.current = null;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, [connect]);

    // Cleanup keys and data if component parameters changed and reset requested
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
