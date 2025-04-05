import { memo, useEffect } from "react";
import cities from "cities";

export default memo(() => {
    useEffect(() => {
        const city = localStorage.getItem("city");

        if (city && cities[city]) window.location.replace(`/${city}`);
        else window.location.replace("/cities");
    }, []);

    return null;
});
