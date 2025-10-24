import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export default () => {
    const queryClient = useQueryClient();
    const { subscribe } = useWebSocket();

    const invalidateStations = () => {
        if (document.visibilityState !== "visible") return;

        queryClient.invalidateQueries({ queryKey: ["station"] });
    };

    const invalidateStops = () => {
        if (document.visibilityState !== "visible") return;

        queryClient.invalidateQueries({ queryKey: ["stop"] });
    };

    useEffect(() => {
        const unsubscribeTrain = subscribe("trainRefresh", invalidateStations);
        const unsubscribeRefresh = subscribe("refresh", invalidateStops);

        return () => {
            unsubscribeTrain();
            unsubscribeRefresh();

            queryClient.removeQueries({ queryKey: ["station"] });
            queryClient.removeQueries({ queryKey: ["stop"] });
        };
    }, [subscribe, queryClient]);

    return null;
};
