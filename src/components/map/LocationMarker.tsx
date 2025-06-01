import { ArrowDropUp, GpsNotFixed, LocationDisabled } from "@mui/icons-material";
import { memo, useEffect, useState } from "react";
import { Marker, useMap } from "react-map-gl";
import { Box, Fab } from "@mui/material";
import useLocationStore from "@/hooks/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import { Location } from "typings";

export default memo(() => {
    const [userLocation, setUserLocation] = useLocationStore(
        useShallow((state) => [state.userLocation, state.setUserLocation])
    );
    const [userPermitted, setUserPermitted] = useState<boolean>(false);
    const [bearing, setBearing] = useState<number>();
    const map = useMap()?.current;

    useEffect(() => {
        if (!navigator.permissions?.query || !navigator.geolocation)
            return alert("Twoja przeglądarka nie obsługuje geolokalizacji.");

        navigator.permissions
            .query({ name: "geolocation" })
            .then(({ state }) => setUserPermitted(state === "granted"));

        const eventName =
            "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";

        if ("DeviceOrientationEvent" in window) {
            // @ts-ignore
            DeviceOrientationEvent.requestPermission?.();
        }

        window.addEventListener(eventName, handleOrientation, false);

        return () => {
            window.removeEventListener(eventName, handleOrientation);
        };
    }, []);

    useEffect(() => {
        if (userPermitted) {
            return watchPosition();
        }
    }, [userPermitted]);

    const handleLocation = ({ coords }: GeolocationPosition) => {
        const location = [coords.longitude, coords.latitude] as Location;

        setUserLocation(location);
        localStorage.setItem(
            "userLocation",
            JSON.stringify({
                location,
                lastUpdate: Date.now(),
            })
        );
    };

    const watchPosition = () => {
        navigator.geolocation.getCurrentPosition(handleLocation, undefined, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
        });

        const watchId = navigator.geolocation.watchPosition(handleLocation, undefined, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    };

    const handleOrientation = ({ alpha, absolute }: DeviceOrientationEvent) => {
        if (absolute === true && alpha !== null) {
            setBearing(alpha * -1);
        }
    };

    const moveToLocation = (location: [number, number]) => {
        if (map) {
            const zoom = map.getZoom();

            map.easeTo({
                center: location,
                zoom: zoom > 15 ? zoom : 15,
            });
        }
    };

    const moveToUser = () => {
        if (!userPermitted) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { coords } = location;

                    setUserPermitted(true);
                    handleLocation(location);
                    moveToLocation([coords.longitude, coords.latitude]);
                },
                (e) => {
                    console.error(e);
                    alert("Nie można określić Twojej lokalizacji.");
                }
            );
        } else if (userLocation?.[0]) {
            moveToLocation(userLocation);
        }
    };

    return (
        <>
            <Fab
                color="primary"
                sx={{ position: "absolute", right: 16, bottom: 16 }}
                size="large"
                onClick={() => moveToUser()}
                id="gps"
            >
                {userLocation?.[0] ? <GpsNotFixed /> : <LocationDisabled />}
            </Fab>

            {userLocation && (
                <Marker
                    longitude={userLocation[0]}
                    latitude={userLocation[1]}
                    rotation={bearing}
                    style={{ zIndex: 1 }}
                    pitchAlignment="map"
                    rotationAlignment="map"
                >
                    {bearing !== undefined && (
                        <ArrowDropUp
                            sx={{
                                color: "#1da1f2",
                                transform: "translate(-5.5px, -20px)",
                                position: "absolute",
                                fontSize: 30,
                                borderColor: "primary.main",
                            }}
                        />
                    )}
                    <Box
                        sx={{
                            width: 19,
                            height: 19,
                            borderRadius: "50%",
                            backgroundColor: "#1da1f2",
                            border: "3px solid white",
                            boxShadow: "0 0 3px rgba(0,0,0,.35)",
                        }}
                    />
                </Marker>
            )}
        </>
    );
});
