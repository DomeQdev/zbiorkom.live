import { milisecondsToTime } from "@/util/tools";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default ({ lastPing }: { lastPing: number }) => {
    const [time, setTime] = useState<string>();
    const { t } = useTranslation("Shared");

    const updateTime = () => {
        setTime(milisecondsToTime(Date.now() - lastPing, true));
    };

    useEffect(() => {
        updateTime();

        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [lastPing]);

    return (
        <>
            <b>{time}</b> {t("ago")}
        </>
    );
};
