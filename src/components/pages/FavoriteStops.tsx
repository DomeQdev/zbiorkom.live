import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";

export default () => {
    const queryClient = useQueryClient();
    const socket = useOutletContext<Socket>();

    const invalidateStations = () => {
        queryClient.invalidateQueries({ queryKey: ["station"] });
    };

    const invalidateStops = () => {
        queryClient.invalidateQueries({ queryKey: ["stop"] });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("trainRefresh", invalidateStations);
        socket.on("refresh", invalidateStops);

        return () => {
            socket.off("trainRefresh", invalidateStations);
            socket.off("refresh", invalidateStops);

            queryClient.removeQueries({ queryKey: ["station"] });
            queryClient.removeQueries({ queryKey: ["stop"] });
        };
    }, [socket, queryClient]);

    return null;
};
