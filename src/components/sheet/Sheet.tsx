import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet-updated";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { SheetContentTypes } from "typings";
import useGoBack from "@/hooks/useGoBack";
import { Box } from "@mui/material";
import getType from "./getType";

const FavoriteStopsHeader = lazy(() => import("./FavoriteStops/FavoriteStopsHeader"));
const FavoriteStopsContent = lazy(() => import("./FavoriteStops/FavoriteStopsContent"));

const FilterHeader = lazy(() => import("./Filter/FilterHeader"));
const FilterContent = lazy(() => import("./Filter/FilterContent"));

const RouteHeader = lazy(() => import("./Route/RouteHeader"));
const RouteContent = lazy(() => import("./Route/RouteContent"));

const StationHeader = lazy(() => import("./Station/StationHeader"));
const StationContent = lazy(() => import("./Station/StationContent"));

const StopHeader = lazy(() => import("./Stop/StopHeader"));
const StopContent = lazy(() => import("./Stop/StopContent"));

const TripHeader = lazy(() => import("./Trip/TripHeader"));
const TripContent = lazy(() => import("./Trip/TripContent"));

const VehicleHeader = lazy(() => import("./Vehicle/VehicleHeader"));
const VehicleContent = lazy(() => import("./Vehicle/VehicleContent"));

export default () => {
    const [closing, setClosing] = useState<boolean>(false);
    const sheetRef = useRef<BottomSheetRef>(null);
    const goBack = useGoBack();

    const type = getType();
    const blocking = type === "Filter" || type === "FavoriteStops";

    useEffect(() => {
        sheetRef.current?.snapTo(0);
    }, [type]);

    return (
        <BottomSheet
            open={!!type}
            style={
                {
                    "--rsbs-bg": "var(--mui-palette-background-default)",
                    "--rsbs-handle-bg": "hsla(0, 0%, 100%, 0.6)",
                    color: "hsla(0, 0%, 100%, 0.9)",
                    position: "absolute",
                    zIndex: 1299,
                } as React.CSSProperties
            }
            snapPoints={({ maxHeight }) =>
                blocking ? [maxHeight / 1.8] : [maxHeight / 1.5, maxHeight / 2, maxHeight / 3]
            }
            defaultSnap={1}
            blocking={blocking}
            onDismiss={() => {
                if (!closing) {
                    setClosing(true);
                    goBack();
                    setTimeout(() => setClosing(false), 100);
                }
            }}
            header={<Suspense>{renderHeader(type)}</Suspense>}
            data-body-scroll-lock-ignore
            ref={sheetRef}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                }}
            >
                <Suspense fallback={<p>&nbsp;</p>}>{renderContent(type)}</Suspense>
            </Box>
            <p>&nbsp;</p>
        </BottomSheet>
    );
};

const renderHeader = (type: SheetContentTypes) => {
    if (type === "FavoriteStops") return <FavoriteStopsHeader />;
    else if (type === "Filter") return <FilterHeader />;
    else if (type === "Route") return <RouteHeader />;
    else if (type === "Station") return <StationHeader />;
    else if (type === "Stop") return <StopHeader />;
    else if (type === "Vehicle") return <VehicleHeader />;
    else if (type === "Trip") return <TripHeader />;
};

const renderContent = (type: SheetContentTypes) => {
    if (type === "FavoriteStops") return <FavoriteStopsContent />;
    else if (type === "Filter") return <FilterContent />;
    else if (type === "Route") return <RouteContent />;
    else if (type === "Station") return <StationContent />;
    else if (type === "Stop") return <StopContent />;
    else if (type === "Vehicle") return <VehicleContent />;
    else if (type === "Trip") return <TripContent />;
    else return <p />;
};
