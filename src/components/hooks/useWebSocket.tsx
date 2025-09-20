import { createContext, useContext, useEffect, useRef, useCallback, ReactNode, useMemo } from "react";
import { version } from "@/util/fetchFunctions";
import { useParams } from "react-router-dom";

type EventType = "refresh" | "trainRefresh";
type Callback = () => void;
type Unsubscribe = () => void;

interface WebSocketContextType {
    subscribe: (event: EventType, callback: Callback) => Unsubscribe;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { city } = useParams<{ city: string }>();

    const reconnectTimeout = useRef<number | null>(null);
    const ws = useRef<WebSocket | null>(null);

    const subscribers = useRef(
        new Map<EventType, Set<Callback>>([
            ["refresh", new Set()],
            ["trainRefresh", new Set()],
        ])
    );

    const connect = useCallback(() => {
        if (!city) return;
        if (ws.current && ws.current.readyState < 2) return;

        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }

        ws.current = new WebSocket(`${Gay.base.replace("http", "ws")}/${version}/${city}/ws`);

        ws.current.onmessage = (event) => {
            subscribers.current.get(event.data)?.forEach((callback) => callback());
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected. Reconnecting in 5s...");
            reconnectTimeout.current = window.setTimeout(connect, 5000);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            ws.current?.close();
        };
    }, [city]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

            if (ws.current) {
                ws.current.onclose = null;
                ws.current.close();
                ws.current = null;
            }
        };
    }, [connect, city]);

    const subscribe = useCallback((event: EventType, callback: Callback): Unsubscribe => {
        subscribers.current.get(event)?.add(callback);

        return () => {
            subscribers.current.get(event)?.delete(callback);
        };
    }, []);

    const contextValue = useMemo(() => ({ subscribe }), [subscribe]);

    return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }

    return context;
};
