import { memo, ReactElement, useMemo, useState } from "react";
import { Map } from "@vis.gl/react-maplibre";
import { useLocation } from "react-router-dom";
import mapStyle from "./mapStyle";
import cities from "cities";

import "maplibre-gl/dist/maplibre-gl.css";

export default memo(({ children }: { children: ReactElement[] }) => {
    const [error, setError] = useState<string | undefined>();
    const { pathname } = useLocation();

    const initialViewState = useMemo(() => {
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

    if (error) return <span>{error}</span>;

    return (
        <Map
            mapStyle={mapStyle}
            onMoveStart={() => document.getElementById("root")?.classList.add("moving")}
            onMoveEnd={() => document.getElementById("root")?.classList.remove("moving")}
            onLoad={({ target }: { target: any }) => {
                target.touchZoomRotate.disableRotation();

                target.getCanvas().addEventListener("webglcontextlost", () => {
                    if (!document.hidden) {
                        window.location.reload();
                    } else {
                        window.addEventListener("focus", () => {
                            window.location.reload();
                        });
                    }
                });
            }}
            onError={(e) => setError(e.error.message)}
            style={{ position: "absolute" }}
            initialViewState={initialViewState}
            dragRotate={false}
            maxPitch={0}
            reuseMaps
        >
            {children}
        </Map>
    );
});
