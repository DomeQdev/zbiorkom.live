import { useTranslation } from "react-i18next";
import { DelayType, EStopDepartureStatus } from "typings";
import { GpsFixed, GpsOff } from "@mui/icons-material";
import { getDelay } from "@/util/tools";

export default ({
    delay,
    status,
    showGPS,
}: {
    delay: number;
    status: EStopDepartureStatus;
    showGPS?: boolean;
}) => {
    const [delayClass, delayTime] = getDelay(delay);
    const { t } = useTranslation("Vehicle");

    const showFixedGPS =
        (showGPS !== false && status === EStopDepartureStatus.OnPreviousTrip) ||
        (showGPS === true && status !== EStopDepartureStatus.Scheduled);
    const showOffGPS = status === EStopDepartureStatus.Scheduled || showGPS === false;

    return (
        <span className={`delay delay-${delayClass}`}>
            {showFixedGPS && <GpsFixed fontSize="small" />}
            {showOffGPS && <GpsOff fontSize="small" />}

            {delay === "departed"
                ? t("departed")
                : delay === "departure"
                  ? t("departure")
                  : status === EStopDepartureStatus.Cancelled
                    ? t("cancelled")
                    : status === EStopDepartureStatus.OnPreviousTrip
                      ? t("live")
                      : status === EStopDepartureStatus.Scheduled
                        ? t("scheduled")
                        : delayTime
                          ? t(delay > 0 ? "delayed" : "early", { time: delayTime })
                          : t("onTime")}
        </span>
    );
};
