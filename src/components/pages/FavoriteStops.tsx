import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ["station"] });
            queryClient.removeQueries({ queryKey: ["stop"] });
        };
    }, [queryClient]);

    return null;
};
