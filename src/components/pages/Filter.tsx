import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMap } from "react-map-gl";
import VehicleMarker from "@/map/VehicleMarker";
import Helm from "@/util/Helm";
import useFilterStore from "@/hooks/useFilterStore";
import { useShallow } from "zustand/react/shallow";
import useQueryMarkers from "@/hooks/useQueryMarkers";
import DotMarkers from "@/map/DotMarkers";
import { ERoute, EVehicle } from "typings";

export default () => {
    const { current: map } = useMap();
    const { city } = useParams();

    const showBrigade = localStorage.getItem("brigade") === "true";
    const showFleet = localStorage.getItem("fleet") === "true";

    const [tempRoutes, tempModels, useTemp, setSearch, setInitialPosition, applyChanges] = useFilterStore(
        useShallow((state) => [
            state.tempRoutes,
            state.tempModels,
            state.useTemp,
            state.setSearch,
            state.setInitialPosition,
            state.applyChanges,
        ]),
    );

    const { data } = useQueryMarkers({
        city: city!,
        options: {
            filterRoutes: tempRoutes.map((route) => route[ERoute.id]),
            filterModels: tempModels,
            zoom: 1,
        },
        disabled: !(tempRoutes.length || tempModels.length),
    });

    useEffect(() => {
        setInitialPosition([map?.getZoom()!, map?.getCenter()!]);
        useTemp();

        return () => {
            applyChanges();
            setSearch("");

            map?.setPadding({ left: 0, top: 0, right: 0, bottom: 0 });
        };
    }, []);

    useEffect(() => {
        if (data?.bbox) {
            map?.fitBounds(data.bbox, {
                maxZoom: 15,
                padding: { top: 50, left: 50, right: 50, bottom: 50 },
                maxDuration: 1000,
            });
        }
    }, [data]);

    return (
        <>
            <Helm variable="city" />

            {data?.useDots ? (
                <DotMarkers vehicles={data.positions} />
            ) : (
                data?.positions.map((vehicle) => (
                    <VehicleMarker
                        key={vehicle[EVehicle.id]}
                        vehicle={vehicle}
                        showBrigade={showBrigade}
                        showFleet={showFleet}
                    />
                ))
            )}
        </>
    );
};
