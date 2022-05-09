import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Vehicle, City, Trip } from "../util/typings";
import { Polyline, useMap } from "react-leaflet";
import { toast } from "react-toastify";
import { translate, Translate } from "../util/Translations";
import VehicleMarker from "../components/VehicleMarker";
import StopMarker from "../components/StopMarker";
import BottomSheet from "../components/BottomSheet";
import Brigade from "./Brigade";
import VehicleInfo from "./VehicleInfo";
import cities from "../util/cities.json";

export default ({ vehicles, city }: {
    vehicles: Vehicle[],
    city: City
}) => {
    const navigate = useNavigate();
    const map = useMap();
    const { type, tab } = useParams<{ type: "bus" | "tram" | "km" | "skm" | "wkd" | "metro", tab: string }>();
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [trip, setTrip] = useState<Trip>();

    useEffect(() => {
        if (!vehicles.length) return;

        let veh = vehicles.find(v => v.type === type && v.tab === tab);
        if (!veh) {
            toast.error(translate(vehicle ? "vehicle_lost" : "vehicle_not_found"));
            return navigate(`/${city}`);
        }
        if (veh && !vehicle) map.setView(veh.location, 17);
        setVehicle(veh);

        //@ts-ignore
        if (!veh?.trip) return setTrip({ error: true });

        if (!trip?.error && veh?.trip && (!trip || trip.id !== veh.trip)) fetch(cities[city].api.trip.replace("{{trip}}", veh.trip)).then(res => res.json())
            .then(setTrip)
            .catch(() => {
                toast.error(translate("fatal_error"));
                return navigate(`/${city}`);
            });
    }, [vehicles]);

    return <>
        {vehicle && <VehicleMarker vehicle={vehicle} city={city} trip />}
        {trip?.shapes && <Polyline positions={trip.shapes} pathOptions={{ color: trip.color, weight: 8 }} />}
        {trip?.stops && trip.stops.map((stop, i) => <StopMarker stop={stop} color={trip?.color} key={i} />)}
        <BottomSheet trip={trip} vehicle={vehicle} city={city} />
        {vehicle && vehicle.brigade && <Routes>
            <Route path="brigade" element={<Brigade city={city} vehicle={vehicle} />} />
            <Route path="vehicle" element={<VehicleInfo city={city} vehicle={vehicle} />} />
        </Routes>}
    </>;
};