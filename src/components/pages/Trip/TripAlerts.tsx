import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ReactNode, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { EStopUpdate, ETrip, ETripStop } from "typings";
import Sticky from "@/ui/Sticky";

import useGoBack from "@/hooks/useGoBack";
import useQueryTrip from "@/hooks/useQueryTrip";
import useQueryTripUpdate from "@/hooks/useQueryTripUpdate";

export default () => {
    const { city, trip } = useParams();
    const { t } = useTranslation("Vehicle");
    const goBack = useGoBack();

    const cityId = window.location.search.includes("pkp") ? "pkp" : city!;
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);

    const { data: tripData } = useQueryTrip({
        city: cityId,
        trip: trip!,
    });

    const { data: tripUpdate } = useQueryTripUpdate({
        city: cityId,
        trip: trip!,
    });

    const alerts = useMemo(() => {
        if (!tripData || !tripUpdate?.stops) return [];

        const alerts: [string, string[]][] = [];

        for (let i = 0; i < tripUpdate.stops.length; i++) {
            const stop = tripUpdate.stops[i];
            const stopAlerts = stop[EStopUpdate.alerts];

            if (!stopAlerts?.length) continue;

            const stopName = tripData.trip!?.[ETrip.stops][i][ETripStop.name];
            alerts.push([stopName, stopAlerts]);
        }

        return alerts;
    }, [tripData, tripUpdate]);

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

                {alerts.map((alert) => (
                    <Box
                        key={alert[0]}
                        sx={{
                            backgroundColor: "background.paper",
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            "& .MuiTypography-body2": {
                                py: 1,
                            },
                        }}
                    >
                        <Typography variant="h6" textAlign="center">
                            {alert[0]}
                        </Typography>

                        {alert[1]
                            .map<ReactNode>((alertText, i) => (
                                <Typography key={`${alert[0]}${i}`} variant="body2">
                                    {alertText}
                                </Typography>
                            ))
                            .reduce((prev, curr, i) => [
                                prev,
                                <Divider key={`${alert[0]}divider${i}`} />,
                                curr,
                            ])}
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};
