import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { ArrowBack, CheckCircleOutline, OpenInNew, Warning } from "@mui/icons-material";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert as AlertTuple, EAlert } from "typings";
import useGoBack from "@/hooks/useGoBack";
import Sticky from "@/ui/Sticky";
import Alert from "@/ui/Alert";
import Markdown from "@/ui/Markdown";
import useVehicleStore from "@/hooks/useVehicleStore";
import { getCityFromUrl, getCityTimezone } from "@/util/tools";

const ALERT_BACKGROUND = "#463a00";
const ALERT_TEXT = "#ffe082";

export default () => {
    const alerts = useVehicleStore((state) => state.alerts);
    const { t } = useTranslation("Vehicle");
    const { city } = useParams();
    const goBack = useGoBack();

    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);

    const timezone = getCityTimezone(getCityFromUrl(city));

    return (
        <Dialog open onClose={goBack} fullWidth>
            <Sticky scrollContainer={scrollContainer} element={elementRef}>
                {(percent) => (
                    <DialogTitle
                        sx={{
                            boxShadow:
                                percent > 0.5
                                    ? "0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                                    : undefined,
                            transition: "box-shadow .3s",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <IconButton onClick={() => goBack({ ignoreState: true })}>
                                <ArrowBack />
                            </IconButton>

                            <span
                                style={{
                                    opacity: percent,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                }}
                            >
                                {t("alerts")}
                            </span>
                        </div>
                    </DialogTitle>
                )}
            </Sticky>

            <DialogContent
                sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
                ref={scrollContainer}
            >
                <Typography
                    variant="h5"
                    fontWeight="500"
                    ref={elementRef}
                    sx={{
                        gap: 1,
                        padding: "16px",
                    }}
                >
                    {t("alerts")}
                </Typography>

                {!alerts.length && (
                    <Alert
                        Icon={CheckCircleOutline}
                        title={t("alertsEmpty")}
                        description={t("alertsEmptyDescription")}
                        color="success"
                        sx={{ height: "auto", paddingBottom: 4 }}
                    />
                )}

                {alerts.map((alert, index) => (
                    <AlertCard key={`${alert[EAlert.title]}-${index}`} alert={alert} timezone={timezone} />
                ))}
            </DialogContent>
        </Dialog>
    );
};

const AlertCard = ({ alert, timezone }: { alert: AlertTuple; timezone: string }) => {
    const { t, i18n } = useTranslation("Vehicle");

    const formatMoment = (timestamp: number) =>
        new Intl.DateTimeFormat(i18n.language, {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: timezone,
        }).format(timestamp);

    const activeFrom = alert[EAlert.activeFrom];
    const activeUntil = alert[EAlert.activeUntil];
    const publishedAt = alert[EAlert.publishedAt];
    const description = alert[EAlert.description];
    const url = alert[EAlert.url];

    let validity: string | undefined;
    if (activeFrom && activeUntil) validity = `${formatMoment(activeFrom)} – ${formatMoment(activeUntil)}`;
    else if (activeFrom) validity = t("alertsFrom", { moment: formatMoment(activeFrom) });
    else if (activeUntil) validity = t("alertsUntil", { moment: formatMoment(activeUntil) });
    else if (publishedAt) validity = t("alertsPublished", { moment: formatMoment(publishedAt) });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                padding: 2,
                borderRadius: "20px",
                backgroundColor: ALERT_BACKGROUND,
                color: ALERT_TEXT,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Warning fontSize="small" />

                <Typography variant="subtitle1" fontWeight="500" sx={{ flex: 1, lineHeight: 1.3 }}>
                    {alert[EAlert.title]}
                </Typography>
            </Box>

            {validity && (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {validity}
                </Typography>
            )}

            {!!description && <Markdown content={description} />}

            {!!url && (
                <Button
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                    sx={{ alignSelf: "flex-start", marginLeft: -1, color: "inherit" }}
                >
                    {t("alertsDetails")}
                </Button>
            )}
        </Box>
    );
};
