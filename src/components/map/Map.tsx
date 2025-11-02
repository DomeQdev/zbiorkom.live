import { basicStyle } from "./mapStyle";
import { memo, ReactElement, useMemo, useState } from "react";
import { Map } from "@vis.gl/react-maplibre";
import { useLocation } from "react-router-dom";
import Error from "@/pages/Error";
import cities from "cities";

import "maplibre-gl/dist/maplibre-gl.css";

export default memo(({ children }: { children: ReactElement[] }) => {
    const [error, setError] = useState<string>();
    const { pathname } = useLocation();

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

    if (error) return <Error message={error} />;

    return (
        <Map
            mapStyle={basicStyle}
            onMoveStart={() => document.getElementById("root")?.classList.add("moving")}
            onMoveEnd={() => document.getElementById("root")?.classList.remove("moving")}
            onLoad={({ target }) => {
                target.touchZoomRotate.disableRotation();

                target.getCanvas().addEventListener("webglcontextlost", () => {
                    setError("WebGL context lost");
                });
            }}
            onError={(e) => setError(e.error.message)}
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
