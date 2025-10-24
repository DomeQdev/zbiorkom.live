import { useEffect, useState } from "react";

export default (time: number, useSeconds: boolean = false): number => {
    const getTime = () => {
        const diff = time - Date.now();
        return useSeconds ? Math.round(diff / 1000) : Math.round(diff / 60000);
    };

    const [timeValue, setTimeValue] = useState<number>(getTime());

    useEffect(() => {
        setTimeValue(getTime());

        const interval = setInterval(
            () => {
                setTimeValue(getTime());
            },
            useSeconds ? 500 : 7500,
        );

        return () => clearInterval(interval);
    }, [time, useSeconds]);

    return timeValue;
};
