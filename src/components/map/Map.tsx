import { mapStyles } from "./mapStyle";
import { memo, ReactElement, useEffect, useMemo } from "react";
import { Map } from "@vis.gl/react-maplibre";
import { useLocation } from "react-router-dom";
import cities from "cities";
import { useMapStyleStore } from "@/hooks/useMapStyleStore";
import { useShallow } from "zustand/react/shallow";

import "maplibre-gl/dist/maplibre-gl.css";

export default memo(({ children }: { children: ReactElement[] }) => {
    const { pathname } = useLocation();
    const [selectedStyle, basicAppearance] = useMapStyleStore(
        useShallow((state) => [state.selectedStyle, state.basicAppearance]),
    );

    useEffect(() => {
        const className = "map-dark";
        const shouldEnable = basicAppearance === "dark";

        if (shouldEnable) {
            document.body.classList.add(className);
        }
        return () => {
            document.body.classList.remove(className);
        };
    }, [selectedStyle, basicAppearance]);

    const initialViewState = useMemo(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("lat") && urlParams.has("lon")) {
            return {
                longitude: +urlParams.get("lon")!,
                latitude: +urlParams.get("lat")!,
                zoom: urlParams.has("zoom") ? +urlParams.get("zoom")! : 16,
            };
        }

        const lastUserLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");
        const moveToLastLocation = localStorage.getItem("moveToLastLocation") === "true";

        if (moveToLastLocation && lastUserLocation?.lastUpdate > Date.now() - 1000 * 60 * 60 * 8) {
            return {
                longitude: lastUserLocation.location[0],
                latitude: lastUserLocation.location[1],
                zoom: 16,
            };
        } else {
            const cityId = pathname.split("/")[1];
            const location = cities[cityId]?.location || cities["warsaw"].location;
            const zoom = cities[cityId]?.zoom || 16;

            return {
                longitude: location[0],
                latitude: location[1],
                zoom,
            };
        }
    }, []);

    return (
        <Map
            mapStyle={mapStyles[selectedStyle].style}
            onMoveStart={() => document.getElementById("root")?.classList.add("moving")}
            onMoveEnd={() => document.getElementById("root")?.classList.remove("moving")}
            onLoad={({ target }) => {
                target.touchZoomRotate.disableRotation();

                target.getCanvas().addEventListener("webglcontextlost", () => {
                    if (!document.hidden) {
                        window.location.reload();
                    } else {
                        document.addEventListener("focus", () => window.location.reload(), {
                            once: true,
                        });
                    }
                });
            }}
            style={{ position: "absolute" }}
            initialViewState={initialViewState}
            attributionControl={false}
            dragRotate={false}
            minZoom={5}
            maxPitch={0}
            reuseMaps
        >
            {children}
        </Map>
    );
});
