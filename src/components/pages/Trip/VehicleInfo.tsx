import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { BusinessOutlined, CalendarMonth, Close, Commute, Dangerous, Garage } from "@mui/icons-material";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { EVehicle, EVehicleInfo } from "typings";
import useGoBack from "@/hooks/useGoBack";
import useQueryVehicleInfo from "@/hooks/useQueryVehicleInfo";
import useVehicleStore from "@/hooks/useVehicleStore";
import Alert from "@/ui/Alert";
import Loading from "@/ui/Loading";
import Sticky from "@/ui/Sticky";

export default () => {
    const vehicle = useVehicleStore((state) => state.vehicle);
    const scrollContainer = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("VehicleInfo");
    const goBack = useGoBack();

    const { data, isLoading } = useQueryVehicleInfo({
        city: vehicle?.[EVehicle.city],
        vehicle: vehicle?.[EVehicle.id],
    });

    const imageHeight = useMemo(() => {
        if (!scrollContainer.current) return 0;
        return scrollContainer.current.clientWidth * 0.5225;
    }, [scrollContainer.current]);

    const [image, setImage] = useState<{ url: string; author?: string; loading?: boolean }>();

    useEffect(() => {
        if (!data?.[EVehicleInfo.imageHash]) return;

        fetch(`${Gay.cloudBase}/getImageByHash?hash=${data[EVehicleInfo.imageHash]}`)
            .then(async (response) => {
                if (response.status === 200) {
                    const blob = await response.blob();

                    setImage({
                        url: URL.createObjectURL(blob),
                        author: decodeURIComponent(atob(response.headers.get("x-author")!)),
                        loading: true,
                    });
                } else {
                    setImage({ url: "" });
                }
            })
            .catch(() => {
                setImage({ url: "" });
            });
    }, [data]);

    const name = `#${vehicle?.[EVehicle.id]?.split("/")[1]} ${data?.[EVehicleInfo.model] || ""}`;

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

                {data?.[EVehicleInfo.id] && (
                    <>
                        <Box
                            sx={{
                                margin: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.25,
                                "& > :first-of-type": {
                                    borderTopLeftRadius: 24,
                                    borderTopRightRadius: 24,
                                },
                                "& > :last-of-type": {
                                    borderBottomLeftRadius: 24,
                                    borderBottomRightRadius: 24,
                                },
                            }}
                        >
                            <Label title={t("model")} icon={<Commute />} text={data[EVehicleInfo.model]} />
                            {data[EVehicleInfo.depot] && (
                                <Label title={t("depot")} icon={<Garage />} text={data[EVehicleInfo.depot]} />
                            )}
                            {data[EVehicleInfo.carrier] && (
                                <Label
                                    title={t("carrier")}
                                    icon={<BusinessOutlined />}
                                    text={data[EVehicleInfo.carrier]}
                                />
                            )}
                            {data[EVehicleInfo.prodYear] && (
                                <Label
                                    title={t("prodYear")}
                                    icon={<CalendarMonth />}
                                    text={data[EVehicleInfo.prodYear]}
                                />
                            )}
                        </Box>

                        {image ? (
                            image.url && (
                                <>
                                    <img
                                        src={image.url}
                                        alt="vehicle image"
                                        onLoad={() => setImage({ ...image, loading: false })}
                                        style={{
                                            width: "calc(100% - 40px)",
                                            height: "auto",
                                            display: "block",
                                            borderRadius: 24,
                                            margin: 20,
                                            marginBottom: 5,
                                        }}
                                    />

                                    {image.author && (
                                        <Typography
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: "lightgrey",
                                                textAlign: "right",
                                                marginBottom: 1,
                                                marginRight: 3,
                                            }}
                                        >
                                            &copy; {image.author}
                                        </Typography>
                                    )}
                                </>
                            )
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                height={imageHeight}
                                sx={{
                                    borderRadius: 2,
                                    margin: 2,
                                }}
                            />
                        )}
                    </>
                )}

                {!data?.[EVehicle.id] && !isLoading && <Alert Icon={Dangerous} title={t("noData")} />}
                {isLoading && <Loading />}
            </DialogContent>
        </Dialog>
    );
};

const Label = ({ title, icon, text }: { title: string; icon: ReactElement; text?: string }) => (
    <ListItem
        sx={{
            py: 0,
            backgroundColor: "background.paper",
            color: "hsla(0, 0%, 100%, 0.9)",
            minHeight: 56,
        }}
    >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} secondary={text} />
    </ListItem>
);
