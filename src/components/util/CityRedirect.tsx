import { memo, useEffect } from "react";
import cities from "cities";
import useBackendStore from "@/hooks/useBackendStore";

export default memo(() => {
    const ready = useBackendStore((state) => state.status === "ready");

    useEffect(() => {
        if (!ready) return;

        const city = localStorage.getItem("city");

        if (city && cities[city]) window.location.replace(`/${city}`);
        else window.location.replace("/cities");
    }, [ready]);

    return null;
});
