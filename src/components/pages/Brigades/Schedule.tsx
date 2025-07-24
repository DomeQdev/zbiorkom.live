import { useEffect, useMemo, useRef, useState } from "react";
import Sticky from "@/ui/Sticky";
import { Box, DialogContent, DialogTitle, IconButton, Skeleton, Typography } from "@mui/material";
import { ArrowBack, Share } from "@mui/icons-material";
import { Trans, useTranslation } from "react-i18next";
import RouteTag from "@/map/RouteTag";
import useGoBack from "@/hooks/useGoBack";
import { BrigadeTrip, EBrigadeTrip, ERoute, Route } from "typings";
import RouteChip from "@/ui/RouteChip";
import Trip from "./BrigadeTrip";
import MultilineAlert from "./MultilineAlert";
import Helm from "@/util/Helm";
import ScrollButton from "./ScrollButton";
import { msToTime } from "@/util/tools";

type Props = {
    route?: Route;
    brigade?: string;
    trips?: BrigadeTrip[];
};

export default ({ route, brigade, trips }: Props) => {
    const [showScroll, setShowScroll] = useState<"up" | "down" | false>(false);
    const [filteredRoutes, setFilteredRoutes] = useState<string[]>([]);

    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const { t } = useTranslation("Vehicle");
    const goBack = useGoBack();

    const [routes, routeKeys] = useMemo(() => {
        const routeKeys = new Set<string>();
        const routes: Route[] = [];

        for (const trip of trips || []) {
            const route = trip[EBrigadeTrip.route];

            if (!routeKeys.has(route[ERoute.id])) {
                routeKeys.add(route[ERoute.id]);
                routes.push(route);
            }
        }

        return [routes, Array.from(routeKeys)] as const;
    }, [trips]);

    const filteredTrips = trips?.filter((trip) =>
        filteredRoutes.length ? filteredRoutes?.includes(trip[EBrigadeTrip.route][ERoute.id]) : true
    );
    const currentTripIndex = trips?.findIndex((trip) => trip[EBrigadeTrip.vehicle] !== null)!;
    const actualFilteredRoutes = filteredRoutes.length ? filteredRoutes : routeKeys;

    const updateScroll = () => {
        if (!listRef.current?.children.length || currentTripIndex === -1) return;

        const currentTrip = listRef.current.children[currentTripIndex];
        const rect = currentTrip.getBoundingClientRect();
        const isAbove = rect.top < 0;
        const isBelow = rect.bottom > window.innerHeight;

        if (isAbove) setShowScroll("up");
        else if (isBelow) setShowScroll("down");
        else setShowScroll(false);
    };

    useEffect(() => {
        updateScroll();
    }, [trips, listRef]);

    return (
        <>
            {route && brigade && (
                <Helm variable="brigadeSchedule" dictionary={{ route: route[ERoute.name], brigade }} />
            )}

            <Sticky scrollContainer={scrollContainer} element={elementRef}>
                {(percent) => (
                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
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
                                <Trans i18nKey="brigadeSchedule" ns="Brigades">
                                    {route ? (
                                        <RouteTag route={route} brigade={brigade} fontSize="0.8em" />
                                    ) : (
                                        "&nbsp;"
                                    )}
                                </Trans>
                            </span>
                        </div>
                        <IconButton
                            onClick={() =>
                                navigator.share({
                                    url: window.location.pathname,
                                })
                            }
                        >
                            <Share />
                        </IconButton>
                    </DialogTitle>
                )}
            </Sticky>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.3,
                    p: 2,
                    minHeight: !trips ? "100%" : undefined,
                    pointerEvents: !trips ? "none" : undefined,
                    overflow: !trips ? "hidden" : undefined,
                }}
                ref={scrollContainer}
                onScroll={updateScroll}
            >
                <Typography
                    variant="h5"
                    fontWeight="500"
                    ref={elementRef}
                    sx={{
                        padding: "16px",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Trans i18nKey="brigadeSchedule" ns="Brigades">
                        {route ? (
                            <RouteTag route={route} brigade={brigade} fontSize="0.8em" />
                        ) : (
                            <Skeleton variant="rectangular" width={56} height={28} sx={{ borderRadius: 1 }} />
                        )}
                    </Trans>
                </Typography>

                {routeKeys.length > 1 && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            borderRadius: 2,
                            margin: "0 8px 8px 8px",
                            gap: 1,
                        }}
                    >
                        {routes.map((route) => {
                            const routeId = route[ERoute.id];

                            return (
                                <RouteChip
                                    route={route}
                                    key={`route${routeId}`}
                                    style={{
                                        opacity: actualFilteredRoutes?.includes(routeId) ? 1 : 0.5,
                                    }}
                                    onClick={() => {
                                        setFilteredRoutes((prev) => {
                                            if (prev?.includes(routeId)) {
                                                return prev.filter((r) => r !== routeId);
                                            } else {
                                                return [...(prev || []), routeId];
                                            }
                                        });
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}

                {routeKeys.length > 1 && <MultilineAlert />}

                <div ref={listRef}>
                    {filteredTrips && (
                        <>
                            {filteredTrips.map((trip, i) => {
                                let breakTime: string | false = false,
                                    routeChange: string | false = false;

                                const nextTrip = filteredTrips[i + 1];
                                if (nextTrip) {
                                    breakTime = msToTime(nextTrip[EBrigadeTrip.start] - trip[EBrigadeTrip.end]);

                                    if (
                                        trip[EBrigadeTrip.route][ERoute.id] !==
                                        nextTrip[EBrigadeTrip.route][ERoute.id]
                                    ) {
                                        routeChange = nextTrip[EBrigadeTrip.route][ERoute.name];
                                    }
                                }

                                return (
                                    <div key={trip[EBrigadeTrip.id]}>
                                        <Trip trip={trip} showRoute={routeKeys.length > 1} />

                                        {breakTime !== false && (
                                            <span className="breakTime">
                                                {breakTime
                                                    ? t("breakTime", { time: breakTime })
                                                    : t("noBreak")}
                                                {routeChange &&
                                                    ` • ${t("routeChange", { route: routeChange })}`}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {!trips &&
                    new Array(7)
                        .fill(0)
                        .map<React.ReactNode>((_, i) => (
                            <Skeleton
                                key={`skelet-${i}`}
                                variant="rectangular"
                                sx={{ borderRadius: 2, height: 97 }}
                            />
                        ))
                        .reduce((prev, curr, i) => [
                            prev,
                            <Skeleton key={`skelet${i}`} variant="text" width={77} sx={{ marginLeft: 2 }} />,
                            curr,
                        ])}

                <ScrollButton
                    scrollType={showScroll}
                    color={route?.[ERoute.color] || "#000"}
                    onClick={() => {
                        listRef.current?.children[currentTripIndex]?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }}
                />
            </DialogContent>
        </>
    );
};
