import { useTranslation } from "react-i18next";
import { EStopDepartureStatus } from "typings";
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

    const showFixedGPS = showGPS === true && status !== EStopDepartureStatus.Scheduled;
    const showOffGPS = status === EStopDepartureStatus.Scheduled;

    const isLiveStatus =
        status !== EStopDepartureStatus.Cancelled && status !== EStopDepartureStatus.Scheduled;
    const visualClass = isLiveStatus ? delayClass : "unknown";

    return (
        <span className={`delay delay-${visualClass}`}>
            {showFixedGPS && <GpsFixed fontSize="small" />}
            {showOffGPS && <GpsOff fontSize="small" />}

            {status === EStopDepartureStatus.Cancelled
                ? t("cancelled")
                : status === EStopDepartureStatus.Scheduled
                  ? t("scheduled")
                  : delayTime
                    ? t(delay > 0 ? "delayed" : "early", { time: delayTime })
                    : t("onTime")}
        </span>
    );
};
