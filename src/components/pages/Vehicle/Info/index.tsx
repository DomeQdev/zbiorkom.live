import { useParams } from "react-router-dom";
import useGoBack from "@/hooks/useGoBack";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Typography } from "@mui/material";
import { useMemo, useRef } from "react";
import Sticky from "@/ui/Sticky";
import { Close } from "@mui/icons-material";
import VehicleInfo from "./VehicleInfo";
import { useTranslation } from "react-i18next";
import VehicleImage from "./VehicleImage";
import useQueryVehicleInfo from "@/hooks/useQueryVehicleInfo";
import { EVehicleInfo } from "typings";

export default () => {
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const { city, vehicle } = useParams();
    const goBack = useGoBack();
    const { t } = useTranslation("Vehicle");

    const { data, isLoading } = useQueryVehicleInfo({
        city: window.location.search.includes("pkp") ? "pkp" : city!,
        vehicle: vehicle!,
    });

    const imageHeight = useMemo(() => {
        if (!scrollContainer.current) return 0;
        return scrollContainer.current.clientWidth * 0.5225;
    }, [scrollContainer.current]);

    const name = `#${vehicle?.split("/")[1]} ${data?.[EVehicleInfo.model] || ""}`;

    return (
        <Dialog
            open
            fullWidth
            onClose={() => goBack()}
            sx={{
                zIndex: 5001,
                "& .MuiDialog-container": {
                    height: undefined,
                    overflow: "visible",
                },
                "& .MuiDialog-paper": {
                    overflow: "visible",
                },
                "& .MuiDialogContent-root": {
                    overflowY: "visible",
                    WebkitOverflowScrolling: "touch",
                },
            }}
        >
            <Sticky scrollContainer={scrollContainer} element={elementRef}>
                {(percent) => (
                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            boxShadow:
                                percent > 0.5
                                    ? "0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                                    : undefined,
                            transition: "box-shadow .3s",
                        }}
                        variant="body1"
                    >
                        <IconButton onClick={() => goBack()}>
                            <Close />
                        </IconButton>
                        <span style={{ opacity: percent }}>{name}</span>
                    </DialogTitle>
                )}
            </Sticky>

            <DialogContent
                ref={scrollContainer}
                sx={{
                    p: 0,
                    pointerEvents: !data ? "none" : undefined,
                    overflow: !data ? "hidden" : "auto",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="500"
                    ref={elementRef}
                    sx={{
                        padding: "16px",
                        marginBottom: "16px",
                    }}
                >
                    {name}
                </Typography>

                {data && <VehicleInfo vehicle={data} />}

                {data === null && (
                    <p
                        style={{
                            paddingLeft: 16,
                        }}
                    >
                        {t("noVehicleInfo")}
                    </p>
                )}

                {data && <VehicleImage hash={data[EVehicleInfo.imageHash]} imageHeight={imageHeight} />}

                {isLoading && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.25,
                            margin: 2,
                        }}
                    >
                        {new Array(3).fill(0).map((_, i) => (
                            <Skeleton
                                key={`skelet${i}`}
                                height={56}
                                variant="rectangular"
                                sx={{
                                    borderRadius: 0.5,
                                    borderTopLeftRadius: i === 0 ? 24 : undefined,
                                    borderTopRightRadius: i === 0 ? 24 : undefined,
                                    borderBottomLeftRadius: i === 2 ? 24 : undefined,
                                    borderBottomRightRadius: i === 2 ? 24 : undefined,
                                }}
                            />
                        ))}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};
