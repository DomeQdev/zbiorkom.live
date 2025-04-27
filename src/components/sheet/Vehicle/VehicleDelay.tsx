import { useTranslation } from "react-i18next";
import { DelayType } from "typings";
import { GpsFixed, GpsOff } from "@mui/icons-material";

export default ({ delay, showGPS }: { delay: DelayType; showGPS?: boolean }) => {
    const [delayClass, delayMinutes] = getDelay(delay);
    const { t } = useTranslation("Vehicle");

    const showFixedGPS =
        (showGPS !== false && delay === "live") || (showGPS === true && delay !== "scheduled");
    const showOffGPS = delay === "scheduled" || showGPS === false;

    return (
        <span className={`delay delay-${delayClass}`}>
            {showFixedGPS && <GpsFixed fontSize="small" />}
            {showOffGPS && <GpsOff fontSize="small" />}

            {delay === "departed"
                ? t("departed")
                : delay === "departure"
                ? t("departure")
                : delay === "cancelled"
                ? t("cancelled")
                : delay === "live"
                ? t("live")
                : delay === "scheduled"
                ? t("scheduled")
                : delayMinutes
                ? t(delay > 0 ? "delayed" : "early", { minutes: delayMinutes })
                : t("onTime")}
        </span>
    );
};

export const getDelay = (delay?: DelayType) => {
    const isNumber = typeof delay === "number";
    const delayMinutes = isNumber && Math.floor(Math.abs(delay) / 60000);

    return [
        isNumber ? (delayMinutes ? (delay > 0 ? "delayed" : "early") : "none") : "unknown",
        delayMinutes,
    ] as const;
};
