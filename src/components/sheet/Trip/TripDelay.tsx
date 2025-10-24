import { useTranslation } from "react-i18next";
import { DelayType } from "typings";
import { GpsFixed, GpsOff } from "@mui/icons-material";
import { getDelay } from "@/util/tools";

export default ({ delay, showGPS }: { delay: DelayType; showGPS?: boolean }) => {
    const [delayClass, delayTime] = getDelay(delay);
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
                        : delayTime
                          ? t(delay > 0 ? "delayed" : "early", { time: delayTime })
                          : t("onTime")}
        </span>
    );
};
