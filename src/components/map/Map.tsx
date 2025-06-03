import { memo, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import cities from "cities";
import Map from "react-map-gl";
import { useLocation } from "react-router-dom";
import { getStyle } from "@/util/getMapStyle";

export default memo(({ children }: { children: JSX.Element | JSX.Element[] }) => {
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

    return (
        <Map
            mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA"
            mapStyle={getStyle()}
            onMoveStart={() => document.getElementById("root")?.classList.add("moving")}
            onMoveEnd={() => document.getElementById("root")?.classList.remove("moving")}
            onLoad={({ target }: { target: any }) => {
                target.touchZoomRotate.disableRotation();

                target.getCanvas().addEventListener("webglcontextlost", () => {
                    if (!document.hidden) window.location.reload();
                    else {
                        window.addEventListener("focus", () => {
                            window.location.reload();
                        });
                    }
                });
            }}
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
