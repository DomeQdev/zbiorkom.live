import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Skeleton,
    Typography,
} from "@mui/material";
import { ArrowBack, AcUnit, DirectionsBus, Tram, Train } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getFromAPI } from "@/util/fetchFunctions";
import { useQueryChristmasVehicles, ChristmasVehicle } from "@/hooks/useChristmasVehicles";
import { EVehicleInfo, ERoute, APIVehicle, ETrip, EVehicle } from "typings";
import useGoBack from "@/hooks/useGoBack";
import { SnowEffect } from "@/ui/ChristmasDecorations";

// Typ dla danych o aktualnym kursie pojazdu
type VehicleTrip = {
    isActive: boolean;
    route?: string;
    headsign?: string;
    routeColor?: string;
    routeType?: number;
    brigade?: string;
};

export default () => {
    const { city } = useParams();
    const navigate = useNavigate();
    const goBack = useGoBack();
    const { t } = useTranslation("Christmas");

    const { data: vehicles, isLoading } = useQueryChristmasVehicles(city!);
    const [vehicleTrips, setVehicleTrips] = useState<Record<string, VehicleTrip>>({});
    const [loadingTrips, setLoadingTrips] = useState(false);

    // Fetchowanie informacji o aktualnych kursach pojazdów
    useEffect(() => {
        if (!vehicles?.length) return;

        const fetchTrips = async () => {
            setLoadingTrips(true);
            const trips: Record<string, VehicleTrip> = {};

            await Promise.all(
                vehicles.map(async (vehicle) => {
                    const vehicleId = vehicle[EVehicleInfo.id];
                    try {
                        const response = await getFromAPI<APIVehicle>(city!, "trips/getTripByVehicle", {
                            vehicle: vehicleId,
                        });

                        if (response.vehicle && response.trip) {
                            trips[vehicleId] = {
                                isActive: true,
                                route: response.trip[ETrip.route][ERoute.name],
                                headsign: response.trip[ETrip.headsign],
                                routeColor: response.trip[ETrip.route][ERoute.color],
                                routeType: response.trip[ETrip.route][ERoute.type],
                                brigade: response.vehicle[EVehicle.brigade],
                            };
                        } else {
                            trips[vehicleId] = { isActive: false };
                        }
                    } catch {
                        trips[vehicleId] = { isActive: false };
                    }
                }),
            );

            setVehicleTrips(trips);
            setLoadingTrips(false);
        };

        fetchTrips();
    }, [vehicles, city]);

    const getVehicleTypeIcon = (type?: number) => {
        switch (type) {
            case 0:
                return <Tram sx={{ fontSize: 16 }} />;
            case 2:
                return <Train sx={{ fontSize: 16 }} />;
            default:
                return <DirectionsBus sx={{ fontSize: 16 }} />;
        }
    };

    const sortedVehicles = useMemo(() => {
        if (!vehicles) return [];
        return [...vehicles].sort((a, b) => {
            const tripA = vehicleTrips[a[EVehicleInfo.id]];
            const tripB = vehicleTrips[b[EVehicleInfo.id]];

            const isActiveA = tripA?.isActive ?? false;
            const isActiveB = tripB?.isActive ?? false;

            if (isActiveA !== isActiveB) {
                return isActiveA ? -1 : 1;
            }

            const fleetA = a[EVehicleInfo.id].split("/")[1];
            const fleetB = b[EVehicleInfo.id].split("/")[1];

            return fleetA.localeCompare(fleetB, undefined, { numeric: true });
        });
    }, [vehicles, vehicleTrips]);

    return (
        <Dialog
            open
            onClose={() => goBack()}
            fullWidth={window.innerWidth > 600}
            fullScreen={window.innerWidth <= 600}
            PaperProps={{
                className: "christmas-dialog",
            }}
            sx={(theme) => ({
                "& .MuiDialog-paper": {
                    [theme.breakpoints.up("sm")]: {
                        height: "80%",
                        maxHeight: 700,
                    },
                    overflow: "hidden",
                },
            })}
        >
            {/* Efekt śniegu */}
            <SnowEffect intensity={25} />

            {/* Girlanda na górze */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 2,
                    background: "linear-gradient(180deg, rgba(22, 91, 51, 0.15) 0%, transparent 100%)",
                }}
            >
                <IconButton onClick={() => goBack({ ignoreState: true })}>
                    <ArrowBack />
                </IconButton>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AcUnit sx={{ color: "#87CEEB", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="600">
                        {t("title")}
                    </Typography>
                </Box>
            </DialogTitle>

            <div className="christmas-garland" />

            <DialogContent
                sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    overflowY: "auto",
                    position: "relative",
                }}
            >
                {/* Lista pojazdów */}
                {isLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 4 }} />
                        ))}
                    </Box>
                ) : sortedVehicles.length ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {sortedVehicles.map((vehicle) => (
                            <ChristmasVehicleCard
                                key={vehicle[EVehicleInfo.id]}
                                vehicle={vehicle}
                                tripInfo={vehicleTrips[vehicle[EVehicleInfo.id]]}
                                loadingTrip={loadingTrips}
                                url={`/${city}/vehicle/${encodeURIComponent(vehicle[EVehicleInfo.id])}`}
                                getVehicleTypeIcon={getVehicleTypeIcon}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 6,
                            color: "text.secondary",
                        }}
                    >
                        <AcUnit sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                        <Typography>{t("noVehicles")}</Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

// Komponent karty świątecznego pojazdu
const ChristmasVehicleCard = ({
    vehicle,
    tripInfo,
    loadingTrip,
    url,
    getVehicleTypeIcon,
}: {
    vehicle: ChristmasVehicle;
    tripInfo?: VehicleTrip;
    loadingTrip: boolean;
    url: string;
    getVehicleTypeIcon: (type?: number) => React.ReactNode;
}) => {
    const { t } = useTranslation("Christmas");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(true);

    const vehicleId = vehicle[EVehicleInfo.id];
    const model = vehicle[EVehicleInfo.model];
    const imageHash = vehicle[EVehicleInfo.imageHash];
    const fleetNumber = vehicleId.split("/")[1];

    useEffect(() => {
        if (!imageHash) {
            setImageLoading(false);
            return;
        }

        fetch(`${Gay.cloudBase}/getImageByHash?hash=${imageHash}`)
            .then(async (response) => {
                if (response.ok) {
                    const blob = await response.blob();
                    setImageUrl(URL.createObjectURL(blob));
                }
            })
            .catch(() => {})
            .finally(() => setImageLoading(false));
    }, [imageHash]);

    const isInactive = !loadingTrip && !tripInfo?.isActive;

    return (
        <Box
            className="christmas-vehicle-card"
            component={isInactive ? "div" : Link}
            to={isInactive ? undefined : url}
            state={-2}
            sx={{
                cursor: isInactive ? "default" : "pointer",
                opacity: isInactive ? 0.6 : 1,
                p: 0,
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": !isInactive
                    ? {
                          transform: "scale(1.02) translateY(-4px)",
                          boxShadow: "0 12px 32px rgba(196, 30, 58, 0.25), 0 4px 12px rgba(22, 91, 51, 0.15)",
                          borderColor: "rgba(196, 30, 58, 0.5)",
                      }
                    : {},
            }}
        >
            {/* Zdjęcie pojazdu */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                }}
            >
                {imageLoading ? (
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: "100%" }} />
                ) : imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={model}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, #1a1f26 0%, #2d3748 100%)",
                        }}
                    >
                        <DirectionsBus sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                )}

                {/* Gradient na dole */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Model pojazdu */}
                <Typography
                    variant="h6"
                    sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 16,
                        color: "white",
                        fontWeight: 700,
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        zIndex: 1,
                    }}
                >
                    {model}
                </Typography>

                {/* Badge numeru taborowego */}
                <Chip
                    label={`#${fleetNumber}`}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        fontWeight: 700,
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        backdropFilter: "blur(4px)",
                    }}
                />

                {/* Badge dostępności */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                    }}
                >
                    {loadingTrip ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : tripInfo?.isActive ? (
                        <Chip
                            label={
                                <span>
                                    {t("onRoute")} <strong>{tripInfo.route}</strong>/{tripInfo.brigade}
                                </span>
                            }
                            size="small"
                            icon={getVehicleTypeIcon(tripInfo.routeType) as any}
                            sx={{
                                background: "#165b33",
                                color: "white",
                                backdropFilter: "blur(4px)",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                fontWeight: 500,
                                "& .MuiChip-icon": {
                                    color: "white",
                                },
                            }}
                        />
                    ) : (
                        <Chip
                            label={t("inactive")}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                background: "rgba(0, 0, 0, 0.6)",
                                color: "#aaa",
                                backdropFilter: "blur(4px)",
                            }}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};
