import {
    Box,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Skeleton,
    Typography,
} from "@mui/material";
import { memo, useRef } from "react";
import useGoBack from "@/hooks/useGoBack";
import { ArrowBack } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import RouteTag from "@/map/RouteTag";
import { Trans, useTranslation } from "react-i18next";
import Sticky from "@/ui/Sticky";
import Helm from "@/util/Helm";
import useQueryRoute from "@/hooks/useQueryRoute";
import useQueryBrigadeList from "@/hooks/useQueryBrigadeList";
import { EBrigade, ERoute, ERouteInfo } from "typings";

export default memo(() => {
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation("Brigades");
    const { city, route } = useParams();
    const goBack = useGoBack();

    const { data: brigades } = useQueryBrigadeList({
        city: city!,
        route: route!,
    });

    const { data: routeData } = useQueryRoute({
        city: city!,
        route: route!,
    });

    const displayBrigades = !!(brigades && routeData);

    return (
        <>
            {routeData && (
                <Helm
                    variable="brigadeSelect"
                    dictionary={{
                        route: routeData[ERouteInfo.route][ERoute.name],
                    }}
                />
            )}

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
                        <IconButton onClick={() => goBack({ ignoreState: true })}>
                            <ArrowBack />
                        </IconButton>
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                opacity: percent,
                                flexWrap: "wrap",
                            }}
                        >
                            {routeData ? (
                                <Trans i18nKey="selectBrigade" ns="Brigades">
                                    <RouteTag route={routeData[ERouteInfo.route]} />
                                </Trans>
                            ) : (
                                "&nbsp;"
                            )}
                        </span>
                    </DialogTitle>
                )}
            </Sticky>

            <DialogContent
                sx={{
                    p: 0,
                    pointerEvents: !brigades ? "none" : undefined,
                    overflow: !brigades ? "hidden" : undefined,
                }}
                ref={scrollContainer}
            >
                <Typography
                    variant="h5"
                    fontWeight="500"
                    ref={elementRef}
                    sx={{
                        padding: "16px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Trans i18nKey="selectBrigade" ns="Brigades">
                        {routeData ? (
                            <RouteTag route={routeData[ERouteInfo.route]} fontSize="0.8em" />
                        ) : (
                            <Skeleton variant="rectangular" width={56} height={28} sx={{ borderRadius: 1 }} />
                        )}
                    </Trans>
                </Typography>

                <List
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.25,
                        margin: 2,
                        padding: 0,
                        "& .MuiListItemButton-root": {
                            borderRadius: 0,
                            backgroundColor: "background.paper",
                            "& .MuiListItemText-primary": {
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                "& span": {
                                    backgroundColor: routeData?.[ERouteInfo.route][ERoute.color],
                                    color: "hsla(0, 0%, 100%, 0.7)",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    borderRadius: 1,
                                    px: 2,
                                    flexShrink: 0,
                                },
                                "& p": {
                                    color: "text.secondary",
                                },
                            },
                        },
                        "& .MuiListItemButton-root:first-of-type": {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                        },
                        "& .MuiListItemButton-root:last-child": {
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                        },
                    }}
                >
                    {displayBrigades &&
                        brigades?.map((brigade) => (
                            <ListItemButton
                                key={brigade[EBrigade.brigade]}
                                component={Link}
                                to={brigade[EBrigade.brigade]}
                            >
                                <ListItemText
                                    primary={
                                        <>
                                            <span>{brigade[EBrigade.brigade]}</span>

                                            <Typography>
                                                {[
                                                    t("trips", {
                                                        tripsLength: brigade[EBrigade.numberOfTrips],
                                                    }),
                                                    brigade[2],
                                                ].join(" · ")}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItemButton>
                        ))}

                    {!displayBrigades &&
                        new Array(5).fill(0).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                height={48}
                                sx={{
                                    borderTopLeftRadius: i === 0 ? 16 : 0,
                                    borderTopRightRadius: i === 0 ? 16 : 0,
                                    borderBottomLeftRadius: i === 4 ? 16 : 0,
                                    borderBottomRightRadius: i === 4 ? 16 : 0,
                                }}
                            />
                        ))}
                </List>
            </DialogContent>
        </>
    );
});
