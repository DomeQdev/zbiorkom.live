import useGoBack from "@/hooks/useGoBack";
import useVehicleStore from "@/hooks/useVehicleStore";
import { AirlineSeatReclineNormal, ArrowRightAlt, Close, Flare } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import getSunExposure from "./getSunExposure";
import Bus from "./Bus";
import SunPercentage from "./SunPercentage";
import { ETrip } from "typings";

export default () => {
    const { t } = useTranslation("Sun");
    const goBack = useGoBack();

    const shape = useVehicleStore((state) => state.trip?.[ETrip.shape]);

    const sunExposure = useMemo(() => {
        if (!shape) return null;

        return getSunExposure(shape);
    }, [shape]);

    if (!shape || !sunExposure) return null;

    return (
        <Dialog open onClose={() => goBack()} fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <IconButton onClick={() => goBack()}>
                    <Close />
                </IconButton>
                {t("sunPosition")}
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ArrowRightAlt />
                    {t("travelDirection")}
                    <ArrowRightAlt />
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        "& > div": {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                        },
                    }}
                >
                    <Box>
                        <SunPercentage percent={sunExposure.exposurePercentages.left} />
                    </Box>
                    <Box>
                        <SunPercentage percent={sunExposure.exposurePercentages.back} />
                        <Bus />
                        <SunPercentage percent={sunExposure.exposurePercentages.front} />
                    </Box>
                    <Box>
                        <SunPercentage percent={sunExposure.exposurePercentages.right} />
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AirlineSeatReclineNormal />

                    <span>
                        <Trans
                            i18nKey={`bestSide.${sunExposure.bestSideType}`}
                            t={t}
                            components={{
                                bold: <strong />,
                            }}
                            values={{
                                direction: t(sunExposure.bestSide),
                            }}
                        />
                    </span>
                </Typography>
            </DialogContent>
        </Dialog>
    );
};
